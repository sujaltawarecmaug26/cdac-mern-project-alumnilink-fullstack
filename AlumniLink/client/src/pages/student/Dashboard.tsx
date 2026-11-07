import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useFetch } from '../../hooks/useFetch.js';
import { applicationsApi } from '../../api/applications.js';
import { profileApi } from '../../api/profile.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: profileData } = useFetch(() => profileApi.me(), []);
  const { data: applications } = useFetch(() => applicationsApi.mine(), []);
  const items = applications || [];
  const pending = items.filter(a=>a.status==='pending').length;
  const approved = items.filter(a=>a.status==='approved').length;
  return <PageContainer>
    <p className="text-sm font-semibold uppercase tracking-wide text-primary">Student workspace</p>
    <h1 className="font-display text-3xl">Welcome, {user?.name?.split(' ')[0]}</h1>
    <p className="mt-1 text-muted">Find opportunities shared by verified alumni and keep track of your applications.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      {[['Applications',items.length],['Pending review',pending],['Approved',approved]].map(([label,value])=><Card key={label} className="p-5"><p className="text-sm text-muted">{label}</p><p className="mt-1 font-display text-3xl text-primary">{value}</p></Card>)}
    </div>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <Card className="p-5"><h2 className="font-display text-xl">Your profile</h2><p className="mt-2 text-sm text-muted">{profileData?.profile?.resumeName ? `Resume uploaded: ${profileData.profile.resumeName}` : 'Upload your PDF resume before applying to jobs.'}</p><Link to="/profile" className="mt-4 inline-block"><Button variant="outline">Manage profile</Button></Link></Card>
      <Card className="p-5"><h2 className="font-display text-xl">Explore opportunities</h2><p className="mt-2 text-sm text-muted">Browse jobs posted by verified alumni and apply with your saved resume.</p><Link to="/jobs" className="mt-4 inline-block"><Button>Browse jobs</Button></Link></Card>
    </div>
    <div className="mt-8 flex items-center justify-between"><h2 className="font-display text-2xl">Recent applications</h2><Link to="/applications" className="text-sm text-primary underline">View all</Link></div>
    <div className="mt-3 space-y-2">{items.slice(0,4).map(a=><Card key={a._id} className="flex flex-wrap justify-between gap-2 p-4"><div><p className="font-semibold">{a.jobId?.title}</p><p className="text-sm text-muted">{a.jobId?.company}</p></div><span className="text-sm capitalize text-primary">{a.status}</span></Card>)}</div>
  </PageContainer>;
}
