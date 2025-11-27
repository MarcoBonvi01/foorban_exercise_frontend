import {
  Box,
  Paper,
  Stack,
  Button,
  Typography,
  Container,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";

interface NavigatorLink {
  label: string;
  path: string;
}

interface LayoutProps {
  element: NavigatorLink[];
}

export function Layout({ element }: LayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          MyApp
        </Typography>

        <Stack direction="row" spacing={2}>
          {element.map((item: NavigatorLink, index: number) => (
            <Button
              key={index}
              component={Link}
              to={item.path}
              variant="contained"
              color="secondary"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "#e0e0ff" },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
      </Paper>

      <Container>
        <Outlet />
      </Container>
    </Box>
  );
}
