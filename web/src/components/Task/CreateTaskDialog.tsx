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

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description?: string }) => Promise<unknown>;
};

const CreateTaskDialog = ({ open, onClose, onSubmit }: Props) => {
  const [values, setValues] = useState({ title: "", description: "" });

  const handleSubmit = async () => {
    if (!values.title.trim()) return;
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || undefined
    });
    setValues({ title: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Новая задача</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Название"
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
            autoFocus
          />
          <TextField
            label="Описание"
            multiline
            minRows={3}
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit}>Создать</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTaskDialog;

