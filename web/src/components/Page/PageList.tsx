import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { Page } from "@app-types/index";

type Props = {
  pages: Page[] | undefined;
  loading: boolean;
  activePageId?: number;
  onSelect: (pageId: number) => void;
  onCreate: () => void;
  onRefresh: () => void;
  onDelete?: (pageId: number) => void;
};

const PageList = ({ pages, loading, activePageId, onSelect, onCreate, onRefresh, onDelete }: Props) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);

  const handleDeleteClick = (pageId: number) => {
    setPageToDelete(pageId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pageToDelete !== null) {
      onDelete?.(pageToDelete);
    }
    setDeleteConfirmationOpen(false);
    setPageToDelete(null);
  };

  return (
    <Box
      width={280}
      borderRight={1}
      borderColor="divider"
      bgcolor={isDark ? "background.paper" : "background.default"}
      minHeight="100%"
      sx={{
        transition: "all 0.2s",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
      >
        <Typography variant="h6" fontWeight={700}>
          Заметки
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={onRefresh}
            sx={{
              "&:hover": {
                bgcolor: isDark ? alpha("#3b82f6", 0.1) : alpha("#3b82f6", 0.08),
              }
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onCreate}
            sx={{
              color: "#3b82f6",
              "&:hover": {
                bgcolor: isDark ? alpha("#3b82f6", 0.15) : alpha("#3b82f6", 0.1),
              }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {loading && (
        <Stack alignItems="center" mt={4}>
          <CircularProgress size={24} />
        </Stack>
      )}
      <List dense disablePadding sx={{ px: 1, py: 1 }}>
        {pages?.map((page) => {
          const isActive = activePageId === page.id;
          return (
            <ListItem
              key={page.id}
              disablePadding
              sx={{ mb: 0.5 }}
              secondaryAction={
                isActive && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(page.id);
                    }}
                    sx={{
                      color: isDark ? "grey.500" : "grey.400",
                      "&:hover": { color: "error.main" }
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <Button
                fullWidth
                onClick={() => onSelect(page.id)}
                startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 18 }} />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  pr: 5, // space for delete button
                  color: isActive ? "#3b82f6" : "text.primary",
                  bgcolor: isActive
                    ? isDark ? alpha("#3b82f6", 0.12) : alpha("#3b82f6", 0.08)
                    : "transparent",
                  fontWeight: isActive ? 600 : 400,
                  border: isActive ? 1 : "none",
                  borderColor: isActive ? (isDark ? alpha("#3b82f6", 0.3) : alpha("#3b82f6", 0.2)) : "transparent",
                  "&:hover": {
                    bgcolor: isActive
                      ? isDark ? alpha("#3b82f6", 0.15) : alpha("#3b82f6", 0.12)
                      : isDark ? alpha("#fff", 0.05) : alpha("#000", 0.04),
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemText
                  primary={page.title}
                  primaryTypographyProps={{
                    noWrap: true,
                    fontSize: "0.9rem",
                  }}
                />
              </Button>
            </ListItem>
          );
        })}
      </List>
      {!loading && (!pages || pages.length === 0) && (
        <Stack alignItems="center" justifyContent="center" py={6} px={2}>
          <DescriptionOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            Нет заметок
          </Typography>
          <Typography variant="caption" color="text.disabled" align="center">
            Создайте первую заметку
          </Typography>
        </Stack>
      )}

      <Dialog
        open={deleteConfirmationOpen}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Удалить заметку?
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
              onClick={handleConfirmDelete}
            >
              Удалить
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
};

export default PageList;

