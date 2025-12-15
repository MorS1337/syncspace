import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAuth } from "@utils/auth";

type Props = {
  open: boolean;
  onClose: () => void;
};

type PasswordRequirement = {
  text: string;
  met: boolean;
};

function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      text: "Минимум 8 символов",
      met: password.length >= 8,
    },
    {
      text: "Хотя бы одна буква",
      met: /[a-zA-Zа-яА-Я]/.test(password),
    },
    {
      text: "Хотя бы одна цифра",
      met: /\d/.test(password),
    },
    {
      text: "Хотя бы один специальный символ",
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
  ];
}

export function LoginDialog({ open, onClose }: Props) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([]);

  useEffect(() => {
    if (isRegister) {
      setRequirements(getPasswordRequirements(password));
    }
  }, [password, isRegister]);

  async function handleSubmit() {
    if (!name.trim() || !password.trim()) {
      setError("Заполните все поля");
      return;
    }
    if (isRegister && !requirements.every(req => req.met)) {
      setError("Пароль не соответствует требованиям");
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
          {isRegister && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Требования к паролю:
              </Typography>
              <List dense>
                {requirements.map((req, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {req.met ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <Cancel color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={req.text}
                      primaryTypographyProps={{
                        variant: "body2",
                        color: req.met ? "success.main" : "error.main",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
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

