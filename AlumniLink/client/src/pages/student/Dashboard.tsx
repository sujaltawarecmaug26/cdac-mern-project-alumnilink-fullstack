import { Link } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useAuth } from "../../hooks/useAuth.js";
import { useFetch } from "../../hooks/useFetch.js";
import { applicationsApi } from "../../api/applications.js";
import { profileApi } from "../../api/profile.js";

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: profileData } = useFetch(() => profileApi.me(), []);
  const { data: applications } = useFetch(() => applicationsApi.mine(), []);

  const items = applications || [];

  const pending = items.filter((a) => a.status === "pending").length;
  const approved = items.filter((a) => a.status === "approved").length;

  const stats = [
    { label: "Applications", value: items.length },
    { label: "Pending review", value: pending },
    { label: "Approved", value: approved },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Page Heading */}
      <Typography
        variant="overline"
        sx={{
          color: "#9F1239",
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Student workspace
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#6B0F2A",
          fontFamily: "Playfair Display, serif",
        }}
      >
        Welcome, {user?.name?.split(" ")[0]}
      </Typography>

      <Typography sx={{ color: "#8B7766", mt: 1 }}>
        Find opportunities shared by verified alumni and keep track of your
        applications.
      </Typography>

      {/* Dashboard Statistics */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Card
              sx={{
                border: "1px solid #F1E3D3",
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: "#8B7766" }}>
                  {stat.label}
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    mt: 1,
                    color: "#9F1239",
                    fontWeight: 700,
                    fontFamily: "Playfair Display, serif",
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Profile and Opportunities Cards */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid #F1E3D3",
              borderRadius: 3,
              boxShadow: 1,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#6B0F2A",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Your profile
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#8B7766", mt: 2 }}
              >
                {profileData?.profile?.resumeName
                  ? `Resume uploaded: ${profileData.profile.resumeName}`
                  : "Upload your PDF resume before applying to jobs."}
              </Typography>

              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                sx={{
                  mt: 3,
                  color: "#9F1239",
                  borderColor: "#9F1239",
                }}
              >
                Manage profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              border: "1px solid #F1E3D3",
              borderRadius: 3,
              boxShadow: 1,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#6B0F2A",
                  fontFamily: "Playfair Display, serif",
                }}
              >
                Explore opportunities
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#8B7766", mt: 2 }}
              >
                Browse jobs posted by verified alumni and apply with your
                saved resume.
              </Typography>

              <Button
                component={Link}
                to="/jobs"
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#9F1239",
                  "&:hover": {
                    backgroundColor: "#6B0F2A",
                  },
                }}
              >
                Browse jobs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Applications Heading */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 5,
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#6B0F2A",
            fontFamily: "Playfair Display, serif",
          }}
        >
          Recent applications
        </Typography>

        <Typography
          component={Link}
          to="/applications"
          sx={{
            color: "#9F1239",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          View all
        </Typography>
      </Box>

      {/* Recent Applications List */}
      <Stack spacing={2}>
        {items.slice(0, 4).map((a) => (
          <Card
            key={a._id}
            sx={{
              border: "1px solid #F1E3D3",
              borderRadius: 3,
              boxShadow: 1,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#2B1B17" }}>
                    {a.jobId?.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#8B7766" }}>
                    {a.jobId?.company}
                  </Typography>
                </Box>

                <Chip
                  label={a.status}
                  size="small"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                    backgroundColor:
                      a.status === "approved"
                        ? "#F0FDF4"
                        : a.status === "rejected"
                        ? "#FEF2F2"
                        : "#FFF8E1",
                    color:
                      a.status === "approved"
                        ? "#15803D"
                        : a.status === "rejected"
                        ? "#B91C1C"
                        : "#92400E",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}