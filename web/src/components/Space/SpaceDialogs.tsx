import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";
import { useState } from "react";

type CreateProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description?: string }) => Promise<unknown>;
  loading?: boolean;
};

export const CreateSpaceDialog = ({ open, onClose, onSubmit, loading }: CreateProps) => {
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await onSubmit({ title: form.title.trim(), description: form.description.trim() || undefined });
    setForm({ title: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Новый Space</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Название"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            autoFocus
            required
          />
          <TextField
            label="Описание"
            multiline
            minRows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

type JoinProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<unknown>;
  loading?: boolean;
};

export const JoinSpaceDialog = ({ open, onClose, onSubmit, loading }: JoinProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = async () => {
    if (!code.trim()) return;
    await onSubmit(code.trim());
    setCode("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Присоединиться по коду</DialogTitle>
      <DialogContent>
        <TextField
          label="Invite code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          fullWidth
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} disabled={loading}>
          Присоединиться
        </Button>
      </DialogActions>
    </Dialog>
  );
};

