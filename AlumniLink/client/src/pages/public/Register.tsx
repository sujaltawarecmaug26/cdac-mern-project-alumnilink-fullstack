import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../context/ToastContext.tsx';
import { BATCHES, ROLES } from '../../utils/constants.js';

export default function Register() {
  const [params] = useSearchParams();
  const initialRole = params.get('role') === 'alumnus' ? ROLES.ALUMNUS : ROLES.STUDENT;
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    name: '',
    email: '',
    batch: BATCHES[0],
    password: '',
    linkedin: '',
    company: '',
    designation: '',
    proofNote: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Enter your full name';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 8) e.password = 'Min 8 characters with a letter and number';
    if (!form.agree) e.agree = 'Please accept to continue';
    if (role === ROLES.ALUMNUS) {
      if (!form.company) e.company = 'Company is required';
      if (!form.designation) e.designation = 'Designation is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        batch: form.batch,
        linkedin: form.linkedin,
        company: form.company,
        designation: form.designation,
        proofNote: form.proofNote,
      });
      toast.success('Account created');
      navigate(user.role === 'alumnus' ? '/alumni' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const title = useMemo(
    () => (role === ROLES.STUDENT ? 'Create student account' : 'Create alumni account'),
    [role],
  );

  return (
    <PageContainer className="max-w-3xl">
      <h1 className="font-display text-3xl text-cocoa">Join AlumniLink</h1>
      <p className="mt-1 text-muted">Choose how you want to participate</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          {
            id: ROLES.STUDENT,
            title: 'I am a student',
            text: 'Browse jobs shared by verified alumni.',
            mark: 'S',
          },
          {
            id: ROLES.ALUMNUS,
            title: 'I am an alumnus',
            text: 'Share job opportunities with students.',
            mark: 'A',
          },
        ].map((opt) => {
          const active = role === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRole(opt.id)}
              className={`rounded-card border-2 p-4 text-left transition ${
                active
                  ? 'border-primary bg-rose-50'
                  : 'border-sand bg-white hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    active ? 'bg-primary text-white' : 'bg-sand text-cocoa'
                  }`}
                >
                  {opt.mark}
                </span>
                <div>
                  <p className="font-semibold">{opt.title}</p>
                  <p className="text-sm text-muted">{opt.text}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Card className="mt-6 p-5">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Aarav Sharma"
            error={errors.name}
          />
          <Input
            label="Email address"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="aarav@example.com"
            error={errors.email}
          />
          <Select label="Batch" value={form.batch} onChange={(e) => set('batch', e.target.value)}>
            {BATCHES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            error={errors.password}
          />
          <Input
            className="sm:col-span-2"
            label="LinkedIn (optional)"
            value={form.linkedin}
            onChange={(e) => set('linkedin', e.target.value)}
            placeholder="linkedin.com/in/..."
          />
          {role === ROLES.ALUMNUS ? (
            <>
              <Input
                label="Company"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                error={errors.company}
              />
              <Input
                label="Designation"
                value={form.designation}
                onChange={(e) => set('designation', e.target.value)}
                error={errors.designation}
              />
              <Input
                className="sm:col-span-2"
                label="Proof note"
                value={form.proofNote}
                onChange={(e) => set('proofNote', e.target.value)}
                placeholder="LinkedIn or work mail proof"
              />
            </>
          ) : null}
          <label className="sm:col-span-2 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1 accent-primary"
              checked={form.agree}
              onChange={(e) => set('agree', e.target.checked)}
            />
            <span>
              I agree to share my profile with verified alumni.
              {errors.agree ? <span className="block text-danger">{errors.agree}</span> : null}
            </span>
          </label>
          <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" disabled={submitting}>
              {title}
            </Button>
            <p className="text-xs text-muted">
              Alumni accounts are verified by the admin within 24 hours.
            </p>
          </div>
        </form>
      </Card>
      <p className="mt-4 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-primary underline">
          Login
        </Link>
      </p>
    </PageContainer>
  );
}
