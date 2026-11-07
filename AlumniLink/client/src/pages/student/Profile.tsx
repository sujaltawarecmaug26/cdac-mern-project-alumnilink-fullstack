import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Chip } from '../../components/ui/Chip.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { profileApi } from '../../api/profile.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function StudentProfile() {
  const toast = useToast();
  const { refreshMe, user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [form, setForm] = useState({
    headline: '',
    bio: '',
    skills: [],
    github: '',
    linkedin: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [resumeName, setResumeName] = useState('');

  useEffect(() => {
    profileApi.me().then((res) => {
      const p = res.data.profile || {};
      setForm({
        headline: p.headline || '',
        bio: p.bio || '',
        skills: p.skills || [],
        github: p.github || '',
        linkedin: p.linkedin || '',
      });
      setResumeName(p.resumeName || '');
    });
  }, []);

  return (
    <PageContainer className="max-w-3xl">
      <div className="mb-4">
        <h1 className="font-display text-3xl">Student profile</h1>
        <p className="mt-1 text-sm text-muted">Keep your details and current PDF resume up to date.</p>
      </div>
      <Card className="space-y-4 p-5">
        <Input label="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <Button variant="outline" onClick={async () => {
          const name = displayName.trim();
          if (name.length < 2 || name.length > 60) { toast.error('Name must be between 2 and 60 characters'); return; }
          try { await profileApi.updateName(name); await refreshMe(); toast.success('Name updated'); }
          catch (err) { toast.error(err.response?.data?.message || 'Name update failed'); }
        }}>Update name</Button>
        <Input
          label="Headline"
          value={form.headline}
          onChange={(e) => setForm({ ...form, headline: e.target.value })}
        />
        <Textarea
          label="Bio"
          rows={4}
          maxLength={500}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <div>
          <span className="mb-1.5 block text-[11px] font-semibold uppercase text-muted">Skills</span>
          <div className="mb-2 flex flex-wrap gap-2">
            {form.skills.map((s) => (
              <Chip
                key={s}
                tone="primary"
                onRemove={() =>
                  setForm({ ...form, skills: form.skills.filter((x) => x !== s) })
                }
              >
                {s}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-sand px-3 py-2 text-sm"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add skill"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const s = skillInput.trim().toLowerCase();
                if (!s) return;
                setForm({ ...form, skills: [...new Set([...form.skills, s])] });
                setSkillInput('');
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="GitHub"
            value={form.github}
            onChange={(e) => setForm({ ...form, github: e.target.value })}
          />
          <Input
            label="LinkedIn"
            value={form.linkedin}
            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
          />
        </div>
        <div>
          <p className="mb-2 text-sm text-muted">Resume: {resumeName || 'None'}</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.type !== 'application/pdf') { toast.error('Only PDF resumes are allowed'); e.target.value = ''; return; }
              if (file.size > 2 * 1024 * 1024) { toast.error('Resume must be 2 MB or smaller'); e.target.value = ''; return; }
              try {
                const res = await profileApi.uploadResume(file);
                setResumeName(file.name);
                toast.success('Resume uploaded');
                refreshMe();
              } catch (err) {
                toast.error(err.response?.data?.message || 'Upload failed');
              }
            }}
          />
        </div>
        <Button
          onClick={async () => {
            try {
              const res = await profileApi.updateStudent(form);
              toast.success('Profile saved');
              refreshMe();
            } catch (err) {
              toast.error(err.response?.data?.message || 'Save failed');
            }
          }}
        >
          Save profile
        </Button>
      </Card>
    </PageContainer>
  );
}
