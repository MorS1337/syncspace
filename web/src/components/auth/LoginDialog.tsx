import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@utils/auth";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function LoginDialog({ open, onClose }: Props) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }
    setError("");
    try {
      if (isRegister) {
        await register(name.trim(), password.trim());
      } else {
        await login(name.trim(), password.trim());
      }
      onClose();
    } catch (e) {
      setError("Ошибка входа. Проверьте данные.");
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{isRegister ? "Регистрация" : "Вход"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography color="text.secondary">
            {isRegister
              ? "Придумайте ник и пароль для доступа."
              : "Введите свои данные для входа."}
          </Typography>
          <TextField
            autoFocus
            label="Ник"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            variant="text"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Создать"}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isRegister ? "Создать" : "Войти"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

