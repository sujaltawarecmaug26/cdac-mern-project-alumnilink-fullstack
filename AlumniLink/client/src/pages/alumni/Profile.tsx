import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useToast } from "../../context/ToastContext.tsx";
import { profileApi } from "../../api/profile.js";

export default function AlumniProfile() {
  const toast = useToast();

  const [form, setForm] = useState({
    company: "",
    designation: "",
    workEmail: "",
    contactPhone: "",
    linkedin: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileApi
      .me()
      .then((res) => {
        const p = res.data.profile || {};

        setForm({
          company: p.company || "",
          designation: p.designation || "",
          workEmail: p.workEmail || "",
          contactPhone: p.contactPhone || "",
          linkedin: p.linkedin || "",
          bio: p.bio || "",
        });
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Could not load profile"
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await profileApi.updateAlumni(form);

      toast.success("Profile saved");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#6B0F2A",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Alumni profile
        </Typography>

        <Typography variant="body2" sx={{ color: "#8B7766", mt: 1 }}>
          Keep your professional information updated.
        </Typography>

        <Card
          sx={{
            mt: 3,
            border: "1px solid #F1E3D3",
            borderRadius: 3,
            boxShadow: 1,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                <CircularProgress sx={{ color: "#9F1239" }} />
              </Box>
            ) : (
              <Stack spacing={3}>
                <TextField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Work email (private)"
                  name="workEmail"
                  value={form.workEmail}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Contact phone (shared only after application approval)"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="LinkedIn"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                  helperText={`${form.bio.length}/500 characters`}
                  fullWidth
                />

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    py: 1.2,
                    backgroundColor: "#9F1239",
                    "&:hover": {
                      backgroundColor: "#6B0F2A",
                    },
                  }}
                >
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}