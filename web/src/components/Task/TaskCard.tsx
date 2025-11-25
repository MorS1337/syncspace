import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import type { Task } from "@app-types/index";

type Props = {
  task: Task;
};

const statusLabels: Record<Task["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done"
};

const TaskCard = ({ task }: Props) => {
  return (
    <Card variant="outlined" sx={{ mb: 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">{task.title}</Typography>
          <Chip size="small" label={statusLabels[task.status]} />
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {task.description || "Нет описания"}
        </Typography>
        <Stack direction="row" spacing={1} mt={1}>
          {task.due_at && (
            <Chip
              size="small"
              color="warning"
              label={new Date(task.due_at).toLocaleDateString()}
            />
          )}
          <Chip size="small" label={`Priority: ${task.priority}`} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

