
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { jobsApi } from "../../api/jobs.js";

export default function JobBoard() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      jobsApi
        .list({ q, limit: 30 })
        .then((res) => {
          if (active) setItems(res.data || []);
        })
        .catch((err) => {
          if (active) {
            setError(
              err.response?.data?.message || "Could not load jobs"
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Heading and Search */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "flex-end" },
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "#9F1239",
              fontWeight: 700,
              letterSpacing: 1.5,
            }}
          >
            Opportunities
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              color: "#2B1B17",
            }}
          >
            Find your next opportunity
          </Typography>

          <Typography sx={{ mt: 1, color: "#8B7766" }}>
            Explore jobs shared by verified alumni.
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search job title, company or skills..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          sx={{
            maxWidth: { sm: 380 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
            },
          }}
        />
      </Stack>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress sx={{ color: "#9F1239" }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <Card sx={{ mt: 4, borderRadius: 3, border: "1px solid #F1E3D3" }}>
          <CardContent sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              No jobs found
            </Typography>

            <Typography sx={{ mt: 1, color: "#8B7766" }}>
              Try a different search. Check back later for new opportunities.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Job Cards */}
      {!loading && !error && items.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {items.map((job) => (
            <Grid size={{ xs: 12, md: 6 }} key={job._id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #F1E3D3",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 3px 12px rgba(43, 27, 23, 0.05)",
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(43, 27, 23, 0.10)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Job Title and Status */}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Playfair Display, serif",
                          fontWeight: 700,
                          color: "#2B1B17",
                        }}
                      >
                        {job.title}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          color: "#9F1239",
                          fontWeight: 600,
                        }}
                      >
                        {job.company}
                      </Typography>
                    </Box>

                    <Chip
                      label="Open"
                      size="small"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>

                  {/* Job Information */}
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: "#8B7766" }}
                  >
                    {job.location} · {job.experience} ·{" "}
                    {job.alumniId?.name
                      ? `Posted by ${job.alumniId.name}`
                      : "Verified alumnus"}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: "#2B1B17",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {job.description}
                  </Typography>

                  {/* Skills */}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 2, flexWrap: "wrap" }}
                  >
                    {(job.skills || []).slice(0, 5).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          backgroundColor: "#F1E3D3",
                          color: "#2B1B17",
                        }}
                      />
                    ))}
                  </Stack>

                  {/* View Details */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      component={Link}
                      to={`/jobs/${job._id}`}
                      variant="contained"
                      sx={{
                        backgroundColor: "#9F1239",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: "#6B0F2A",
                        },
                      }}
                    >
                      View details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
