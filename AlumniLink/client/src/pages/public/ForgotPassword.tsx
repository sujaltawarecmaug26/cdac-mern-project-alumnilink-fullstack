
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { authApi } from "../../api/auth.js";
import { useToast } from "../../context/ToastContext.tsx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      await authApi.forgot({ email });

      toast.success(
        "If that email exists, a reset link was sent"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not send reset link"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      {/* Heading */}
      <Typography
        variant="h4"
        sx={{ color: "#2B1B17",fontWeight:700 }}
      >
        Forgot password
      </Typography>

      <Typography sx={{ mt: 1, color: "#8B7766" }}>
        Enter your registered email address to reset your password.
      </Typography>

      {/* Forgot Password Form */}
      <Card
        elevation={0}
        sx={{
          mt: 3,
          border: "1px solid #F1E3D3",
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                placeholder="yourname@example.com"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{
                  py: 1.3,
                  fontWeight: 600,
                  backgroundColor: "#9F1239",
                  "&:hover": {
                    backgroundColor: "#6B0F2A",
                  },
                }}
              >
                {submitting ? "Sending..." : "Send reset link"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Back to Login */}
      <Typography
        component={Link}
        to="/login"
        sx={{
          display: "inline-block",
          mt: 2,
          color: "#9F1239",
          fontSize: 14,
          textDecoration: "underline",
        }}
      >
        Back to login
      </Typography>
    </Container>
  );
}
