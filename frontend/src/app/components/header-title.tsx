import { Typography } from "@mui/material";

function HeaderTitle({ title }: { title: string }) {
  return (
    <Typography color="primary.main" variant="h6">
      {title}
    </Typography>
  );
}

export default HeaderTitle;
