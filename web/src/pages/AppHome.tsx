import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSpace, joinSpace, listSpaces } from "@api/spaces";

type Space = {
  id: number;
  title: string;
  description?: string | null;
  invite_code: string;
};

export default function AppHome() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    loadSpaces();
  }, []);

  async function loadSpaces() {
    try {
      const data = await listSpaces();
      setSpaces(data);
    } catch (e) {
      console.error("Failed to load spaces", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title.trim()) return;
    try {
      const newSpace = await createSpace({ title: title.trim(), description: description.trim() });
      setSpaces([newSpace, ...spaces]);
      setCreateOpen(false);
      setTitle("");
      setDescription("");
    } catch (e) {
      console.error("Failed to create space", e);
    }
  }

  async function handleJoin() {
    if (!inviteCode.trim()) return;
    setJoinError("");
    try {
      const space = await joinSpace(inviteCode.trim());

      if (!spaces.find(s => s.id === space.id)) {
        setSpaces([space, ...spaces]);
      }
      setJoinOpen(false);
      setInviteCode("");
      nav(`/space/${space.id}`);
    } catch (e: any) {
      setJoinError(e.message || "Неверный код приглашения");
    }
  }

  return (
    <>
      <Container sx={{ py: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>
            Ваши пространства
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => setJoinOpen(true)}>
              Войти по коду
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
              Создать Space
            </Button>
          </Stack>
        </Stack>

        {loading ? (
          <Typography color="text.secondary">Загрузка...</Typography>
        ) : spaces.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет пространств
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Создайте первое пространство или присоединитесь по коду
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => setJoinOpen(true)}>
                Войти по коду
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
                Создать Space
              </Button>
            </Stack>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {spaces.map((space) => (
              <Grid item xs={12} md={6} lg={4} key={space.id}>
                <Card sx={{ cursor: "pointer", "&:hover": { boxShadow: 4 } }} onClick={() => nav(`/space/${space.id}`)}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {space.title}
                    </Typography>
                    {space.description && (
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {space.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Код приглашения: {space.invite_code}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать новое пространство</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <TextField
              label="Описание (необязательно)"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={joinOpen} onClose={() => { setJoinOpen(false); setJoinError(""); }} maxWidth="sm" fullWidth>
        <DialogTitle>Присоединиться к пространству</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography color="text.secondary">
              Введите код приглашения, чтобы присоединиться к существующему пространству
            </Typography>
            <TextField
              autoFocus
              label="Код приглашения"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              error={!!joinError}
              helperText={joinError}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setJoinOpen(false); setJoinError(""); }}>Отмена</Button>
          <Button variant="contained" onClick={handleJoin}>
            Присоединиться
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
