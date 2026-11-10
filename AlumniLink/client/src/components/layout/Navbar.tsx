import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button as MuiButton, Chip } from '@mui/material';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLES } from '../../utils/constants.js';

const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`;

export function Navbar() {
  const { user, logout, isPendingAlumni } = useAuth();
  const navigate = useNavigate();
  let links = [{ to: '/', label: 'Home', end: true }, { to: '/login', label: 'Login' }];
  if (user?.role === ROLES.STUDENT) links = [
    { to: '/dashboard', label: 'Dashboard' }, { to: '/jobs', label: 'Find jobs' },
    { to: '/applications', label: 'My applications' }, { to: '/profile', label: 'Profile' },
  ];
  if (user?.role === ROLES.ALUMNUS) links = [
    { to: '/alumni', label: 'Dashboard' }, { to: '/alumni/jobs/new', label: 'Post a job' },
    { to: '/alumni/applications', label: 'Applications' }, { to: '/alumni/profile', label: 'Profile' },
  ];
  if (user?.role === ROLES.ADMIN) links = [{ to: '/admin', label: 'Admin dashboard' }];
  const home = user?.role === ROLES.ADMIN ? '/admin' : user?.role === ROLES.ALUMNUS ? '/alumni' : user ? '/dashboard' : '/';

  return <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #F1E3D3', bgcolor: 'rgba(255,255,255,.96)' }}>
    {isPendingAlumni && <Box sx={{ bgcolor: '#FFF7E6', color: '#8A4B08', textAlign: 'center', py: 1, px: 2, fontSize: 12 }}>Your alumni account is awaiting admin verification. You can update your profile, but cannot post jobs yet.</Box>}
    <Toolbar sx={{ maxWidth: 1152, width: '100%', mx: 'auto', minHeight: '68px !important', gap: 2, flexWrap: 'wrap' }}>
      <Box component={Link} to={home} sx={{ display: 'flex', alignItems: 'center', gap: 1.2, textDecoration: 'none', mr: 'auto' }}>
        <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700 }}>A</Box>
        <Typography sx={{ color: 'primary.main', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 22 }}>AlumniLink</Typography>
      </Box>
      <Box component="nav" sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
        {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>{link.label}</NavLink>)}
        {user && <><Chip size="small" label={user.name} sx={{ bgcolor: '#FFF8F1', color: '#6B0F2A' }}/><MuiButton size="small" variant="outlined" onClick={() => { logout(); navigate('/'); }}>Logout</MuiButton></>}
      </Box>
    </Toolbar>
  </AppBar>;
}
