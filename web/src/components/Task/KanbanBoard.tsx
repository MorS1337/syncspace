import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, DragEndEvent, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@app-types/index";
import TaskCard from "./TaskCard";

type Column = {
  id: TaskStatus;
  title: string;
};

const columns: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" }
];

type Props = {
  tasks?: Task[];
  loading?: boolean;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onCreate: () => void;
};

const KanbanBoard = ({ tasks, loading, onStatusChange, onCreate }: Props) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const taskId = Number(event.active.id);
    const dest = event.over?.id as TaskStatus | undefined;
    if (dest && taskId) {
      onStatusChange(taskId, dest);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Задачи</Typography>
        <Button variant="contained" onClick={onCreate}>
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
              const columnTasks = (tasks || []).filter((task) => task.status === column.id);
              return (
                <DroppableColumn key={column.id} column={column} tasks={columnTasks} />
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
};

const DroppableColumn = ({ column, tasks }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <Box
      ref={setNodeRef}
      flex={1}
      bgcolor={isOver ? "action.hover" : "#fdfdfd"}
      borderRadius={2}
      p={2}
      minHeight={300}
    >
      <Typography variant="subtitle1" mb={2}>
        {column.title}
      </Typography>
      <SortableContext
        items={tasks.map((task) => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <SortableTask key={task.id} task={task} />
        ))}
      </SortableContext>
    </Box>
  );
};

const SortableTask = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: String(task.id)
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </Box>
  );
};

export default KanbanBoard;

