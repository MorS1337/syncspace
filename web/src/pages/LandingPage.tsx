import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginDialog } from "@components/auth/LoginDialog";
import { useAuth } from "@utils/auth";

export default function LandingPage() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();
  const theme = useTheme();

  const goApp = () => {
    if (user) {
      nav("/app");
    } else {
      setOpen(true);
    }
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Box
            sx={{
              pt: { xs: 12, md: 20 },
              pb: { xs: 8, md: 12 },
              textAlign: "center",
            }}
          >
            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 10,
                bgcolor: isDark ? alpha("#3b82f6", 0.1) : alpha("#3b82f6", 0.1),
                border: 1,
                borderColor: isDark ? alpha("#3b82f6", 0.2) : alpha("#3b82f6", 0.2),
                mb: 3,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#3b82f6",
                }}
              />
              <Typography variant="body2" sx={{ color: "#3b82f6", fontWeight: 600 }}>
                Работает на React + FastAPI
              </Typography>
            </Box>

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                background: isDark
                  ? "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)"
                  : "linear-gradient(135deg, #000 0%, #3b82f6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              Командная работа,
              <br />
              без хаоса.
            </Typography>

            {/* Subheadline */}
            <Typography
              variant="h6"
              sx={{
                maxWidth: 720,
                mx: "auto",
                mb: 5,
                color: "text.secondary",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Markdown заметки, Kanban доски, и приглашения по коду.
              <br />
              Всё что нужно вашей команде для продуктивной работы.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                size="large"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={goApp}
                sx={{
                  bgcolor: isDark ? "#3b82f6" : "#000",
                  color: "#fff",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: isDark
                    ? `0 4px 14px ${alpha("#3b82f6", 0.4)}`
                    : "0 4px 14px rgba(0,0,0,0.2)",
                  "&:hover": {
                    bgcolor: isDark ? "#2563eb" : "#1a1a1a",
                    transform: "translateY(-1px)",
                    boxShadow: isDark
                      ? `0 6px 20px ${alpha("#3b82f6", 0.5)}`
                      : "0 6px 20px rgba(0,0,0,0.3)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {user ? "Открыть приложение" : "Начать бесплатно"}
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* Features Grid */}
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={4}>
            {[
              {
                title: "Markdown редактор",
                description: "Пишите документацию с подсветкой кода и живым preview",
              },
              {
                title: "Kanban доски",
                description: "Визуализируйте рабочий процесс. Drag & drop, приоритеты, дедлайны",
              },
              {
                title: "Приглашения по коду",
                description: "Добавляйте участников за секунды. Без email, без подтверждений",
              },
              {
                title: "Темная тема",
                description: "Комфортная работа в любое время суток с автосохранением настроек",
              },
              {
                title: "Защита данных",
                description: "Безопасная аутентификация с bcrypt хешированием паролей",
              },
              {
                title: "Реальное время",
                description: "Синхронизация изменений между участниками команды",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 3,
                    border: 1,
                    borderColor: "divider",
                    bgcolor: isDark ? alpha("#fff", 0.02) : "background.paper",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: isDark ? alpha("#3b82f6", 0.5) : alpha("#3b82f6", 0.3),
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Social Proof */}
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
          <Box
            sx={{
              textAlign: "center",
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              bgcolor: isDark ? alpha("#3b82f6", 0.05) : alpha("#3b82f6", 0.05),
              border: 1,
              borderColor: isDark ? alpha("#3b82f6", 0.2) : alpha("#3b82f6", 0.15),
            }}
          >
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Всё необходимое для хакатонов
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
              Создано специально для команд, которым нужно быстро организовать работу и сфокусироваться на результате
            </Typography>
            <Stack spacing={2} sx={{ maxWidth: 500, mx: "auto" }}>
              {[
                "Запуск за 30 секунд",
                "Приглашения одной ссылкой",
                "Роли и права доступа",
                "Современный интерфейс",
              ].map((item, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="center">
                  <CheckCircleIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
                  <Typography variant="body1" textAlign="left">
                    {item}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Container>

        {/* Final CTA */}
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: "center" }}>
          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ mb: 2 }}>
            Готовы начать?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
            Присоединяйтесь к командам, которые выбирают простоту и эффективность
          </Typography>
          <Button
            size="large"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={goApp}
            sx={{
              bgcolor: isDark ? "#3b82f6" : "#000",
              color: "#fff",
              px: 5,
              py: 1.75,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: isDark ? `0 4px 14px ${alpha("#3b82f6", 0.4)}` : "0 4px 14px rgba(0,0,0,0.2)",
              "&:hover": {
                bgcolor: isDark ? "#2563eb" : "#1a1a1a",
                transform: "translateY(-1px)",
                boxShadow: isDark ? `0 6px 20px ${alpha("#3b82f6", 0.5)}` : "0 6px 20px rgba(0,0,0,0.3)",
              },
              transition: "all 0.2s",
            }}
          >
            {user ? "Открыть приложение" : "Начать работу"}
          </Button>
        </Container>

        {/* Footer */}
        <Container sx={{ py: 6, borderTop: 1, borderColor: "divider" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} SyncSpace
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" color="text.secondary">
                Made with ♥ for MISIS
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <LoginDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
