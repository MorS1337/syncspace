import { PropsWithChildren } from "react";
import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <Stack minHeight="100vh">
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: "inherit", textDecoration: "none" }}
          >
            SyncSpace
          </Typography>
        </Toolbar>
      </AppBar>
      <Box flexGrow={1} py={4}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Stack>
  );
};

export default AppLayout;

