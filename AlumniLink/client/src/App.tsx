import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.tsx';
import { RoleRoute } from './components/layout/RoleRoute.tsx';
import { ROLES } from './utils/constants.js';

import Landing from './pages/public/Landing.tsx';
import Login from './pages/public/Login.tsx';
import Register from './pages/public/Register.tsx';
import ForgotPassword from './pages/public/ForgotPassword.tsx';
import ResetPassword from './pages/public/ResetPassword.tsx';
import NotFound from './pages/public/NotFound.tsx';
import StudentDashboard from './pages/student/Dashboard.tsx';
import StudentProfile from './pages/student/Profile.tsx';
import JobBoard from './pages/student/JobBoard.tsx';
import JobDetail from './pages/student/JobDetail.tsx';
import MyApplications from './pages/student/MyApplications.tsx';
import AlumniDashboard from './pages/alumni/Dashboard.tsx';
import AlumniProfile from './pages/alumni/Profile.tsx';
import PostJob from './pages/alumni/PostJob.tsx';
import AlumniInbox from './pages/alumni/ApplicationsInbox.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';

const Guard = ({ roles, children }) => (
  <ProtectedRoute><RoleRoute roles={roles}>{children}</RoleRoute></ProtectedRoute>
);

export default function App() {
  return <>
    <Navbar />
    <main className="min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/jobs" element={<Guard roles={[ROLES.STUDENT, ROLES.ALUMNUS, ROLES.ADMIN]}><JobBoard /></Guard>} />
        <Route path="/jobs/:id" element={<Guard roles={[ROLES.STUDENT, ROLES.ALUMNUS, ROLES.ADMIN]}><JobDetail /></Guard>} />
        <Route path="/dashboard" element={<Guard roles={[ROLES.STUDENT]}><StudentDashboard /></Guard>} />
        <Route path="/profile" element={<Guard roles={[ROLES.STUDENT]}><StudentProfile /></Guard>} />
        <Route path="/applications" element={<Guard roles={[ROLES.STUDENT]}><MyApplications /></Guard>} />
        <Route path="/alumni" element={<Guard roles={[ROLES.ALUMNUS]}><AlumniDashboard /></Guard>} />
        <Route path="/alumni/profile" element={<Guard roles={[ROLES.ALUMNUS]}><AlumniProfile /></Guard>} />
        <Route path="/alumni/jobs/new" element={<Guard roles={[ROLES.ALUMNUS]}><PostJob /></Guard>} />
        <Route path="/alumni/jobs/:id/edit" element={<Guard roles={[ROLES.ALUMNUS]}><PostJob /></Guard>} />
        <Route path="/alumni/jobs" element={<Guard roles={[ROLES.ALUMNUS]}><AlumniDashboard /></Guard>} />
        <Route path="/alumni/applications" element={<Guard roles={[ROLES.ALUMNUS]}><AlumniInbox /></Guard>} />
        <Route path="/admin" element={<Guard roles={[ROLES.ADMIN]}><AdminDashboard /></Guard>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>;
}
