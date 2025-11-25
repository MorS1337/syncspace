import { AppBar, Button, Stack, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "@utils/auth";
import { useState } from "react";
import { LoginDialog } from "@components/auth/LoginDialog";

export function NavBar() {
  const { user, logout } = useAuth();
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
          <Stack direction="row" spacing={1}>
            {user ? (
              <>
                <Button variant="outlined" onClick={() => nav("/app")}>
                  Открыть /app
                </Button>
                <Button onClick={logout}>Выйти ({user.name})</Button>
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

