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

import { useFetch } from "../../hooks/useFetch.js";
import { alumniApi } from "../../api/alumni.js";

export default function Landing() {
  const { data: featured, loading } = useFetch(
    () => alumniApi.featured(),
    []
  );

  const steps = [
    {
      number: "01",
      title: "Build your profile",
      description: "Add your skills and one current PDF resume.",
    },
    {
      number: "02",
      title: "Explore real opportunities",
      description: "Browse jobs posted by verified alumni.",
    },
    {
      number: "03",
      title: "Apply and connect",
      description: "Track applications and connect after approval.",
    },
  ];

  const features = [
    {
      title: "Create your profile",
      description:
        "Students and alumni create a profile. Alumni accounts are verified by an admin.",
    },
    {
      title: "Share opportunities",
      description:
        "Verified alumni post jobs with role details and required skills.",
    },
    {
      title: "Apply with confidence",
      description:
        "Students apply using their saved resume and track the decision.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, sm: 6 },
          color: "#FFFFFF",
          background: "linear-gradient(135deg, #9F1239, #6B0F2A)",
        }}
      >
        <Grid container spacing={5} sx={{ alignItems: "center" }}>
          {/* Hero Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              A stronger alumni network
            </Typography>

            <Typography
              variant="h2"
              sx={{
                mt: 1,
                fontSize: { xs: "2.3rem", sm: "3.2rem" },
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Your next opportunity starts{" "}
              <Box component="span" sx={{ color: "#FCD34D" }}>
                with your community.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2,
                maxWidth: 500,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8,
              }}
            >
              AlumniLink connects students with verified alumni sharing
              real job opportunities, guidance and professional connections.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                component={Link}
                to="/register?role=student"
                variant="contained"
                sx={{
                  backgroundColor: "#D97706",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    backgroundColor: "#B45309",
                  },
                }}
              >
                Join as a student
              </Button>

              <Button
                component={Link}
                to="/register?role=alumnus"
                variant="contained"
                sx={{
                  backgroundColor: "#FFFFFF",
                  color: "#6B0F2A",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    backgroundColor: "#FFF8F1",
                  },
                }}
              >
                Join as an alumnus
              </Button>
            </Stack>
          </Grid>

          {/* Hero Steps Card */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card
              elevation={0}
              sx={{
                backgroundColor: "rgba(255,255,255,0.10)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 3,
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  A simple path forward
                </Typography>

                <Stack spacing={3} sx={{ mt: 3 }}>
                  {steps.map((step) => (
                    <Stack
                      key={step.number}
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: "flex-start" }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.15)",
                          fontWeight: 700,
                        }}
                      >
                        {step.number}
                      </Box>

                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {step.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.5,
                            color: "rgba(255,255,255,0.75)",
                          }}
                        >
                          {step.description}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* How AlumniLink Works */}
      <Box id="how" sx={{ mt: 7 }}>
        <Typography
          variant="h4"
          sx={{ color: "#2B1B17", textAlign: "center", fontWeight: 700 }}
        >
          How AlumniLink works
        </Typography>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={feature.title}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid #F1E3D3",
                  borderRadius: 3,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      backgroundColor: "#9F1239",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{ color: "#2B1B17", fontWeight: 700 }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "#8B7766",
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Alumni Community */}
      <Box sx={{ mt: 7 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "#2B1B17", fontWeight: 700 }}
          >
            Our alumni community
          </Typography>

          <Button
            component={Link}
            to="/register?role=alumnus"
            variant="text"
            sx={{
              color: "#9F1239",
              textDecoration: "underline",
              textTransform: "none",
            }}
          >
            Become a member
          </Button>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 3, flexWrap: "wrap" }}
        >
          {loading ? (
            <Typography variant="body2" color="#8B7766">
              Loading alumni...
            </Typography>
          ) : (
            (featured || []).map((a: { id: string | number; name: string; company: string }) => (
              <Chip
                key={a.id}
                label={`${a.name} · ${a.company}`}
                sx={{
                  backgroundColor: "#FCE7EF",
                  color: "#9F1239",
                  fontWeight: 500,
                  borderRadius: 2,
                }}
              />
            ))
          )}
        </Stack>
      </Box>
    </Container>
  );
}
