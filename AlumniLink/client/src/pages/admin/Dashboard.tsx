import { useEffect, useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Select } from "../../components/ui/Select.tsx";
import { adminApi } from "../../api/admin.js";
import { useToast } from "../../context/ToastContext.tsx";

export default function AdminDashboard() {
  const toast = useToast();
  const [alumni, setAlumni] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const [a, u] = await Promise.all([
        adminApi.listAlumni({ status: tab, limit: 50 }),
        adminApi.listUsers({ limit: 50 }),
      ]);
      setAlumni(a.data || []);
      setUsers(u.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not load admin data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [tab]);
  const verify = async (id, action) => {
    try {
      await adminApi.verifyAlumni(id, {
        action,
        reason: action === "reject" ? "Unable to verify alumni details" : "",
      });
      toast.success(`Alumni ${action}d`);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Verification failed");
    }
  };
  return (
    <PageContainer>
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        Administration
      </p>
      <h1 className="font-display text-3xl">Admin dashboard</h1>
      <p className="mt-1 text-muted">
        Verify alumni accounts and review registered users.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted">Registered users shown</p>
          <p className="font-display text-3xl text-primary">{users.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Alumni in this view</p>
          <p className="font-display text-3xl text-primary">{alumni.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted">Pending verification</p>
          <p className="font-display text-3xl text-primary">
            {alumni.filter((a) => a.verifyStatus === "pending").length}
          </p>
        </Card>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Alumni verification</h2>
        <Select value={tab} onChange={(e) => setTab(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All alumni</option>
        </Select>
      </div>
      {loading ? <p className="mt-4 text-sm text-muted">Loading...</p> : null}
      {!loading && !alumni.length ? (
        <p className="mt-4 rounded-xl bg-sand/50 p-5 text-sm text-muted">
          No alumni accounts in this category.
        </p>
      ) : null}
      <div className="mt-4 space-y-3">
        {alumni.map((a) => (
          <Card
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 p-5"
          >
            <div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-muted">
                {a.email} · {a.batch}
              </p>
              <p className="mt-1 text-sm">
                {a.profile?.designation} at {a.profile?.company}
              </p>
              <p className="mt-1 text-xs capitalize text-primary">
                Status: {a.verifyStatus}
              </p>
              {a.profile?.proofNote && (
                <p className="mt-1 text-xs text-muted">
                  Proof: {a.profile.proofNote}
                </p>
              )}
            </div>
            {a.verifyStatus === "pending" && (
              <div className="flex gap-2">
                <Button onClick={() => verify(a.id, "approve")}>Approve</Button>
                <Button variant="danger" onClick={() => verify(a.id, "reject")}>
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Recent users</h2>
      <div className="mt-3 overflow-x-auto rounded-card border border-sand bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand/50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id || u._id} className="border-t border-sand/70">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3 capitalize">{u.verifyStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
