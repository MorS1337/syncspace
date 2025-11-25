import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Space } from "@app-types/index";

type Props = {
  space: Space;
};

const SpaceCard = ({ space }: Props) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{space.title}</Typography>
          <Chip label={`Invite: ${space.invite_code}`} size="small" />
        </Stack>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {space.description || "Нет описания"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={RouterLink} to={`/space/${space.id}`} size="small">
          Открыть
        </Button>
      </CardActions>
    </Card>
  );
};

export default SpaceCard;

