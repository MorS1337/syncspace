import { Box, Card, CardContent, Grid, Stack, Typography, useTheme, alpha, LinearProgress } from "@mui/material";
import { useTasks } from "@hooks/useTasks";
import { usePages } from "@hooks/usePages";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

type Props = {
    spaceId: number;
};

const SpaceDashboard = ({ spaceId }: Props) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { tasksQuery } = useTasks(spaceId);
    const { pagesQuery } = usePages(spaceId);

    const tasks = tasksQuery.data || [];
    const pages = pagesQuery.data || [];

    const todoCount = tasks.filter(t => t.status === "todo").length;
    const inProgressCount = tasks.filter(t => t.status === "in_progress").length;
    const doneCount = tasks.filter(t => t.status === "done").length;
    const totalTasks = tasks.length;

    const completionRate = totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0;

    const stats = [
        {
            title: "Всего задач",
            value: totalTasks,
            icon: <TaskAltIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
            color: theme.palette.primary.main,
        },
        {
            title: "Заметок",
            value: pages.length,
            icon: <DescriptionIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />,
            color: theme.palette.info.main,
        },
        {
            title: "Завершено",
            value: `${Math.round(completionRate)}%`,
            icon: <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
            color: theme.palette.success.main,
        },
    ];

    return (
        <Box py={3}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
                Обзор пространства
            </Typography>

            <Grid container spacing={3} mt={1}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card
                            sx={{
                                height: "100%",
                                bgcolor: isDark ? alpha("#fff", 0.02) : "background.paper",
                                border: 1,
                                borderColor: "divider",
                            }}
                        >
                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h3" fontWeight={700} color={stat.color}>
                                            {stat.value}
                                        </Typography>
                                        {stat.icon}
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                        {stat.title}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card sx={{ mt: 3, bgcolor: isDark ? alpha("#fff", 0.02) : "background.paper" }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Статус задач
                    </Typography>
                    <Stack spacing={3} mt={2}>
                        <Box>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">To Do</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {todoCount} / {totalTasks}
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={totalTasks > 0 ? (todoCount / totalTasks) * 100 : 0}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                        <Box>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">In Progress</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {inProgressCount} / {totalTasks}
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={totalTasks > 0 ? (inProgressCount / totalTasks) * 100 : 0}
                                color="warning"
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                        <Box>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">Done</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {doneCount} / {totalTasks}
                                </Typography>
                            </Stack>
                            <LinearProgress
                                variant="determinate"
                                value={totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0}
                                color="success"
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SpaceDashboard;
