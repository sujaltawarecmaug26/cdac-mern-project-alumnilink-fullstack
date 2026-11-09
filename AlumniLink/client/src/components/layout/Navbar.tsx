import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { useAuth } from "../../hooks/useAuth.js";
import { ROLES } from "../../utils/constants.js";

export function Navbar() {
  const { user, logout, isPendingAlumni } = useAuth();
  const navigate = useNavigate();

  let links = [
    { to: "/", label: "Home", end: true },
    { to: "/login", label: "Login" },
  ];

  if (user?.role === ROLES.STUDENT) {
    links = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/jobs", label: "Find jobs" },
      { to: "/applications", label: "My applications" },
      { to: "/profile", label: "Profile" },
    ];
  }

  if (user?.role === ROLES.ALUMNUS) {
    links = [
      { to: "/alumni", label: "Dashboard" },
      { to: "/alumni/jobs/new", label: "Post a job" },
      { to: "/alumni/applications", label: "Applications" },
      { to: "/alumni/profile", label: "Profile" },
    ];
  }

  if (user?.role === ROLES.ADMIN) {
    links = [{ to: "/admin", label: "Admin dashboard" }];
  }

  const logoPath =
    user?.role === ROLES.ADMIN
      ? "/admin"
      : user?.role === ROLES.ALUMNUS
      ? "/alumni"
      : user
      ? "/dashboard"
      : "/";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #F1E3D3",
        color: "#2B1B17",
      }}
    >
      {isPendingAlumni && (
        <Box
          sx={{
            backgroundColor: "#FFFBEB",
            color: "#92400E",
            textAlign: "center",
            py: 1,
            px: 2,
          }}
        >
          <Typography variant="caption">
            Your alumni account is awaiting admin verification. You can update
            your profile, but cannot post jobs yet.
          </Typography>
        </Box>
      )}

      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: "64px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            py: 1,
          }}
        >
          {/* Logo */}
          <Link to={logoPath} style={{ textDecoration: "none" }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#9F1239",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              A
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#9F1239",
                fontFamily: "Playfair Display, serif",
              }}
            >
              AlumniLink
            </Typography>
            </Stack>
          </Link>

          {/* Navigation Links */}
          <Stack
            direction="row"
            spacing={{ xs: 1, sm: 2 }}
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={{ textDecoration: "none" }}
              >
                {({ isActive }) => (
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#9F1239" : "#6B5B52",
                      borderBottom: isActive
                        ? "2px solid #9F1239"
                        : "2px solid transparent",
                      padding: "8px 2px",
                      "&:hover": {
                        color: "#9F1239",
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                )}
              </NavLink>
            ))}

            {user && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                sx={{
                  color: "#9F1239",
                  borderColor: "#9F1239",
                  textTransform: "none",
                  px: 2,
                  "&:hover": {
                    backgroundColor: "#FFF8F1",
                    borderColor: "#6B0F2A",
                  },
                }}
              >
                Logout
              </Button>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}