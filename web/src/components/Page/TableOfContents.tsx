import { Box, List, ListItemButton, ListItemText, Typography, useTheme, alpha } from "@mui/material";
import { useMemo } from "react";

type TOCItem = {
    level: number;
    text: string;
    id: string;
};

type Props = {
    content: string;
};

const TableOfContents = ({ content }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const tocItems = useMemo(() => {
        if (!content) return [];

        const lines = content.split("\n");
        const items: TOCItem[] = [];

        lines.forEach((line, index) => {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = `heading-${index}`;
                items.push({ level, text, id });
            }
        });

        return items;
    }, [content]);

    if (tocItems.length === 0) {
        return (
            <Box
                p={2}
                sx={{
                    bgcolor: isDark ? alpha("#fff", 0.02) : alpha("#000", 0.02),
                    borderRadius: 2,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Нет заголовков
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={700} mb={1} px={1}>
                Оглавление
            </Typography>
            <List dense disablePadding>
                {tocItems.map((item, index) => (
                    <ListItemButton
                        key={index}
                        onClick={() => {
                            const previewPanel = document.querySelector('.markdown-preview');
                            if (previewPanel) {
                                const headings = previewPanel.querySelectorAll('h1, h2, h3, h4, h5, h6');
                                const targetHeading = Array.from(headings).find(
                                    h => h.textContent?.trim() === item.text
                                );
                                if (targetHeading) {
                                    targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }
                        }}
                        sx={{
                            pl: (item.level - 1) * 2 + 1,
                            py: 0.5,
                            borderRadius: 1,
                            cursor: "pointer",
                            "&:hover": {
                                bgcolor: isDark ? alpha("#3b82f6", 0.1) : alpha("#3b82f6", 0.08),
                            },
                        }}
                    >
                        <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                variant: item.level === 1 ? "body2" : "caption",
                                fontWeight: item.level === 1 ? 600 : 400,
                                sx: {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                },
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};

export default TableOfContents;
