import { Box, Grid, Stack, AppBar, Button, Toolbar, useTheme, Typography } from "@mui/material";
import PlusIcon from "@/assets/icons/plus-icon";
import TimeLeftIcon from "@/assets/icons/time-left-icon";
import VocabularyIcon from "@/assets/icons/vocabulary-icon";
import { bgBlur } from "@/theme/css";
import HeaderShadow from "../common/header-shadow";

export default function HeaderLetTalk({ height }: { height: number }) {
  const theme = useTheme();

  return (
    <Box sx={{ height }}>
      <AppBar sx={{ height }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            height,
            width: "100%",
            mt: 3.7,
            px: 2.2,
            maxWidth: 425,
            mx: "auto",

            // margin: "auto",
            transition: theme.transitions.create(["height"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
            ...(height && {
              ...bgBlur({
                color: theme.palette.background.default,
              }),
            }),
          }}
        >
          <Grid container sx={{ margin: "auto" }}>
            <Grid item xs={6}>
              <Stack direction="row" spacing={1} alignItems="center">
                <VocabularyIcon />
                <Typography
                  color="primary.main"
                  fontWeight="bold"
                  sx={{ fontSize: 16, fontWeight: 700 }}
                >
                  Let&apos;s talk
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} sx={{ marginBlock: "auto" }}>
              <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="end">
                <Stack spacing={0.5} direction="row" alignItems="center">
                  <Typography sx={{ marginBlock: "auto", mt: 0.8, ml: 0.5 }}>
                    <TimeLeftIcon color={theme.palette.primary.main} />
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    endIcon={<PlusIcon color={theme.palette.primary.main} />}
                    sx={{ minWidth: 67 }}
                  >
                    <Typography fontWeight="bold">200</Typography>
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>

        {height && <HeaderShadow />}
      </AppBar>
    </Box>
  );
}
