import { AppBar, Avatar, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@utils/auth";
import { useState } from "react";
import { LoginDialog } from "@components/auth/LoginDialog";
import { useTheme } from "../../contexts/ThemeProvider";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export function NavBar() {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const nav = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: 800 }}
          >
            SyncSpace
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {user ? (
              <>
                <Button variant="outlined" onClick={() => nav("/app")}>
                  Открыть /app
                </Button>
                <Avatar
                  src={user.avatar_url || undefined}
                  alt={user.name}
                  sx={{ width: 32, height: 32, cursor: "pointer" }}
                >
                  {user.name[0].toUpperCase()}
                </Avatar>
                <Button onClick={logout}>Выйти</Button>
              </>
            ) : (
              <Button onClick={() => setLoginOpen(true)}>Войти</Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

