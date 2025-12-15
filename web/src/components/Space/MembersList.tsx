import {
    Box,
    Avatar,
    Typography,
    Stack,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    alpha,
    useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { queryClient } from "@utils/queryClient";
import { useMembers, useRemoveMember, useUpdateMemberRole, SpaceMember } from "../../hooks/useMembers";

interface Props {
    spaceId: number;
    currentUserId: number;
}

export function MembersList({ spaceId, currentUserId }: Props) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { data: members, isLoading } = useMembers(spaceId);
    const removeMember = useRemoveMember(spaceId);
    const updateRole = useUpdateMemberRole(spaceId);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws");
        ws.onmessage = (event) => {
            const message = event.data;
            if (message.startsWith("member_")) {
                queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "members"] });
            }
        };
        return () => ws.close();
    }, [spaceId]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMember, setSelectedMember] = useState<SpaceMember | null>(null);

    const currentMember = members?.find((m) => m.user_id === currentUserId);
    const isOrganizer = currentMember?.role === "organizer";

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: SpaceMember) => {
        setAnchorEl(event.currentTarget);
        setSelectedMember(member);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedMember(null);
    };

    const handleRemove = () => {
        if (selectedMember) {
            removeMember.mutate(selectedMember.user_id);
        }
        handleMenuClose();
    };

    const handleChangeRole = (newRole: string) => {
        if (selectedMember) {
            updateRole.mutate({ userId: selectedMember.user_id, role: newRole });
        }
        handleMenuClose();
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "organizer":
                return "#3b82f6";
            case "mentor":
                return "#10b981";
            default:
                return "#6b7280";
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "organizer":
                return "Организатор";
            case "mentor":
                return "Ментор";
            default:
                return "Участник";
        }
    };

    if (isLoading) {
        return (
            <Stack alignItems="center" py={4}>
                <CircularProgress size={32} />
            </Stack>
        );
    }

    return (
        <Box sx={{ px: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
                Участники ({members?.length || 0})
            </Typography>
            <Stack spacing={1.5}>
                {members?.map((member) => (
                    <Box
                        key={member.user_id}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            bgcolor: isDark ? alpha("#fff", 0.02) : "background.paper",
                            transition: "all 0.2s",
                            "&:hover": {
                                borderColor: isDark ? alpha("#3b82f6", 0.3) : alpha("#3b82f6", 0.2),
                            },
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                src={member.avatar_url || undefined}
                                alt={member.name}
                                sx={{ width: 40, height: 40 }}
                            >
                                {member.name[0].toUpperCase()}
                            </Avatar>
                            <Box flex={1}>
                                <Typography variant="body1" fontWeight={600}>
                                    {member.name}
                                    {member.user_id === currentUserId && (
                                        <Typography component="span" variant="body2" color="text.secondary" ml={1}>
                                            (вы)
                                        </Typography>
                                    )}
                                </Typography>
                                {member.email && (
                                    <Typography variant="caption" color="text.secondary">
                                        {member.email}
                                    </Typography>
                                )}
                            </Box>
                            <Chip
                                label={getRoleLabel(member.role)}
                                size="small"
                                sx={{
                                    bgcolor: isDark ? alpha(getRoleColor(member.role), 0.15) : alpha(getRoleColor(member.role), 0.1),
                                    color: getRoleColor(member.role),
                                    fontWeight: 600,
                                }}
                            />
                            {isOrganizer && member.user_id !== currentUserId && (
                                <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, member)}
                                    sx={{
                                        "&:hover": {
                                            bgcolor: isDark ? alpha("#fff", 0.05) : alpha("#000", 0.04),
                                        },
                                    }}
                                >
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Stack>
                    </Box>
                ))}
            </Stack>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleChangeRole("member")}>Сделать участником</MenuItem>
                <MenuItem onClick={() => handleChangeRole("organizer")}>Сделать организатором</MenuItem>
                <MenuItem onClick={() => handleChangeRole("mentor")}>Сделать ментором</MenuItem>
                <MenuItem onClick={handleRemove} sx={{ color: "error.main" }}>
                    Удалить из space
                </MenuItem>
            </Menu>
        </Box>
    );
}
