import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import type { Page } from "@app-types/index";

type Props = {
  pages: Page[] | undefined;
  loading: boolean;
  activePageId?: number;
  onSelect: (pageId: number) => void;
  onCreate: () => void;
  onRefresh: () => void;
};

const PageList = ({ pages, loading, activePageId, onSelect, onCreate, onRefresh }: Props) => {
  return (
    <Box width={280} borderRight="1px solid #e0e0e0" pr={1} bgcolor="#fff" minHeight="100%">
      <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
        <Typography variant="subtitle1">Заметки</Typography>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={onRefresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onCreate}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      {loading && (
        <Stack alignItems="center" mt={2}>
          <CircularProgress size={24} />
        </Stack>
      )}
      <List dense disablePadding>
        {pages?.map((page) => (
          <ListItem
            key={page.id}
            disablePadding
            sx={{
              bgcolor: activePageId === page.id ? "action.selected" : undefined
            }}
          >
            <Button
              fullWidth
              onClick={() => onSelect(page.id)}
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              <ListItemText
                primary={page.title}
                primaryTypographyProps={{ noWrap: true }}
              />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default PageList;

