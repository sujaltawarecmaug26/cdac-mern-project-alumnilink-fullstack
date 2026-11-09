
import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.tsx";
import { BATCHES, ROLES } from "../../utils/constants.js";

type RegisterForm = {
  name: string;
  email: string;
  batch: string;
  password: string;
  linkedin: string;
  company: string;
  designation: string;
  proofNote: string;
  agree: boolean;
};

type RegisterErrors = Partial<
  Record<"name" | "email" | "password" | "agree" | "company" | "designation", string>
>;

export default function Register() {
  const [params] = useSearchParams();

  const initialRole =
    params.get("role") === "alumnus"
      ? ROLES.ALUMNUS
      : ROLES.STUDENT;

  const [role, setRole] = useState(initialRole);

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    batch: BATCHES[0],
    password: "",
    linkedin: "",
    company: "",
    designation: "",
    proofNote: "",
    agree: false,
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = <K extends keyof RegisterForm,>(key: K, value: RegisterForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    const e: RegisterErrors = {};

    if (form.name.trim().length < 2) {
      e.name = "Enter your full name";
    }

    if (!form.email.includes("@")) {
      e.email = "Enter a valid email";
    }

    if (form.password.length < 8) {
      e.password = "Min 8 characters with a letter and number";
    }

    if (!form.agree) {
      e.agree = "Please accept to continue";
    }

    if (role === ROLES.ALUMNUS) {
      if (!form.company.trim()) {
        e.company = "Company is required";
      }

      if (!form.designation.trim()) {
        e.designation = "Designation is required";
      }
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
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

      toast.success("Account created");

      navigate(user.role === "alumnus" ? "/alumni" : "/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const title = useMemo(
    () =>
      role === ROLES.STUDENT
        ? "Create student account"
        : "Create alumni account",
    [role]
  );

  const roleOptions = [
    {
      id: ROLES.STUDENT,
      title: "I am a student",
      text: "Browse jobs shared by verified alumni.",
      mark: "S",
    },
    {
      id: ROLES.ALUMNUS,
      title: "I am an alumnus",
      text: "Share job opportunities with students.",
      mark: "A",
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Page Heading */}
      <Typography
        variant="h4"
        sx={{ color: "#2B1B17", fontWeight: 700 }}
      >
        Join AlumniLink
      </Typography>

      <Typography sx={{ color: "#8B7766", mt: 1 }}>
        Choose how you want to participate
      </Typography>

      {/* Role Selection */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {roleOptions.map((opt) => {
          const active = role === opt.id;

          return (
            <Grid size={{ xs: 12, sm: 6 }} key={opt.id}>
              <Paper
                component="button"
                type="button"
                elevation={0}
                onClick={() => setRole(opt.id)}
                sx={{
                  width: "100%",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  textAlign: "left",
                  gap: 2,
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: active ? "#9F1239" : "#F1E3D3",
                  borderRadius: 3,
                  backgroundColor: active ? "#FFF1F4" : "#FFFFFF",
                  "&:hover": {
                    borderColor: "#9F1239",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    backgroundColor: active ? "#9F1239" : "#F1E3D3",
                    color: active ? "#FFFFFF" : "#2B1B17",
                  }}
                >
                  {opt.mark}
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 700 }} color="#2B1B17">
                    {opt.title}
                  </Typography>

                  <Typography variant="body2" color="#8B7766">
                    {opt.text}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Registration Form */}
      <Card
        elevation={0}
        sx={{
          mt: 3,
          border: "1px solid #F1E3D3",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={onSubmit}>
            <Grid container spacing={2.5}>
              {/* Name */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full name"
                  fullWidth
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Aarav Sharma"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              {/* Email */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email address"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="aarav@example.com"
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              {/* Batch */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Batch</InputLabel>

                  <Select
                    label="Batch"
                    value={form.batch}
                    onChange={(e) => set("batch", e.target.value)}
                  >
                    {BATCHES.map((batch) => (
                      <MenuItem key={batch} value={batch}>
                        {batch}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Password */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              {/* LinkedIn */}
              <Grid size={12}>
                <TextField
                  label="LinkedIn (optional)"
                  fullWidth
                  value={form.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                  placeholder="linkedin.com/in/..."
                />
              </Grid>

              {/* Alumni Fields */}
              {role === ROLES.ALUMNUS && (
                <>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Company"
                      fullWidth
                      value={form.company}
                      onChange={(e) => set("company", e.target.value)}
                      error={!!errors.company}
                      helperText={errors.company}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label="Designation"
                      fullWidth
                      value={form.designation}
                      onChange={(e) =>
                        set("designation", e.target.value)
                      }
                      error={!!errors.designation}
                      helperText={errors.designation}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      label="Proof note"
                      fullWidth
                      value={form.proofNote}
                      onChange={(e) =>
                        set("proofNote", e.target.value)
                      }
                      placeholder="LinkedIn or work mail proof"
                    />
                  </Grid>
                </>
              )}

              {/* Agreement Checkbox */}
              <Grid size={12}>
                <FormControl error={!!errors.agree}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.agree}
                        onChange={(e) =>
                          set("agree", e.target.checked)
                        }
                        sx={{
                          color: "#9F1239",
                          "&.Mui-checked": {
                            color: "#9F1239",
                          },
                        }}
                      />
                    }
                    label="I agree to share my profile with verified alumni."
                  />

                  {errors.agree && (
                    <FormHelperText>{errors.agree}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Submit */}
              <Grid size={12}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ alignItems: { xs: "stretch", sm: "center" } }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      px: 3,
                      py: 1.2,
                      backgroundColor: "#9F1239",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "#6B0F2A",
                      },
                    }}
                  >
                    {submitting ? "Creating account..." : title}
                  </Button>

                  <Typography variant="caption" color="#8B7766">
                    Alumni accounts are verified by the admin within 24 hours.
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Login Link */}
      <Typography variant="body2" sx={{ mt: 2, color: "#8B7766" }}>
        Already have an account?{" "}
        <Typography
          component={Link}
          to="/login"
          sx={{
            color: "#9F1239",
            textDecoration: "underline",
            fontSize: "inherit",
          }}
        >
          Login
        </Typography>
      </Typography>
    </Container>
  );
}
