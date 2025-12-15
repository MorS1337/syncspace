import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    ListItemIcon,
    ListItemText,
    Autocomplete,
    Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useMembers } from "../../hooks/useMembers";
import { useTags, type Tag } from "../../hooks/useTags";
import type { Task } from "@app-types/index";

type Props = {
    open: boolean;
    onClose: () => void;
    spaceId: number;
    task?: Task;
    onSubmit: (payload: {
        title: string;
        description?: string;
        priority?: number;
        assignee_id?: number;
        due_at?: string;
        tag_ids?: number[];
    }) => Promise<unknown>;
    onDelete?: (taskId: number) => void;
};

const TaskDialog = ({ open, onClose, spaceId, task, onSubmit, onDelete }: Props) => {
    const [values, setValues] = useState({
        title: "",
        description: "",
        priority: 5,
        assignee_id: undefined as number | undefined,
        due_at: "" as string,
        tag_ids: [] as number[]
    });
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const { data: members } = useMembers(spaceId);
    const { tagsQuery, createTag } = useTags(spaceId);

    useEffect(() => {
        if (open) {
            if (task) {
                setValues({
                    title: task.title,
                    description: task.description || "",
                    priority: task.priority ?? 5,
                    assignee_id: task.assignee_id ?? undefined,
                    due_at: task.due_at ? new Date(task.due_at).toISOString().split('T')[0] : "",
                    tag_ids: task.tag_ids || []
                });
            } else {
                setValues({ title: "", description: "", priority: 5, assignee_id: undefined, due_at: "", tag_ids: [] });
            }
        }
    }, [open, task]);

    const handleSubmit = async () => {
        if (!values.title.trim()) return;
        await onSubmit({
            title: values.title.trim(),
            description: values.description.trim() || undefined,
            priority: values.priority,
            assignee_id: values.assignee_id,
            due_at: values.due_at || undefined,
            tag_ids: values.tag_ids
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{task ? "Редактировать задачу" : "Новая задача"}</DialogTitle>
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
                    <FormControl fullWidth>
                        <InputLabel>Приоритет</InputLabel>
                        <Select
                            value={values.priority}
                            label="Приоритет"
                            onChange={(e) => setValues((prev) => ({ ...prev, priority: Number(e.target.value) }))}
                        >
                            <MenuItem value={9}>High (9)</MenuItem>
                            <MenuItem value={7}>High (7)</MenuItem>
                            <MenuItem value={5}>Medium (5)</MenuItem>
                            <MenuItem value={3}>Low (3)</MenuItem>
                            <MenuItem value={1}>Low (1)</MenuItem>
                            <MenuItem value={0}>None (0)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Исполнитель</InputLabel>
                        <Select
                            value={values.assignee_id || ""}
                            label="Исполнитель"
                            onChange={(e) => setValues((prev) => ({
                                ...prev,
                                assignee_id: e.target.value ? Number(e.target.value) : undefined
                            }))}
                        >
                            <MenuItem value="">
                                <em>Не назначено</em>
                            </MenuItem>
                            {members?.map((member) => (
                                <MenuItem key={member.user_id} value={member.user_id}>
                                    <ListItemIcon>
                                        <Avatar
                                            src={member.avatar_url || undefined}
                                            sx={{ width: 24, height: 24, fontSize: "0.875rem" }}
                                        >
                                            {member.name[0].toUpperCase()}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={member.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Дедлайн"
                        type="date"
                        value={values.due_at}
                        onChange={(e) => setValues((prev) => ({ ...prev, due_at: e.target.value }))}
                        InputLabelProps={{ shrink: true }}
                        helperText="Опциональная дата выполнения задачи"
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                {task ? (
                    <Button
                        onClick={() => setDeleteConfirmationOpen(true)}
                        color="error"
                    >
                        Удалить
                    </Button>
                ) : <div />}
                <Stack direction="row" spacing={1}>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {task ? "Сохранить" : "Создать"}
                    </Button>
                </Stack>
            </DialogActions>

            <Dialog
                open={deleteConfirmationOpen}
                onClose={() => setDeleteConfirmationOpen(false)}
            >
                <Box p={3}>
                    <Typography variant="h6" gutterBottom>
                        Удалить задачу?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Это действие нельзя отменить.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button onClick={() => setDeleteConfirmationOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                if (task) {
                                    onDelete?.(task.id);
                                }
                                setDeleteConfirmationOpen(false);
                            }}
                        >
                            Удалить
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </Dialog>
    );
};

export default TaskDialog;
