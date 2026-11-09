import { Box, Container, Stack, Typography } from "@mui/material";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(241, 227, 211, 0.7)",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "#8B7766" }}>
            AlumniLink · Placement & Alumni Relations
          </Typography>

          <Typography variant="body2" sx={{ color: "#8B7766" }}>
            A trusted student–alumni job network
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}