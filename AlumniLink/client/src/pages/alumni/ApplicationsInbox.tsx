import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { EmptyState } from '../../components/ui/EmptyState.tsx';
import { Skeleton } from '../../components/ui/Skeleton.tsx';
import { applicationsApi } from '../../api/applications.js';
import { useToast } from '../../context/ToastContext.tsx';

export default function AlumniInbox() {
  const toast = useToast();
  const [items,setItems] = useState([]);
  const [jobs,setJobs] = useState([]);
  const [jobId,setJobId] = useState('');
  const [status,setStatus] = useState('pending');
  const [loading,setLoading] = useState(true);
  const load = () => applicationsApi.inbox({jobId:jobId||undefined,status:status||undefined}).then(r=>{setItems(r.data||[]);setJobs(r.meta?.jobs||[]);}).catch(e=>toast.error(e.response?.data?.message||'Could not load applications')).finally(()=>setLoading(false));
  useEffect(()=>{load();},[jobId,status]);
  const decide = async (item,next) => { try { await applicationsApi.decide(item._id,{status:next}); toast.success(`Application ${next}`); load(); } catch(e){toast.error(e.response?.data?.message||'Could not update application');} };
  return <PageContainer>
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Hiring inbox</p><h1 className="font-display text-3xl">Job applications</h1><p className="mt-1 text-sm text-muted">Review applications submitted to your jobs.</p></div><div className="flex gap-2"><Select value={jobId} onChange={e=>setJobId(e.target.value)}><option value="">All my jobs</option>{jobs.map(j=><option key={j._id} value={j._id}>{j.title}</option>)}</Select><Select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></Select></div></div>
    {loading?<div className="mt-6 space-y-3"><Skeleton className="h-28"/><Skeleton className="h-28"/></div>:null}
    {!loading&&!items.length?<div className="mt-6"><EmptyState title="No applications found" message="Applications for your job posts will appear here."/></div>:null}
    <div className="mt-6 space-y-3">{items.map(item=><Card key={item._id} className="p-5">
      <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-display text-xl">{item.studentId?.name}</h2><p className="text-sm text-primary">{item.studentId?.email}</p><p className="mt-1 text-xs text-muted">Applied for {item.jobId?.title} · {item.jobId?.company} · {new Date(item.createdAt).toLocaleDateString()}</p></div><span className="h-fit rounded-full bg-sand px-3 py-1 text-xs font-semibold capitalize">{item.status}</span></div>
      {item.note&&<p className="mt-3 text-sm text-muted">Note: {item.note}</p>}
      <div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={()=>applicationsApi.downloadResume(item._id,item.resumeName).catch(e=>toast.error(e.response?.data?.message||'Resume download failed'))}>View resume · {item.resumeName}</Button>
      {item.status==='pending'&&<><Button onClick={()=>decide(item,'approved')}>Approve</Button><Button variant="danger" onClick={()=>decide(item,'rejected')}>Reject</Button></>}</div>
    </Card>)}</div>
  </PageContainer>;
}
