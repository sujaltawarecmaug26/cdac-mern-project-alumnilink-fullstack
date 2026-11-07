import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Skeleton } from '../../components/ui/Skeleton.tsx';
import { jobsApi } from '../../api/jobs.js';
import { applicationsApi } from '../../api/applications.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../context/ToastContext.tsx';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const load = () => jobsApi.get(id).then(r => setData(r.data)).catch(e => toast.error(e.response?.data?.message || 'Job not found')).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);
  if (loading) return <PageContainer><Skeleton className="h-72"/></PageContainer>;
  if (!data?.job) return <PageContainer><p className="text-danger">Job not found.</p><Link className="text-primary underline" to="/jobs">Back to jobs</Link></PageContainer>;
  const { job, alumniProfile, application } = data;
  return <PageContainer>
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Card className="p-6">
        <p className="text-sm font-semibold text-primary">{job.company}</p><h1 className="mt-1 font-display text-3xl">{job.title}</h1>
        <p className="mt-3 text-sm text-muted">{job.location} · {job.experience} · Posted by {job.alumniId?.name || 'Verified alumnus'}</p>
        <h2 className="mt-7 font-semibold">About this role</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{job.description}</p>
        <h2 className="mt-6 font-semibold">Skills required</h2><div className="mt-2 flex flex-wrap gap-2">{(job.skills || []).map(s => <span key={s} className="rounded-full bg-sand px-3 py-1 text-xs">{s}</span>)}</div>
        {job.jobUrl && <p className="mt-5"><a className="text-sm text-primary underline" href={job.jobUrl} target="_blank" rel="noreferrer">Company job listing</a></p>}
        <div className="mt-7 rounded-xl bg-sand/50 p-4"><p className="font-semibold">{job.alumniId?.name}</p><p className="text-sm text-muted">{alumniProfile?.designation} · {alumniProfile?.company || job.company}</p><p className="mt-2 text-xs text-success">Verified alumnus</p></div>
      </Card>
      <Card className="h-fit p-5">
        <h2 className="font-display text-xl">Apply for this job</h2>
        {user?.role !== 'student' ? <p className="mt-3 text-sm text-muted">Only students can apply.</p> :
          application ? <div className="mt-4 rounded-xl bg-sand/50 p-4"><p className="font-semibold">You have already applied</p><p className="mt-1 text-sm capitalize text-muted">Status: {application.status}</p><Link className="mt-3 inline-block text-sm text-primary underline" to="/applications">View my applications</Link></div> :
          <form className="mt-4 space-y-3" onSubmit={async e => { e.preventDefault(); setSubmitting(true); try { await jobsApi.apply(id, { note }); toast.success('Application submitted'); await load(); } catch(err) { toast.error(err.response?.data?.message || 'Could not apply'); } finally { setSubmitting(false); } }}>
            <p className="text-sm text-muted">Your saved PDF resume will be attached automatically. Make sure it is uploaded in your profile.</p>
            <Textarea label="Note to alumnus (optional)" rows={4} value={note} onChange={e => setNote(e.target.value)} />
            <Button type="submit" disabled={submitting || job.status !== 'open'}>{submitting ? 'Submitting...' : 'Submit application'}</Button>
            <Link className="block text-xs text-primary underline" to="/profile">Manage my profile and resume</Link>
          </form>}
        {application?.status === 'approved' && <div className="mt-4"><Button variant="outline" onClick={async () => { try { const r = await applicationsApi.contact(application._id); setContact(r.data); } catch(e) { toast.error(e.response?.data?.message || 'Contact unavailable'); } }}>View alumni contact</Button></div>}
        {contact && <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm"><p className="font-semibold">{contact.name}</p><p>{contact.email || 'Email not provided'}</p><p>{contact.phone || 'Phone not provided'}</p>{contact.linkedin && <a className="text-primary underline" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}</div>}
      </Card>
    </div>
  </PageContainer>;
}
