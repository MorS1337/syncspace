import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import PageList from "@components/Page/PageList";
import MarkdownEditor from "@components/Page/MarkdownEditor";
import TableOfContents from "@components/Page/TableOfContents";
import KanbanBoard from "@components/Task/KanbanBoard";
import TaskDialog from "@components/Task/TaskDialog";
import { MembersList } from "@components/Space/MembersList";
import SpaceDashboard from "@components/Space/SpaceDashboard";
import { usePages } from "@hooks/usePages";
import { useTasks } from "@hooks/useTasks";
import { useMembers } from "@hooks/useMembers";
import { useQuery } from "@tanstack/react-query";
import { getSpace } from "@api/spaces";
import { useAuth } from "@utils/auth";
import type { TaskStatus, Task } from "@app-types/index";
import { PAGE_TEMPLATES, type TemplateKey } from "@constants/pageTemplates";

const SpacePage = () => {
  const { spaceId } = useParams();
  const { user } = useAuth();
  const [tab, setTab] = useState<"pages" | "tasks" | "members" | "dashboard">("dashboard");
  const [activePageId, setActivePageId] = useState<number | undefined>(undefined);
  const [taskDialog, setTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);
  const [pageDialog, setPageDialog] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [pageTemplate, setPageTemplate] = useState<TemplateKey>("blank");
  const [draft, setDraft] = useState("");

  const [filterAssignee, setFilterAssignee] = useState<number | "all">("all");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");

  const numericSpaceId = Number(spaceId);

  const spaceQuery = useQuery({
    queryKey: ["space", numericSpaceId],
    queryFn: () => getSpace(numericSpaceId),
    enabled: Number.isFinite(numericSpaceId)
  });

  const { pagesQuery, pageQuery, createPage, updatePage, deletePage, saving } = usePages(
    numericSpaceId,
    activePageId
  );
  const { tasksQuery, updateTask, createTask, deleteTask } = useTasks(numericSpaceId);
  const { data: spaceMembers } = useMembers(numericSpaceId);

  const currentPageTitle = pageQuery.data?.title;

  useEffect(() => {
    if (pageQuery.data) {
      setDraft(pageQuery.data.md_content);
    } else {
      setDraft("");
    }
  }, [pageQuery.data?.id, pageQuery.data?.md_content]);

  useEffect(() => {
    if (!activePageId && pagesQuery.data?.length) {
      setActivePageId(pagesQuery.data[0].id);
    }
  }, [activePageId, pagesQuery.data]);

  const handleCreatePage = async () => {
    if (!pageTitle.trim()) return;

    const template = PAGE_TEMPLATES[pageTemplate];
    const page = await createPage(pageTitle.trim());

    if (template.content) {
      await updatePage({ md_content: template.content });
      setDraft(template.content);
    }

    setActivePageId(page.id);
    setPageDialog(false);
    setPageTitle("");
    setPageTemplate("blank");
  };

  const handleDeletePage = async (id: number) => {
    await deletePage(id);
    if (activePageId === id) {
      setActivePageId(undefined);
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    await updateTask({ taskId, data: { status } });
  };

  const filteredTasks = tasksQuery.data?.filter(task => {
    if (filterAssignee !== "all" && task.assignee_id !== filterAssignee) return false;
    if (filterPriority === "high" && task.priority < 7) return false;
    if (filterPriority === "medium" && (task.priority < 4 || task.priority >= 7)) return false;
    if (filterPriority === "low" && (task.priority >= 4 || task.priority === 0)) return false;
    return true;
  });

  if (!Number.isFinite(numericSpaceId)) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Stack spacing={3}>
      {spaceQuery.isLoading ? (
        <Skeleton variant="rectangular" height={120} />
      ) : spaceQuery.isError ? (
        <Alert severity="error">{spaceQuery.error.message}</Alert>
      ) : (
        <Stack spacing={1} sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{spaceQuery.data?.title}</Typography>
            <Chip label={`Код приглашения: ${spaceQuery.data?.invite_code}`} />
          </Stack>
          <Typography color="text.secondary">
            {spaceQuery.data?.description || "Нет описания"}
          </Typography>
        </Stack>
      )}

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Обзор" value="dashboard" />
        <Tab label="Заметки" value="pages" />
        <Tab label="Задачи" value="tasks" />
        <Tab label="Участники" value="members" />
      </Tabs>

      {tab === "dashboard" && <SpaceDashboard spaceId={numericSpaceId} />}

      {
        tab === "pages" && (
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} height="70vh">
            <PageList
              pages={pagesQuery.data}
              loading={pagesQuery.isLoading}
              activePageId={activePageId}
              spaceId={Number(spaceId)}
              onSelect={(id) => setActivePageId(id)}
              onCreate={() => setPageDialog(true)}
              onRefresh={() => pagesQuery.refetch()}
              onDelete={handleDeletePage}
            />
            <MarkdownEditor
              title={currentPageTitle}
              content={draft}
              loading={pageQuery.isLoading && !!activePageId}
              saving={saving}
              onChange={setDraft}
              onSave={() => updatePage({ md_content: draft })}
            />
            <Box
              width={250}
              sx={{
                display: { xs: "none", lg: "block" },
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <TableOfContents content={draft} />
            </Box>
          </Stack>
        )
      }

      {
        tab === "tasks" && (
          <>
            {tasksQuery.isError && <Alert severity="error">{tasksQuery.error.message}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2} sx={{ px: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Исполнитель</InputLabel>
                <Select
                  value={filterAssignee}
                  label="Исполнитель"
                  onChange={(e) => setFilterAssignee(e.target.value as number | "all")}
                  size="small"
                >
                  <MenuItem value="all">Все</MenuItem>
                  {spaceMembers?.map((member: any) => (
                    <MenuItem key={member.user_id} value={member.user_id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Приоритет</InputLabel>
                <Select
                  value={filterPriority}
                  label="Приоритет"
                  onChange={(e) => setFilterPriority(e.target.value as "all" | "high" | "medium" | "low")}
                  size="small"
                >
                  <MenuItem value="all">Все</MenuItem>
                  <MenuItem value="high">High (7-9)</MenuItem>
                  <MenuItem value="medium">Medium (4-6)</MenuItem>
                  <MenuItem value="low">Low (1-3)</MenuItem>
                </Select>
              </FormControl>

              {(filterAssignee !== "all" || filterPriority !== "all") && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setFilterAssignee("all");
                    setFilterPriority("all");
                  }}
                  sx={{ height: 40 }}
                >
                  Сбросить фильтры
                </Button>
              )}
            </Stack>

            <KanbanBoard
              tasks={filteredTasks}
              loading={tasksQuery.isLoading}
              spaceId={numericSpaceId}
              onStatusChange={handleStatusChange}
              onCreate={() => {
                setEditingTask(undefined);
                setTaskDialog(true);
              }}
              onTaskClick={(task) => {
                setEditingTask(task);
                setTaskDialog(true);
              }}
              onEdit={(task) => {
                setEditingTask(task);
                setTaskDialog(true);
              }}
              onDelete={(task) => {
                setTaskToDelete(task);
                setDeleteTaskDialogOpen(true);
              }}
            />
            <TaskDialog
              open={taskDialog}
              spaceId={numericSpaceId}
              task={editingTask}
              onClose={() => {
                setTaskDialog(false);
                setEditingTask(undefined);
              }}
              onDelete={(id) => {
                setTaskDialog(false);
                const task = tasksQuery.data?.find(t => t.id === id);
                if (task) {
                  setTaskToDelete(task);
                  setDeleteTaskDialogOpen(true);
                }
              }}
              onSubmit={async (payload) => {
                if (editingTask) {
                  await updateTask({ taskId: editingTask.id, data: payload });
                } else {
                  await createTask(payload);
                }
                setTaskDialog(false);
                setEditingTask(undefined);
              }}
            />

            <Dialog
              open={deleteTaskDialogOpen}
              onClose={() => setDeleteTaskDialogOpen(false)}
            >
              <Box p={3}>
                <Typography variant="h6" gutterBottom>
                  Удалить задачу?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Вы действительно хотите удалить задачу "{taskToDelete?.title}"? Это действие нельзя отменить.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button onClick={() => setDeleteTaskDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={async () => {
                      if (taskToDelete) {
                        await deleteTask(taskToDelete.id);
                      }
                      setDeleteTaskDialogOpen(false);
                      setTaskToDelete(null);
                    }}
                  >
                    Удалить
                  </Button>
                </Stack>
              </Box>
            </Dialog>
          </>
        )
      }

      {
        tab === "members" && user && (
          <Box py={2}>
            <MembersList spaceId={numericSpaceId} currentUserId={user.id} />
          </Box>
        )
      }

      <Dialog open={pageDialog} onClose={() => setPageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать новую заметку</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Название заметки"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePage()}
            />
            <FormControl fullWidth>
              <InputLabel>Шаблон</InputLabel>
              <Select
                value={pageTemplate}
                label="Шаблон"
                onChange={(e) => setPageTemplate(e.target.value as TemplateKey)}
              >
                <MenuItem value="blank">Пустая страница</MenuItem>
                <MenuItem value="meeting">Заметки встречи</MenuItem>
                <MenuItem value="sprint">Планирование спринта</MenuItem>
                <MenuItem value="requirements">Требования</MenuItem>
                <MenuItem value="standup">Daily Standup</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPageDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreatePage}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Stack >
  );
};

export default SpacePage;
