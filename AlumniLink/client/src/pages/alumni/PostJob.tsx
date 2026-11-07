import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { jobsApi } from '../../api/jobs.js';
import { profileApi } from '../../api/profile.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../context/ToastContext.tsx';

const blank = { company: '', title: '', description: '', location: '', experience: 'fresher', skills: '', jobUrl: '', deadline: '' };
export default function PostJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isPendingAlumni, isVerifiedAlumni } = useAuth();
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    profileApi.me().then(r => setForm(p => ({...p, company: r.data.profile?.company || ''}))).catch(()=>{});
    if (id) jobsApi.get(id).then(r => { const j = r.data.job; setForm({ company:j.company,title:j.title,description:j.description,location:j.location,experience:j.experience,skills:(j.skills||[]).join(', '),jobUrl:j.jobUrl||'',deadline:j.deadline ? j.deadline.slice(0,10) : '' }); }).catch(e=>toast.error(e.response?.data?.message || 'Could not load job'));
  }, [id]);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  return <PageContainer className="max-w-3xl">
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">Alumni opportunities</p><h1 className="font-display text-3xl">{id ? 'Edit job' : 'Post a job'}</h1>
    {!isVerifiedAlumni && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Your account is awaiting admin verification. You can post jobs after approval.</p>}
    <Card className="mt-6 space-y-4 p-5">
      <div className="grid gap-4 sm:grid-cols-2"><Input label="Company" value={form.company} onChange={e=>set('company',e.target.value)} required/><Input label="Job title" value={form.title} onChange={e=>set('title',e.target.value)} required/><Input label="Location" value={form.location} onChange={e=>set('location',e.target.value)} required/><Select label="Experience" value={form.experience} onChange={e=>set('experience',e.target.value)}><option value="fresher">0-1 year</option><option value="junior">1-3 years</option><option value="mid">3+ years</option></Select></div>
      <Textarea label="Job description" rows={6} value={form.description} onChange={e=>set('description',e.target.value)} />
      <Input label="Required skills (comma separated)" value={form.skills} onChange={e=>set('skills',e.target.value)} placeholder="Java, React, SQL"/>
      <div className="grid gap-4 sm:grid-cols-2"><Input label="External job URL (optional)" value={form.jobUrl} onChange={e=>set('jobUrl',e.target.value)}/><Input label="Application deadline (optional)" type="date" value={form.deadline} onChange={e=>set('deadline',e.target.value)}/></div>
      <Button disabled={busy || !isVerifiedAlumni} onClick={async()=>{ if(!form.company.trim()||!form.title.trim()||form.description.trim().length<10||!form.location.trim()){toast.error('Complete company, title, location and a 10-character description');return;} setBusy(true); const body={...form,skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean),deadline:form.deadline||null}; try { if(id) await jobsApi.update(id,body); else await jobsApi.create(body); toast.success(id?'Job updated':'Job published'); navigate('/alumni'); } catch(e){toast.error(e.response?.data?.message||'Could not save job');} finally{setBusy(false);} }}>{busy?'Saving...':id?'Save changes':'Publish job'}</Button>
    </Card>
  </PageContainer>;
}
