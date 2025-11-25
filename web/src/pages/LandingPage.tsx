import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import SecurityIcon from "@mui/icons-material/Security";
import SyncIcon from "@mui/icons-material/Sync";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginDialog } from "@components/auth/LoginDialog";
import { useAuth } from "@utils/auth";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  const goApp = () => {
    if (user) {
      nav("/app");
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" fontWeight={800} gutterBottom>
                SyncSpace — <br /> пространство для команд и хакатонов
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Pages (Markdown), Kanban-задачи, инвайты и роли — всё в одном месте, без
                бесконечных таблиц и чатов.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button size="large" variant="contained" startIcon={<RocketLaunchIcon />} onClick={goApp}>
                  {user ? "Перейти в приложение" : "Начать бесплатно"}
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  onClick={() => window.scrollTo({ top: 1000, behavior: "smooth" })}
                >
                  Узнать больше
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  borderRadius: 4,
                  boxShadow: 6,
                  p: 3,
                  bgcolor: "background.paper",
                  minHeight: 280,
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  (тут будет скрин/демо канбана)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>

        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={3}>
            {[
              {
                icon: <BoltIcon fontSize="large" color="primary" />,
                title: "Быстрый старт",
                text: "Создай Space, зови команду по коду и работай с первого дня."
              },
              {
                icon: <SecurityIcon fontSize="large" color="primary" />,
                title: "Роли и доступ",
                text: "Organizer / Member / Mentor. Права и логирование встроены."
              },
              {
                icon: <SyncIcon fontSize="large" color="primary" />,
                title: "Реалтайм (soon)",
                text: "WS-ивенты, live-правки и заметки без обновления страницы."
              }
            ].map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
                      {feature.icon}
                      <Typography variant="h6">{feature.title}</Typography>
                    </Stack>
                    <Typography color="text.secondary">{feature.text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ py: 8, bgcolor: "grey.100", borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
          <Container>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h4" fontWeight={800}>
                Готовы попробовать?
              </Typography>
              <Typography color="text.secondary" align="center" maxWidth={640}>
                Войдите по нику и создайте первое пространство. Без паролей, без лишних форм.
              </Typography>
              <Button size="large" variant="contained" onClick={goApp}>
                {user ? "Открыть приложение" : "Войти по нику"}
              </Button>
            </Stack>
          </Container>
        </Box>

        <Container sx={{ py: 4 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
            <Typography color="text.secondary">© {new Date().getFullYear()} SyncSpace</Typography>
            <Typography color="text.secondary">Made for MISIS hacks ♥</Typography>
          </Stack>
        </Container>
      </Box>

      <LoginDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}

