
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

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
      toast.error(
        e.response?.data?.message || "Could not load admin data"
      );
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
        reason:
          action === "reject"
            ? "Unable to verify alumni details"
            : "",
      });

      toast.success(`Alumni ${action}d`);
      load();
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Verification failed"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const StatCard = ({ title, value }) => (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #F1E3D3",
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
        height: "100%",
      }}
    >
      <CardContent>
        <Typography color="#8B7766" variant="body2" gutterBottom>
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{ color: "#9F1239", fontWeight: 700 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{ color: "#9F1239", letterSpacing: 1.5,fontWeight:700 }}
        >
          Administration
        </Typography>

        <Typography
          variant="h4"
          sx={{ color: "#2B1B17", mb: 1,fontWeight:700 }}
        >
          Admin Dashboard
        </Typography>

        <Typography color="#8B7766">
          Verify alumni accounts and review registered users.
        </Typography>
      </Box>

      {/* Dashboard Statistics */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
          mb: 5,
        }}
      >
        <StatCard
          title="Registered users shown"
          value={users.length}
        />

        <StatCard
          title="Alumni in this view"
          value={alumni.length}
        />

        <StatCard
          title="Pending verification"
          value={
            alumni.filter(
              (a) => a.verifyStatus === "pending"
            ).length
          }
        />
      </Box>

      {/* Alumni Verification Heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#2B1B17", fontWeight: 700 }}
        >
          Alumni Verification
        </Typography>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={tab}
            onChange={(e) => setTab(e.target.value)}
            sx={{
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="all">All Alumni</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress sx={{ color: "#9F1239" }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && alumni.length === 0 && (
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            backgroundColor: "#FFF8F1",
            color: "#8B7766",
          }}
        >
          No alumni accounts in this category.
        </Alert>
      )}

      {/* Alumni List */}
      {!loading && (
        <Stack spacing={2}>
          {alumni.map((a) => (
            <Card
              key={a.id}
              elevation={0}
              sx={{
                border: "1px solid #F1E3D3",
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
    
                      sx={{ color: "#2B1B17",fontWeight:700 }}
                    >
                      {a.name}
                    </Typography>

                    <Typography variant="body2" color="#8B7766">
                      {a.email} · {a.batch}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: "#2B1B17" }}
                    >
                      {a.profile?.designation} at{" "}
                      {a.profile?.company}
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={`Status: ${a.verifyStatus}`}
                        color={getStatusColor(a.verifyStatus)}
                        variant="outlined"
                      />
                    </Box>

                    {a.profile?.proofNote && (
                      <Typography
                        variant="caption"
                        color="#8B7766"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Proof: {a.profile.proofNote}
                      </Typography>
                    )}
                  </Box>

                  {a.verifyStatus === "pending" && (
                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      <Button
                        variant="contained"
                        onClick={() => verify(a.id, "approve")}
                        sx={{
                          backgroundColor: "#9F1239",
                          "&:hover": {
                            backgroundColor: "#6B0F2A",
                          },
                        }}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => verify(a.id, "reject")}
                      >
                        Reject
                      </Button>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Recent Users */}
      <Typography
        variant="h5"
        sx={{ color: "#2B1B17", mt: 6, mb: 2 ,fontWeight:700}}
      >
        Recent Users
      </Typography>

      <TableContainer
        component={Card}
        elevation={0}
        sx={{
          border: "1px solid #F1E3D3",
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#FFF8F1" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id || u._id} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>

                <TableCell>
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {u.role}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={u.verifyStatus || "N/A"}
                    color={getStatusColor(u.verifyStatus)}
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}

            {!users.length && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
