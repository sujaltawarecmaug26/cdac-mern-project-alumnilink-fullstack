
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
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { applicationsApi } from "../../api/applications.js";
import { useToast } from "../../context/ToastContext.tsx";

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState({});
  const [contactLoading, setContactLoading] = useState({});
  const toast = useToast();

  const load = () =>
    applicationsApi
      .mine()
      .then((r) => setItems(r.data || []))
      .catch((e) =>
        toast.error(
          e.response?.data?.message || "Could not load applications"
        )
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleViewContact = async (appId) => {
    try {
      setContactLoading((prev) => ({ ...prev, [appId]: true }));

      const r = await applicationsApi.contact(appId);

      setContacts((prev) => ({
        ...prev,
        [appId]: r.data,
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Contact unavailable");
    } finally {
      setContactLoading((prev) => ({ ...prev, [appId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "flex-end" },
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
            Your activity
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 700,
              color: "#2B1B17",
            }}
          >
            My applications
          </Typography>

          <Typography sx={{ mt: 1, color: "#8B7766" }}>
            Track the status of jobs you have applied for.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/jobs"
          variant="outlined"
          sx={{
            borderColor: "#9F1239",
            color: "#9F1239",
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
          }}
        >
          Browse jobs
        </Button>
      </Stack>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#9F1239" }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <Card
          sx={{
            mt: 4,
            borderRadius: 3,
            border: "1px solid #F1E3D3",
            textAlign: "center",
          }}
        >
          <CardContent sx={{ py: 5 }}>
            <Typography variant="h6" sx={{fontWeight:600}}>
              No applications yet
            </Typography>

            <Typography sx={{ mt: 1, color: "#8B7766" }}>
              Explore jobs posted by verified alumni and apply with your saved
              resume.
            </Typography>

            <Button
              component={Link}
              to="/jobs"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#9F1239",
                textTransform: "none",
                "&:hover": { backgroundColor: "#6B0F2A" },
              }}
            >
              Explore jobs
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      {!loading && items.length > 0 && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {items.map((app) => (
            <Card
              key={app._id}
              sx={{
                borderRadius: 3,
                border: "1px solid #F1E3D3",
                boxShadow: "0 3px 12px rgba(43, 27, 23, 0.05)",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* Job Details and Status */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "flex-start" },
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
                      {app.jobId?.title || "Job no longer available"}
                    </Typography>

                    <Typography
                      sx={{ color: "#9F1239", fontWeight: 600 }}
                    >
                      {app.jobId?.company}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1, color: "#8B7766" }}
                    >
                      {app.jobId?.location} · Applied{" "}
                      {new Date(app.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Chip
                    label={app.status}
                    color={getStatusColor(app.status)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  />
                </Stack>

                <Divider sx={{ my: 2, borderColor: "#F1E3D3" }} />

                {/* Resume Information */}
                <Typography variant="body2" sx={{ color: "#8B7766" }}>
                  **Resume submitted:** {app.resumeName}
                </Typography>

                {/* Decision Message */}
                {app.decisionNote && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Message:</strong> {app.decisionNote}
                    </Typography>
                  </Alert>
                )}

                {/* Approved Application Contact */}
                {app.status === "approved" && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleViewContact(app._id)}
                      disabled={contactLoading[app._id]}
                      sx={{
                        backgroundColor: "#9F1239",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#6B0F2A",
                        },
                      }}
                    >
                      {contactLoading[app._id]
                        ? "Loading contact..."
                        : "View alumni contact"}
                    </Button>
                  </Box>
                )}

                {/* Contact Details */}
                {contacts[app._id] && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography  sx={{fontWeight:700}}>
                      {contacts[app._id].name}
                    </Typography>

                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {contacts[app._id].email || "Email not provided"}
                    </Typography>

                    <Typography variant="body2">
                      {contacts[app._id].phone || "Phone not provided"}
                    </Typography>

                    {contacts[app._id].linkedin && (
                      <Button
                        component="a"
                        href={contacts[app._id].linkedin}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                          mt: 1,
                          p: 0,
                          color: "#9F1239",
                          textTransform: "none",
                        }}
                      >
                        LinkedIn profile
                      </Button>
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
