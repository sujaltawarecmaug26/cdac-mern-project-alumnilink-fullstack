import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

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

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const token = params.get("token") || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await authApi.reset({
        token,
        newPassword: password,
      });

      toast.success("Password updated");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ maxWidth: 450, mx: "auto" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#6B0F2A",
            mb: 1,
          }}
        >
          Reset password
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your new password below.
        </Typography>

        <Card
          sx={{
            border: "1px solid #F1E3D3",
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              component="form"
              spacing={3}
              onSubmit={handleSubmit}
            >
              <TextField
                label="New password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{
                  py: 1.2,
                  backgroundColor: "#9F1239",
                  "&:hover": {
                    backgroundColor: "#6B0F2A",
                  },
                }}
              >
                {submitting ? "Updating..." : "Reset password"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Typography
          component={Link}
          to="/login"
          sx={{
            display: "inline-block",
            mt: 2,
            color: "#9F1239",
            textDecoration: "underline",
            fontSize: 14,
          }}
        >
          Back to login
        </Typography>
      </Box>
    </Container>
  );
}