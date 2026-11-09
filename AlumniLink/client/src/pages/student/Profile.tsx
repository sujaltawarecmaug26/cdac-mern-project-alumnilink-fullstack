
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useToast } from "../../context/ToastContext.tsx";
import { profileApi } from "../../api/profile.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function StudentProfile() {
  const toast = useToast();
  const { refreshMe } = useAuth();

  const [form, setForm] = useState({
    headline: "",
    bio: "",
    skills: [],
    github: "",
    linkedin: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileApi.me().then((res) => {
      const p = res.data.profile || {};

      setForm({
        headline: p.headline || "",
        bio: p.bio || "",
        skills: p.skills || [],
        github: p.github || "",
        linkedin: p.linkedin || "",
      });

      setResumeName(p.resumeName || "");
    });
  }, []);

  const handleAddSkill = () => {
    const s = skillInput.trim().toLowerCase();

    if (!s) return;

    setForm({
      ...form,
      skills: [...new Set([...form.skills, s])],
    });

    setSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setForm({
      ...form,
      skills: form.skills.filter((s) => s !== skill),
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF resumes are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Resume must be 2 MB or smaller");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      await profileApi.uploadResume(file);

      setResumeName(file.name);
      toast.success("Resume uploaded");
      refreshMe();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      await profileApi.updateStudent(form);

      toast.success("Profile saved");
      refreshMe();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Heading */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 700,
            color: "#2B1B17",
          }}
        >
          Student profile
        </Typography>

        <Typography sx={{ mt: 1, color: "#8B7766" }}>
          Keep your details and current PDF resume up to date.
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #F1E3D3",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 3px 12px rgba(43, 27, 23, 0.05)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={3}>
            {/* Headline */}
            <TextField
              fullWidth
              label="Headline"
              value={form.headline}
              onChange={(e) =>
                setForm({ ...form, headline: e.target.value })
              }
            />

            {/* Bio */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Bio"
              value={form.bio}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
              helperText={`${form.bio.length}/500 characters`}
            />

            {/* Skills */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1.5,
                  color: "#8B7766",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Skills
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap" }}
              >
                {form.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{
                      borderColor: "#9F1239",
                      color: "#9F1239",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />

                <Button
                  variant="outlined"
                  onClick={handleAddSkill}
                  sx={{
                    borderColor: "#9F1239",
                    color: "#9F1239",
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>

            {/* Social Links */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="GitHub"
                  value={form.github}
                  onChange={(e) =>
                    setForm({ ...form, github: e.target.value })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                />
              </Grid>
            </Grid>

            {/* Resume Upload */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "#8B7766" }}
              >
                Current Resume
              </Typography>

              <Alert severity={resumeName ? "success" : "info"} sx={{ mb: 2 }}>
                {resumeName || "No resume uploaded yet"}
              </Alert>

              <Button
                variant="outlined"
                component="label"
                disabled={uploading}
                sx={{
                  borderColor: "#9F1239",
                  color: "#9F1239",
                  textTransform: "none",
                }}
              >
                {uploading ? "Uploading..." : "Upload PDF Resume"}

                <input
                  hidden
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                />
              </Button>

              <Typography
                variant="caption"
                sx={{ display: "block", mt: 1, color: "#8B7766" }}
              >
                Only PDF files up to 2 MB are allowed.
              </Typography>
            </Box>

            {/* Save Profile */}
            <Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSaveProfile}
                disabled={saving}
                sx={{
                  py: 1.3,
                  backgroundColor: "#9F1239",
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#6B0F2A",
                  },
                }}
              >
                {saving ? "Saving..." : "Save profile"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
