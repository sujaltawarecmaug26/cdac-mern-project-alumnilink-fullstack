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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { applicationsApi } from "../../api/applications.js";
import { useToast } from "../../context/ToastContext.tsx";

export default function AlumniInbox() {
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  const load = () => {
    applicationsApi
      .inbox({
        jobId: jobId || undefined,
        status: status || undefined,
      })
      .then((r) => {
        setItems(r.data || []);
        setJobs(r.meta?.jobs || []);
      })
      .catch((e) =>
        toast.error(
          e.response?.data?.message || "Could not load applications"
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [jobId, status]);

  const decide = async (item, next) => {
    try {
      await applicationsApi.decide(item._id, { status: next });
      toast.success(`Application ${next}`);
      load();
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Could not update application"
      );
    }
  };

  const downloadResume = (item) => {
    applicationsApi
      .downloadResume(item._id, item.resumeName)
      .catch((e) =>
        toast.error(
          e.response?.data?.message || "Resume download failed"
        )
      );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Page Heading */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "flex-end" },
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "#9F1239",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Hiring inbox
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#6B0F2A",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Job applications
          </Typography>

          <Typography variant="body2" sx={{ color: "#8B7766", mt: 1 }}>
            Review applications submitted to your jobs.
          </Typography>
        </Box>

        {/* Filters */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Job</InputLabel>
              <Select
                value={jobId}
                label="Job"
                onChange={(e) => setJobId(e.target.value)}
              >
                <MenuItem value="">All my jobs</MenuItem>

                {jobs.map((job) => (
                  <MenuItem key={job._id} value={job._id}>
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Stack>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress sx={{ color: "#9F1239" }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && !items.length && (
        <Card
          sx={{
            mt: 4,
            border: "1px solid #F1E3D3",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" sx={{ color: "#6B0F2A" }}>
              No applications found
            </Typography>

            <Typography variant="body2" sx={{ color: "#8B7766", mt: 1 }}>
              Applications for your job posts will appear here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Application List */}
      <Stack spacing={2} sx={{ mt: 3 }}>
        {!loading &&
          items.map((item) => (
            <Card
              key={item._id}
              sx={{
                border: "1px solid #F1E3D3",
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Student Details */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#2B1B17",
                        fontWeight: 600,
                        fontFamily: "Playfair Display, serif",
                      }}
                    >
                      {item.studentId?.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#9F1239" }}
                    >
                      {item.studentId?.email}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ color: "#8B7766", display: "block", mt: 1 }}
                    >
                      Applied for {item.jobId?.title} · {item.jobId?.company} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      backgroundColor: "#F1E3D3",
                      color: "#6B0F2A",
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                {/* Application Note */}
                {item.note && (
                  <Typography
                    variant="body2"
                    sx={{ color: "#8B7766", mt: 2 }}
                  >
                    Note: {item.note}
                  </Typography>
                )}

                {/* Actions */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 3, gap: 1, flexWrap: "wrap" }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => downloadResume(item)}
                    sx={{
                      color: "#9F1239",
                      borderColor: "#9F1239",
                      textTransform: "none",
                    }}
                  >
                    View resume · {item.resumeName}
                  </Button>

                  {item.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => decide(item, "approved")}
                        sx={{
                          backgroundColor: "#15803D",
                          "&:hover": { backgroundColor: "#166534" },
                        }}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => decide(item, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
      </Stack>
    </Container>
  );
}