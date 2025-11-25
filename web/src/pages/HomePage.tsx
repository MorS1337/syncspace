import { Alert, Button, Skeleton, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SpaceCard from "@components/Space/SpaceCard";
import { CreateSpaceDialog, JoinSpaceDialog } from "@components/Space/SpaceDialogs";
import { useState } from "react";
import { useSpaces } from "@hooks/useSpaces";

const HomePage = () => {
  const { spacesQuery, createSpace, createPending, joinSpace, joinPending } = useSpaces();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between">
        <Stack spacing={1}>
          <Typography variant="h4">Spaces</Typography>
          <Typography color="text.secondary">
            Создайте новое пространство или присоединяйтесь по коду.
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Создать Space
          </Button>
          <Button variant="outlined" onClick={() => setJoinOpen(true)}>
            Присоединиться
          </Button>
        </Stack>
      </Stack>

      {spacesQuery.isError && <Alert severity="error">{spacesQuery.error.message}</Alert>}

      <Grid container spacing={2}>
        {spacesQuery.isLoading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 4 }}>
              <Skeleton variant="rectangular" height={160} />
            </Grid>
          ))}
        {spacesQuery.data?.map((space) => (
          <Grid key={space.id} size={{ xs: 12, md: 4 }}>
            <SpaceCard space={space} />
          </Grid>
        ))}
      </Grid>

      <CreateSpaceDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={createSpace}
        loading={createPending}
      />
      <JoinSpaceDialog
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onSubmit={joinSpace}
        loading={joinPending}
      />
    </Stack>
  );
};

export default HomePage;

