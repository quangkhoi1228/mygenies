"use client";

import BackButton from "@/app/components/back-button";
import SettingsButton from "@/app/components/settings-button";

import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

import { useOffSetTop } from "src/hooks/use-off-set-top";

import { bgBlur } from "src/theme/css";
import { HEADER } from "src/layouts/config-layout";
import HeaderShadow from "src/layouts/common/header-shadow";

import AiVoiceSelect from "./ai-voice-select";

// ----------------------------------------------------------------------

export default function HeaderSimple() {
  const theme = useTheme();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar sx={{ mt: 2.1, margin: "auto" }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          width: "100%",
          maxWidth: 425,
          margin: "auto",
          transition: theme.transitions.create(["height"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        {/* <Logo /> */}
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <BackButton />
          <AiVoiceSelect />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <SettingsButton />
          {/* <SettingsButton /> */}

          {/* <Link
            href={paths.faqs}
            component={RouterLink}
            color="inherit"
            sx={{ typography: 'subtitle2' }}
          >
            Need help?
          </Link> */}
        </Stack>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
