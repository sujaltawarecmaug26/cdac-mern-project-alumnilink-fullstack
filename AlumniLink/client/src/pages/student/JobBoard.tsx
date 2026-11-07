import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Skeleton } from '../../components/ui/Skeleton.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { jobsApi } from '../../api/jobs.js';

export default function JobBoard() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = setTimeout(() => jobsApi.list({ q, limit: 30 })
      .then(res => { if (active) setItems(res.data || []); })
      .catch(err => { if (active) setError(err.response?.data?.message || 'Could not load jobs'); })
      .finally(() => { if (active) setLoading(false); }), 250);
    return () => { active = false; clearTimeout(timer); };
  }, [q]);
  return <PageContainer>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Opportunities</p><h1 className="font-display text-3xl">Find your next opportunity</h1><p className="mt-1 text-muted">Explore jobs shared by verified alumni.</p></div>
      <div className="w-full sm:max-w-sm"><Input placeholder="Search job title, company or skills..." value={q} onChange={e => setQ(e.target.value)} /></div>
    </div>
    {error && <p className="mt-5 text-danger">{error}</p>}
    {loading ? <div className="mt-6 grid gap-4 md:grid-cols-2"><Skeleton className="h-44"/><Skeleton className="h-44"/></div> : null}
    {!loading && !error && !items.length ? <div className="mt-6"><EmptyState title="No jobs found" message="Try a different search. Check back later for new opportunities."/></div> : null}
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {items.map(job => <Card key={job._id} className="p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-xl">{job.title}</h2><p className="mt-1 text-sm font-medium text-primary">{job.company}</p></div><span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-success">Open</span></div>
        <p className="mt-3 text-sm text-muted">{job.location} · {job.experience} · {job.alumniId?.name ? `Posted by ${job.alumniId.name}` : 'Verified alumnus'}</p>
        <p className="mt-3 line-clamp-3 text-sm text-cocoa">{job.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">{(job.skills || []).slice(0,5).map(s => <span key={s} className="rounded-full bg-sand px-2.5 py-1 text-xs text-cocoa">{s}</span>)}</div>
        <div className="mt-5"><Link to={`/jobs/${job._id}`}><Button>View details</Button></Link></div>
      </Card>)}
    </div>
  </PageContainer>;
}
