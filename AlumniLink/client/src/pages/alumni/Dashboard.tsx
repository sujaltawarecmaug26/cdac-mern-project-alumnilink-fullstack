import { Link } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { jobsApi } from "../../api/jobs.js";
import { useFetch } from "../../hooks/useFetch.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function AlumniDashboard() {
  const { user, isPendingAlumni } = useAuth();

  const {
    data: jobs,
    loading,
    error,
    reload,
  } = useFetch(() => jobsApi.mine(), []);

  const items = jobs || [];

  const open = items.filter((j) => j.status === "open").length;

  const totalApplications = items.reduce(
    (sum, j) => sum + (j.applicationCount || 0),
    0
  );

  const stats = [
    { label: "Jobs posted", value: items.length },
    { label: "Open jobs", value: open },
    { label: "Applications received", value: totalApplications },
  ];

  const handleCloseJob = async (id: string) => {
    try {
      await jobsApi.close(id);
      reload();
    } catch (e: any) {
      alert(e.response?.data?.message || "Could not close job");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Page Heading */}
      <Typography
        variant="overline"
        sx={{
          color: "#9F1239",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Alumni workspace
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#6B0F2A",
          fontFamily: "Playfair Display, serif",
        }}
      >
        Welcome, {user?.name?.split(" ")[0]}
      </Typography>

      <Typography sx={{ color: "#8B7766", mt: 1 }}>
        Share relevant opportunities and review applications from students.
      </Typography>

      {/* Pending Verification Message */}
      {isPendingAlumni && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Your account is pending admin verification. You can complete your
          profile, but job posting is disabled until verification.
        </Alert>
      )}

      {/* Dashboard Statistics */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Card
              sx={{
                border: "1px solid #F1E3D3",
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: "#8B7766" }}>
                  {stat.label}
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    mt: 1,
                    color: "#9F1239",
                    fontWeight: 700,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ mt: 3, gap: 1, flexWrap: "wrap" }}
      >
        <Button
          component={Link}
          to="/alumni/jobs/new"
          variant="contained"
          disabled={isPendingAlumni}
          sx={{
            backgroundColor: "#9F1239",
            "&:hover": { backgroundColor: "#6B0F2A" },
          }}
        >
          Post a job
        </Button>

        <Button
          component={Link}
          to="/alumni/applications"
          variant="outlined"
          sx={{ color: "#9F1239", borderColor: "#9F1239" }}
        >
          View applications
        </Button>

        <Button
          component={Link}
          to="/alumni/profile"
          variant="outlined"
          sx={{ color: "#9F1239", borderColor: "#9F1239" }}
        >
          Edit profile
        </Button>
      </Stack>

      {/* Job Posts Heading */}
      <Box
        sx={{
          mt: 5,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#6B0F2A",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Your job posts
        </Typography>

        <Button
          variant="outlined"
          onClick={reload}
          sx={{ color: "#9F1239", borderColor: "#9F1239" }}
        >
          Refresh
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#9F1239" }} />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !items.length && (
        <Card sx={{ border: "1px solid #F1E3D3", borderRadius: 3, mt: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: "#6B0F2A" }}>
              No jobs posted yet
            </Typography>

            <Typography variant="body2" sx={{ color: "#8B7766", mt: 1 }}>
              Create your first job post to connect with students.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Job List */}
      <Stack spacing={2} sx={{ mt: 2 }}>
        {items.map((job) => (
          <Card
            key={job._id}
            sx={{
              border: "1px solid #F1E3D3",
              borderRadius: 3,
              boxShadow: 1,
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2B1B17" }}
                  >
                    {job.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#8B7766", mt: 0.5 }}>
                    {job.company} · {job.location} · {job.applicationCount}{" "}
                    applications
                  </Typography>

                  <Chip
                    label={job.status}
                    size="small"
                    sx={{
                      mt: 1.5,
                      textTransform: "capitalize",
                      backgroundColor:
                        job.status === "open" ? "#F0FDF4" : "#F1E3D3",
                      color:
                        job.status === "open" ? "#15803D" : "#8B7766",
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  {job.status === "open" && (
                    <>
                      <Button
                        component={Link}
                        to={`/alumni/jobs/${job._id}/edit`}
                        variant="outlined"
                        sx={{ color: "#9F1239", borderColor: "#9F1239" }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCloseJob(job._id)}
                      >
                        Close job
                      </Button>
                    </>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}