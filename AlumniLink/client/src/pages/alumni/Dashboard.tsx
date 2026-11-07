import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { Skeleton } from '../../components/ui/Skeleton.tsx';
import { jobsApi } from '../../api/jobs.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function AlumniDashboard() {
  const { user, isPendingAlumni } = useAuth();
  const { data: jobs, loading, error, reload } = useFetch(() => jobsApi.mine(), []);
  const items = jobs || [];
  const open = items.filter(j=>j.status==='open').length;
  const totalApplications = items.reduce((sum,j)=>sum+(j.applicationCount||0),0);
  return <PageContainer>
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">Alumni workspace</p><h1 className="font-display text-3xl">Welcome, {user?.name?.split(' ')[0]}</h1>
    <p className="mt-1 text-muted">Share relevant opportunities and review applications from students.</p>
    {isPendingAlumni && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Your account is pending admin verification. You can complete your profile, but job posting is disabled until verification.</div>}
    <div className="mt-6 grid gap-4 sm:grid-cols-3">{[['Jobs posted',items.length],['Open jobs',open],['Applications received',totalApplications]].map(([label,value])=><Card key={label} className="p-5"><p className="text-sm text-muted">{label}</p><p className="mt-1 font-display text-3xl text-primary">{value}</p></Card>)}</div>
    <div className="mt-6 flex flex-wrap gap-2"><Link to="/alumni/jobs/new"><Button disabled={isPendingAlumni}>Post a job</Button></Link><Link to="/alumni/applications"><Button variant="outline">View applications</Button></Link><Link to="/alumni/profile"><Button variant="outline">Edit profile</Button></Link></div>
    <div className="mt-8 flex items-center justify-between"><h2 className="font-display text-2xl">Your job posts</h2><Button variant="outline" onClick={reload}>Refresh</Button></div>
    {loading&&<Skeleton className="mt-4 h-24"/>}{error&&<p className="mt-3 text-danger">{error}</p>}
    {!loading&&!items.length&&<div className="mt-4"><EmptyState title="No jobs posted yet" message="Create your first job post to connect with students."/></div>}
    <div className="mt-4 space-y-3">{items.map(job=><Card key={job._id} className="flex flex-wrap items-center justify-between gap-3 p-5"><div><h3 className="font-semibold">{job.title}</h3><p className="text-sm text-muted">{job.company} · {job.location} · {job.applicationCount} applications</p><span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs capitalize ${job.status==='open'?'bg-green-50 text-success':'bg-sand text-muted'}`}>{job.status}</span></div><div className="flex gap-2">{job.status==='open'&&<Link to={`/alumni/jobs/${job._id}/edit`}><Button variant="outline">Edit</Button></Link>}{job.status==='open'&&<Button variant="outline" onClick={async()=>{try{await jobsApi.close(job._id);reload();}catch(e){alert(e.response?.data?.message||'Could not close job');}}}>Close job</Button>}</div></Card>)}</div>
  </PageContainer>;
}
