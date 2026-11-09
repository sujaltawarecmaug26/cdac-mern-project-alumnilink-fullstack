
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.tsx";
import { ROLES } from "../../utils/constants.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(email, password);

      toast.success("Welcome back");

      if (user.role === ROLES.ADMIN) {
        navigate("/admin");
      } else if (user.role === ROLES.ALUMNUS) {
        navigate("/alumni");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box>
        <Typography
          variant="h4"
          sx={{ color: "#2B1B17" ,fontWeight:700}}
        >
          Login
        </Typography>

        <Typography sx={{ color: "#8B7766", mt: 1 }}>
          Sign in to AlumniLink
        </Typography>
      </Box>

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
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {submitting ? "Signing in..." : "Login"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        spacing={1}
        sx={{ mt: 2, flexWrap: "wrap" }}
      >
        <Typography
          component={Link}
          to="/forgot-password"
          sx={{
            color: "#9F1239",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          Forgot password?
        </Typography>

        <Typography sx={{ color: "#8B7766" }}>·</Typography>

        <Typography
          component={Link}
          to="/register"
          sx={{
            color: "#9F1239",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          Create account
        </Typography>
      </Stack>
    </Container>
  );
}
