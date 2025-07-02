import PlusIcon from "@/assets/icons/plus-icon";
import SettingIcon from "@/assets/icons/SettingIcon";
import TimeLeftIcon from "@/assets/icons/time-left-icon";
import { bgBlur } from "@/theme/css";
import { UserButton } from "@clerk/nextjs";

import {
  Box,
  Grid,
  Stack,
  AppBar,
  Button,
  Toolbar,
  useTheme,
  IconButton,
  Typography,
} from "@mui/material";
import HeaderShadow from "../common/header-shadow";

export default function HeaderDashboard({ height }: { height: number }) {
  const theme = useTheme();

  return (
    <Box sx={{ height }}>
      <AppBar sx={{ height }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            height,
            borderBottom: "1px solid #919EAB80",
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
          <Grid container>
            <Grid item xs={2}>
              <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                {/* <IconButton
                  sx={{
                    p: 0,
                    border: "2px solid #919EAB14",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                  }}
                >
                  <UserIcon height={36} width={36} />
                </IconButton> */}
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        border: "2px solid transparent",
                        outline: "2px solid  #919EAB14",
                      },
                      avatarBox: {
                        width: "36px",
                        height: "36px",
                      },
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={10} sx={{ marginBlock: "auto" }}>
              <Stack direction="row" spacing={0.8} alignItems="center" justifyContent="end">
                <Stack spacing={0.5} direction="row" alignItems="center">
                  <Typography sx={{ marginBlock: "auto", mt: 0.8 }}>
                    <TimeLeftIcon />
                  </Typography>
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    endIcon={<PlusIcon />}
                    sx={{ minWidth: 67 }}
                  >
                    <Typography fontWeight="bold">200</Typography>
                  </Button>
                </Stack>
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
                <Button variant="text" color="primary" size="small" sx={{ minWidth: 24 }}>
                  <Typography fontWeight="bold">Shop</Typography>
                </Button>
                <IconButton sx={{ p: 0 }}>
                  <SettingIcon height={24} width={24} />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>

        {height && <HeaderShadow />}
      </AppBar>
    </Box>
  );
}
