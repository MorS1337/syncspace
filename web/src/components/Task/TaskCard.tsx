import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Box,
  IconButton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Task } from "@app-types/index";
import { useMembers } from "../../hooks/useMembers";
import { useTags } from "../../hooks/useTags";

type Props = {
  task: Task;
  spaceId: number;
};

const statusLabels: Record<Task["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done"
};

const getPriorityColor = (priority: number): "error" | "warning" | "info" | "default" => {
  if (priority >= 7) return "error";  // High: red
  if (priority >= 4) return "warning"; // Medium: orange
  if (priority >= 1) return "info";    // Low: blue
  return "default";                     // None: grey
};

const getPriorityLabel = (priority: number): string => {
  if (priority >= 7) return "High";
  if (priority >= 4) return "Medium";
  if (priority >= 1) return "Low";
  return "None";
};

const TaskCard = ({ task, spaceId, onClick, onEdit, onDelete }: Props & { onClick?: () => void; onEdit?: () => void; onDelete?: () => void }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: members } = useMembers(spaceId);
  const { tagsQuery } = useTags(spaceId);

  const assignee = members?.find((m: any) => m.user_id === task.assignee_id);
  const taskTags = (tagsQuery.data || []).filter(tag => task.tag_ids?.includes(tag.id));

  return (
    <Card
      variant="outlined"
      onClick={onClick}
      sx={{
        mb: 1,
        borderColor: "divider",
        bgcolor: isDark ? alpha("#fff", 0.02) : "background.paper",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s",
        position: "relative",
        "&:hover": onClick ? {
          borderColor: isDark ? alpha("#3b82f6", 0.5) : alpha("#3b82f6", 0.4),
          bgcolor: isDark ? alpha("#3b82f6", 0.05) : alpha("#3b82f6", 0.02),
          transform: "translateY(-2px)",
          boxShadow: 2,
          "& .task-actions": {
            opacity: 1,
          }
        } : {},
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1, wordBreak: "break-word" }}>
              {task.title}
            </Typography>
            <Stack direction="row" spacing={0.5} className="task-actions" sx={{ opacity: 0, transition: "opacity 0.2s" }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                sx={{
                  p: 0.5,
                  color: "text.secondary",
                  "&:hover": { color: "primary.main", bgcolor: alpha("#3b82f6", 0.1) }
                }}
              >
                <EditOutlinedIcon fontSize="small" sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                sx={{
                  p: 0.5,
                  color: "text.secondary",
                  "&:hover": { color: "error.main", bgcolor: alpha("#ef4444", 0.1) }
                }}
              >
                <DeleteOutlineIcon fontSize="small" sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip size="small" label={statusLabels[task.status]} variant="outlined" sx={{ height: 20, fontSize: "0.75rem" }} />
          </Stack>

          {task.description && (
            <Typography variant="body2" color="text.secondary" sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {task.description}
            </Typography>
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {task.due_at && (
              <Chip
                size="small"
                color={new Date(task.due_at) < new Date() && task.status !== "done" ? "error" : "default"}
                label={new Date(task.due_at).toLocaleDateString()}
                sx={{ height: 24 }}
              />
            )}
            <Chip
              size="small"
              color={getPriorityColor(task.priority)}
              label={getPriorityLabel(task.priority)}
              sx={{ height: 24 }}
            />

            {/* Tags */}
            {taskTags.map(tag => (
              <Chip
                key={tag.id}
                size="small"
                label={tag.name}
                sx={{
                  height: 24,
                  bgcolor: tag.color,
                  color: "#fff",
                  "& .MuiChip-label": { px: 1.5 }
                }}
              />
            ))}

            {/* Assignee */}
            <Box sx={{ ml: "auto !important" }}>
              {assignee ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    src={assignee.avatar_url || undefined}
                    sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                  >
                    {assignee.name[0].toUpperCase()}
                  </Avatar>
                </Stack>
              ) : task.assignee_id === undefined ? (
                null
              ) : null}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;

