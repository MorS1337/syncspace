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
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import PageList from "@components/Page/PageList";
import MarkdownEditor from "@components/Page/MarkdownEditor";
import KanbanBoard from "@components/Task/KanbanBoard";
import CreateTaskDialog from "@components/Task/CreateTaskDialog";
import { usePages } from "@hooks/usePages";
import { useTasks } from "@hooks/useTasks";
import { useQuery } from "@tanstack/react-query";
import { getSpace } from "@api/spaces";
import type { TaskStatus } from "@app-types/index";

const SpacePage = () => {
  const { spaceId } = useParams();
  const [tab, setTab] = useState<"pages" | "tasks">("pages");
  const [activePageId, setActivePageId] = useState<number | undefined>(undefined);
  const [taskDialog, setTaskDialog] = useState(false);
  const [pageDialog, setPageDialog] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [draft, setDraft] = useState("");

  const numericSpaceId = Number(spaceId);

  const spaceQuery = useQuery({
    queryKey: ["space", numericSpaceId],
    queryFn: () => getSpace(numericSpaceId),
    enabled: Number.isFinite(numericSpaceId)
  });

  const { pagesQuery, pageQuery, createPage, updatePage, saving } = usePages(
    numericSpaceId,
    activePageId
  );
  const { tasksQuery, updateTask, createTask } = useTasks(numericSpaceId);

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
    const page = await createPage(pageTitle.trim());
    setActivePageId(page.id);
    setPageDialog(false);
    setPageTitle("");
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    await updateTask({ taskId, data: { status } });
  };

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
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{spaceQuery.data?.title}</Typography>
            <Chip label={`Invite: ${spaceQuery.data?.invite_code}`} />
          </Stack>
          <Typography color="text.secondary">
            {spaceQuery.data?.description || "Нет описания"}
          </Typography>
        </Stack>
      )}

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ borderBottom: "1px solid #e0e0e0" }}
      >
        <Tab label="Заметки" value="pages" />
        <Tab label="Задачи" value="tasks" />
      </Tabs>

      {tab === "pages" && (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} height="70vh">
          <PageList
            pages={pagesQuery.data}
            loading={pagesQuery.isLoading}
            activePageId={activePageId}
            onSelect={(id) => setActivePageId(id)}
            onCreate={() => setPageDialog(true)}
            onRefresh={() => pagesQuery.refetch()}
          />
          <MarkdownEditor
            title={currentPageTitle}
            content={draft}
            loading={pageQuery.isLoading && !!activePageId}
            saving={saving}
            onChange={setDraft}
            onSave={() => updatePage({ md_content: draft })}
          />
        </Stack>
      )}

      {tab === "tasks" && (
        <>
          {tasksQuery.isError && <Alert severity="error">{tasksQuery.error.message}</Alert>}
          <KanbanBoard
            tasks={tasksQuery.data}
            loading={tasksQuery.isLoading}
            onStatusChange={handleStatusChange}
            onCreate={() => setTaskDialog(true)}
          />
          <CreateTaskDialog
            open={taskDialog}
            onClose={() => setTaskDialog(false)}
            onSubmit={async (payload) => {
              await createTask(payload);
              setTaskDialog(false);
            }}
          />
        </>
      )}

      <Dialog open={pageDialog} onClose={() => setPageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать новую заметку</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label="Название заметки"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreatePage()}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPageDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreatePage}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default SpacePage;

