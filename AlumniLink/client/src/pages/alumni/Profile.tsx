import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { profileApi } from '../../api/profile.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function AlumniProfile() {
  const toast = useToast();
  const { user, refreshMe } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [form, setForm] = useState({
    company: '',
    designation: '',
    workEmail: '',
    contactPhone: '',
    linkedin: '',
    bio: '',
  });

  useEffect(() => {
    profileApi.me().then((res) => {
      const p = res.data.profile || {};
      setForm({
        company: p.company || '',
        designation: p.designation || '',
        workEmail: p.workEmail || '',
        contactPhone: p.contactPhone || '',
        linkedin: p.linkedin || '',
        bio: p.bio || '',
      });
    });
  }, []);

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="font-display text-3xl">Alumni profile</h1>
      <Card className="mt-6 space-y-4 p-5">
        <Input label="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <Button variant="outline" onClick={async () => {
          const name = displayName.trim();
          if (name.length < 2 || name.length > 60) { toast.error('Name must be between 2 and 60 characters'); return; }
          try { await profileApi.updateName(name); await refreshMe(); toast.success('Name updated'); }
          catch (err) { toast.error(err.response?.data?.message || 'Name update failed'); }
        }}>Update name</Button>
        <Input
          label="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <Input
          label="Designation"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
        />
        <Input
          label="Work email (private)"
          value={form.workEmail}
          onChange={(e) => setForm({ ...form, workEmail: e.target.value })}
        />
        <Input
          label="Contact phone (shared only after application approval)"
          value={form.contactPhone}
          onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
        />
        <Input
          label="LinkedIn"
          value={form.linkedin}
          onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
        />
        <Textarea
          label="Bio"
          rows={4}
          maxLength={500}
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />
        <Button
          onClick={async () => {
            try {
              await profileApi.updateAlumni(form);
              toast.success('Profile saved');
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
