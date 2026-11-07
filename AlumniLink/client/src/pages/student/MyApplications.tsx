import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { Skeleton } from '../../components/ui/Skeleton.tsx';
import { applicationsApi } from '../../api/applications.js';
import { useToast } from '../../context/ToastContext.tsx';

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState({});
  const toast = useToast();
  const load = () => applicationsApi.mine().then(r => setItems(r.data || [])).catch(e => toast.error(e.response?.data?.message || 'Could not load applications')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const tone = { pending: 'bg-amber-50 text-amber-800', approved: 'bg-green-50 text-green-800', rejected: 'bg-red-50 text-red-800' };
  return <PageContainer>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Your activity</p><h1 className="font-display text-3xl">My applications</h1><p className="mt-1 text-sm text-muted">Track the status of jobs you have applied for.</p></div><Link to="/jobs"><Button variant="outline">Browse jobs</Button></Link></div>
    {loading ? <div className="mt-6 space-y-3"><Skeleton className="h-28"/><Skeleton className="h-28"/></div> : null}
    {!loading && !items.length ? <div className="mt-6"><EmptyState title="No applications yet" message="Explore jobs posted by verified alumni and apply with your saved resume."/></div> : null}
    <div className="mt-6 space-y-3">{items.map(app => <Card key={app._id} className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-xl">{app.jobId?.title || 'Job no longer available'}</h2><p className="text-sm text-primary">{app.jobId?.company}</p><p className="mt-1 text-xs text-muted">{app.jobId?.location} · Applied {new Date(app.createdAt).toLocaleDateString()}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${tone[app.status] || ''}`}>{app.status}</span></div>
      <p className="mt-3 text-sm text-muted">Resume submitted: {app.resumeName}</p>
      {app.decisionNote && <p className="mt-2 text-sm text-muted">Message: {app.decisionNote}</p>}
      {app.status === 'approved' && <div className="mt-4"><Button onClick={async () => { try { const r = await applicationsApi.contact(app._id); setContacts(p => ({...p,[app._id]:r.data})); } catch(e) { toast.error(e.response?.data?.message || 'Contact unavailable'); } }}>View alumni contact</Button></div>}
      {contacts[app._id] && <div className="mt-3 rounded-xl bg-green-50 p-3 text-sm"><p className="font-semibold">{contacts[app._id].name}</p><p>{contacts[app._id].email || 'Email not provided'}</p><p>{contacts[app._id].phone || 'Phone not provided'}</p>{contacts[app._id].linkedin && <a className="text-primary underline" href={contacts[app._id].linkedin} target="_blank" rel="noreferrer">LinkedIn profile</a>}</div>}
    </Card>)}</div>
  </PageContainer>;
}
