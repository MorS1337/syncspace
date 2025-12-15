import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import AddIcon from "@mui/icons-material/Add";
import { useEffect } from "react";
import { queryClient } from "@utils/queryClient";
import type { Task, TaskStatus } from "@app-types/index";
import TaskCard from "./TaskCard";

type Column = {
  id: TaskStatus;
  title: string;
  color: string;
};

const columns: Column[] = [
  { id: "todo", title: "To Do", color: "#6b7280" },
  { id: "in_progress", title: "In Progress", color: "#3b82f6" },
  { id: "done", title: "Done", color: "#10b981" }
];

type Props = {
  tasks?: Task[];
  loading?: boolean;
  spaceId: number;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onCreate: () => void;
  onTaskClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

const KanbanBoard = ({ tasks, loading, spaceId, onStatusChange, onCreate, onTaskClick, onEdit, onDelete }: Props) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith("task_")) {
        queryClient.invalidateQueries({ queryKey: ["tasks", spaceId] });
      }
    };
    return () => ws.close();
  }, [spaceId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const taskId = Number(event.active.id);
    const dest = event.over?.id as TaskStatus | undefined;
    if (dest && taskId) {
      onStatusChange(taskId, dest);
    }
  };

  return (
    <Stack spacing={2} overflow="auto" pb={2} sx={{ px: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          Доска задач
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreate}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Новая задача
        </Button>
      </Stack>
      {loading ? (
        <Stack alignItems="center" minHeight={240} justifyContent="center">
          <CircularProgress />
        </Stack>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {columns.map((column) => {
              const columnTasks = (tasks || [])
                .filter((task) => task.status === column.id)
                .sort((a, b) => (b.priority || 0) - (a.priority || 0));
              return (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  isDark={isDark}
                  spaceId={spaceId}
                  onTaskClick={onTaskClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              );
            })}
          </Stack>
        </DndContext>
      )}
    </Stack>
  );
};

type ColumnProps = {
  column: Column;
  tasks: Task[];
  isDark: boolean;
  spaceId: number;
  onTaskClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

const DroppableColumn = ({ column, tasks, isDark, spaceId, onTaskClick, onEdit, onDelete }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <Box 
      ref={setNodeRef}
      flex={1}
      bgcolor={
        isOver
          ? isDark ? alpha(column.color, 0.15) : alpha(column.color, 0.08)
          : isDark ? alpha("#fff", 0.02) : "background.paper"
      }
      border={1}
      borderColor={
        isOver
          ? isDark ? alpha(column.color, 0.4) : alpha(column.color, 0.3)
          : "divider"
      }
      borderRadius={3}
      p={2}
      minHeight={360}
      sx={{
        transition: "all 0.2s",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: column.color,
          }}
        />
        <Typography variant="subtitle1" fontWeight={700} color="text.primary">
          {column.title}
        </Typography>
        <Box
          sx={{
            ml: "auto",
            px: 1,
            py: 0.25,
            borderRadius: 10,
            bgcolor: isDark ? alpha(column.color, 0.15) : alpha(column.color, 0.1),
            color: column.color,
            fontSize: "0.75rem",
            fontWeight: 600,
          }}
        >
          {tasks.length}
        </Box>
      </Stack>
      <SortableContext
        items={tasks.map((task) => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <Stack spacing={1.5}>
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              spaceId={spaceId}
              onClick={() => onTaskClick?.(task)}
              onEdit={() => onEdit?.(task)}
              onDelete={() => onDelete?.(task)}
            />
          ))}
        </Stack>
      </SortableContext>
      {tasks.length === 0 && (
        <Stack
          alignItems="center"
          justifyContent="center"
          py={6}
          sx={{
            border: 2,
            borderStyle: "dashed",
            borderColor: isDark ? alpha("#fff", 0.05) : alpha("#000", 0.05),
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" color="text.disabled">
            Нет задач
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

const SortableTask = ({ task, spaceId, onClick, onEdit, onDelete }: { task: Task; spaceId: number; onClick?: () => void; onEdit?: () => void; onDelete?: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(task.id)
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} spaceId={spaceId} onClick={onClick} onEdit={onEdit} onDelete={onDelete} />
    </Box>
  );
};

export default KanbanBoard;
