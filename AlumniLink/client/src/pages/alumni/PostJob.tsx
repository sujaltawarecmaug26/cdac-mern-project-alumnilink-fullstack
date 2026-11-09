import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { jobsApi } from "../../api/jobs.js";
import { profileApi } from "../../api/profile.js";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.tsx";

const blank = {
  company: "",
  title: "",
  description: "",
  location: "",
  experience: "fresher",
  skills: "",
  jobUrl: "",
  deadline: "",
};

export default function PostJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { isVerifiedAlumni } = useAuth();

  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    profileApi
      .me()
      .then((r) =>
        setForm((p) => ({
          ...p,
          company: r.data.profile?.company || "",
        }))
      )
      .catch(() => {});

    if (id) {
      jobsApi
        .get(id)
        .then((r) => {
          const j = r.data.job;

          setForm({
            company: j.company,
            title: j.title,
            description: j.description,
            location: j.location,
            experience: j.experience,
            skills: (j.skills || []).join(", "),
            jobUrl: j.jobUrl || "",
            deadline: j.deadline ? j.deadline.slice(0, 10) : "",
          });
        })
        .catch((e) =>
          toast.error(e.response?.data?.message || "Could not load job")
        )
        .finally(() => setLoading(false));
    }
  }, [id]);

  const set = (key, value) => {
    setForm((p) => ({
      ...p,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.company.trim() ||
      !form.title.trim() ||
      form.description.trim().length < 10 ||
      !form.location.trim()
    ) {
      toast.error(
        "Complete company, title, location and a 10-character description"
      );
      return;
    }

    setBusy(true);

    const body = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      deadline: form.deadline || null,
    };

    try {
      if (id) {
        await jobsApi.update(id, body);
      } else {
        await jobsApi.create(body);
      }

      toast.success(id ? "Job updated" : "Job published");
      navigate("/alumni");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Could not save job");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#9F1239" }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Page Heading */}
      <Typography
        variant="overline"
        sx={{
          color: "#9F1239",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Alumni opportunities
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#6B0F2A",
          fontFamily: "Playfair Display, serif",
        }}
      >
        {id ? "Edit job" : "Post a job"}
      </Typography>

      {/* Verification Message */}
      {!isVerifiedAlumni && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          Your account is awaiting admin verification. You can post jobs after
          approval.
        </Alert>
      )}

      {/* Job Form */}
      <Card
        sx={{
          mt: 3,
          border: "1px solid #F1E3D3",
          borderRadius: 3,
          boxShadow: 1,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Company, Title, Location and Experience */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Job title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Location"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  required
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Experience</InputLabel>

                  <Select
                    value={form.experience}
                    label="Experience"
                    onChange={(e) => set("experience", e.target.value)}
                  >
                    <MenuItem value="fresher">0-1 year</MenuItem>
                    <MenuItem value="junior">1-3 years</MenuItem>
                    <MenuItem value="mid">3+ years</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Job Description */}
            <TextField
              label="Job description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              multiline
              rows={6}
              fullWidth
            />

            {/* Skills */}
            <TextField
              label="Required skills (comma separated)"
              value={form.skills}
              onChange={(e) => set("skills", e.target.value)}
              placeholder="Java, React, SQL"
              fullWidth
            />

            {/* Job URL and Deadline */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="External job URL (optional)"
                  value={form.jobUrl}
                  onChange={(e) => set("jobUrl", e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Application deadline (optional)"
                  type="date"
                  value={form.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={busy || !isVerifiedAlumni}
              sx={{
                py: 1.2,
                backgroundColor: "#9F1239",
                "&:hover": {
                  backgroundColor: "#6B0F2A",
                },
              }}
            >
              {busy
                ? "Saving..."
                : id
                ? "Save changes"
                : "Publish job"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}