import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight="50vh" spacing={2}>
      <Typography variant="h3">404</Typography>
      <Typography color="text.secondary">Страница не найдена</Typography>
      <Button variant="contained" component={RouterLink} to="/">
        На главную
      </Button>
    </Stack>
  );
};

export default NotFoundPage;

