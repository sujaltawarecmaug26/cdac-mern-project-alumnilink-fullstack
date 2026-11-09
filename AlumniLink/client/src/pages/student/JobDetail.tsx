
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { jobsApi } from "../../api/jobs.js";
import { applicationsApi } from "../../api/applications.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.tsx";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const load = () =>
    jobsApi
      .get(id)
      .then((r) => setData(r.data))
      .catch((e) =>
        toast.error(e.response?.data?.message || "Job not found")
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await jobsApi.apply(id, { note });

      toast.success("Application submitted");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not apply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewContact = async () => {
    try {
      setContactLoading(true);

      const r = await applicationsApi.contact(application._id);
      setContact(r.data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Contact unavailable");
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#9F1239" }} />
        </Box>
      </Container>
    );
  }

  if (!data?.job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Job not found.
        </Alert>

        <Button
          component={Link}
          to="/jobs"
          sx={{ color: "#9F1239", textTransform: "none" }}
        >
          Back to jobs
        </Button>
      </Container>
    );
  }

  const { job, alumniProfile, application } = data;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Job Details */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #F1E3D3",
            boxShadow: "0 3px 12px rgba(43, 27, 23, 0.05)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              sx={{ color: "#9F1239", fontWeight: 600 }}
            >
              {job.company}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontFamily: "Playfair Display, serif",
                fontWeight: 700,
                color: "#2B1B17",
              }}
            >
              {job.title}
            </Typography>

            <Typography sx={{ mt: 2, color: "#8B7766", fontSize: 14 }}>
              {job.location} · {job.experience} · Posted by{" "}
              {job.alumniId?.name || "Verified alumnus"}
            </Typography>

            <Divider sx={{ my: 3, borderColor: "#F1E3D3" }} />

            {/* Description */}
            <Typography variant="h6" sx={{fontWeight :700}}>
              About this role
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#8B7766",
                fontSize: 14,
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
              }}
            >
              {job.description}
            </Typography>

            {/* Skills */}
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 700 }}>
              Skills required
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1.5, flexWrap: "wrap" }}
            >
              {(job.skills || []).map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: "#F1E3D3",
                    color: "#2B1B17",
                  }}
                />
              ))}
            </Stack>

            {/* Company Job URL */}
            {job.jobUrl && (
              <Box sx={{ mt: 3 }}>
                <Button
                  component="a"
                  href={job.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#9F1239",
                    textTransform: "none",
                    p: 0,
                  }}
                >
                  Company job listing
                </Button>
              </Box>
            )}

            {/* Alumni Information */}
            <Box
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 2,
                backgroundColor: "#F1E3D3",
              }}
            >
              <Typography sx={{ fontWeight: 700, color: "#2B1B17" }}>
                {job.alumniId?.name || "Verified alumnus"}
              </Typography>

              <Typography sx={{ mt: 0.5, fontSize: 14, color: "#8B7766" }}>
                {alumniProfile?.designation} ·{" "}
                {alumniProfile?.company || job.company}
              </Typography>

              <Chip
                label="Verified alumnus"
                size="small"
                color="success"
                sx={{ mt: 1.5 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Application Section */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #F1E3D3",
            boxShadow: "0 3px 12px rgba(43, 27, 23, 0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 700,
                color: "#2B1B17",
              }}
            >
              Apply for this job
            </Typography>

            {user?.role !== "student" ? (
              <Typography sx={{ mt: 2, color: "#8B7766", fontSize: 14 }}>
                Only students can apply.
              </Typography>
            ) : application ? (
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: "#F1E3D3",
                }}
              >
                <Typography sx={{fontWeight:700}}>
                  You have already applied
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#8B7766",
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                >
                  Status: {application.status}
                </Typography>

                <Button
                  component={Link}
                  to="/applications"
                  sx={{
                    mt: 1.5,
                    color: "#9F1239",
                    textTransform: "none",
                    px: 0,
                  }}
                >
                  View my applications
                </Button>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleApply} sx={{ mt: 3 }}>
                <Typography sx={{ mb: 2, color: "#8B7766", fontSize: 14 }}>
                  Your saved PDF resume will be attached automatically. Make
                  sure it is uploaded in your profile.
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Note to alumnus (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={submitting || job.status !== "open"}
                  sx={{
                    mt: 2,
                    py: 1.2,
                    backgroundColor: "#9F1239",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "#6B0F2A",
                    },
                  }}
                >
                  {submitting ? "Submitting..." : "Submit application"}
                </Button>

                <Button
                  component={Link}
                  to="/profile"
                  sx={{
                    mt: 1,
                    color: "#9F1239",
                    textTransform: "none",
                    fontSize: 12,
                  }}
                >
                  Manage my profile and resume
                </Button>
              </Box>
            )}

            {/* Approved Application: Alumni Contact */}
            {application?.status === "approved" && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleViewContact}
                  disabled={contactLoading}
                  sx={{
                    borderColor: "#9F1239",
                    color: "#9F1239",
                    textTransform: "none",
                  }}
                >
                  {contactLoading ? "Loading contact..." : "View alumni contact"}
                </Button>
              </Box>
            )}

            {/* Alumni Contact Details */}
            {contact && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>{contact.name}</Typography>

                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {contact.email || "Email not provided"}
                </Typography>

                <Typography variant="body2">
                  {contact.phone || "Phone not provided"}
                </Typography>

                {contact.linkedin && (
                  <Button
                    component="a"
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      mt: 1,
                      p: 0,
                      color: "#9F1239",
                      textTransform: "none",
                    }}
                  >
                    LinkedIn
                  </Button>
                )}
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
