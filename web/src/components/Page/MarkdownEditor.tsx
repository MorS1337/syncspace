import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import type { ComponentPropsWithoutRef } from "react";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight, materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

type Props = {
  title?: string;
  content?: string;
  loading?: boolean;
  saving?: boolean;
  onChange: (value: string) => void;
  onSave: () => Promise<unknown>;
};

type CodeProps = ComponentPropsWithoutRef<"code"> & { inline?: boolean };

const MarkdownEditor = ({
  title,
  content = "",
  loading,
  saving,
  onChange,
  onSave
}: Props) => {
  const theme = useTheme();

  const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(className || "");
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={theme.palette.mode === "dark" ? materialDark : materialLight}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const markdownComponents: Components = { code: CodeBlock };

  const handleSave = async () => {
    await onSave();
  };

  if (loading) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  }

  if (!title) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <Typography color="text.secondary">Выберите страницу</Typography>
      </Stack>
    );
  }

  return (
    <Stack flex={1} height="100%">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h5">{title}</Typography>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Сохраняем..." : "Сохранить"}
        </Button>
      </Stack>
      <Box flex={1} height="calc(100% - 60px)">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <Box height="100%" pr={1}>
              <TextField
                label="Markdown"
                multiline
                fullWidth
                value={content}
                onChange={(event) => onChange(event.target.value)}
                sx={{
                  height: "100%",
                  "& .MuiInputBase-root": {
                    height: "100%",
                    alignItems: "flex-start",
                    overflow: "auto"
                  }
                }}
              />
            </Box>
          </Panel>
          <PanelResizeHandle style={{ width: "8px", cursor: "col-resize", background: "#e0e0e0" }} />
          <Panel defaultSize={50} minSize={30}>
            <Box
              className="markdown-preview"
              height="100%"
              bgcolor={theme.palette.mode === "dark" ? "grey.900" : "#fff"}
              border="1px solid"
              borderColor="divider"
              borderRadius={1}
              p={2}
              ml={1}
              sx={{
                overflowY: "auto",
                color: theme.palette.mode === "dark" ? "grey.100" : "inherit",
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  color: theme.palette.mode === "dark" ? "grey.50" : "inherit",
                },
                "& code": {
                  bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.100",
                  color: theme.palette.mode === "dark" ? "grey.100" : "inherit",
                  px: 0.5,
                  borderRadius: 0.5,
                },
                "& a": {
                  color: theme.palette.primary.main,
                }
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content || "Ничего нет..."}
              </ReactMarkdown>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>
    </Stack>
  );
};

export default MarkdownEditor;

