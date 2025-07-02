"use client";

import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

import { useOffSetTop } from "src/hooks/use-off-set-top";

import HeaderShadow from "src/layouts/common/header-shadow";
import { HEADER } from "src/layouts/config-layout";
import { bgBlur } from "src/theme/css";
import { usePathname } from "next/navigation";

import BackButton from "@/app/components/back-button";
import HeaderTitle from "@/app/components/header-title";
import { routes } from "@/routes";

// ----------------------------------------------------------------------

export default function HeaderSimple() {
  const pathname = usePathname();
  const pageTitle = pathname === routes.agent.url ? "Choose your buddy" : "Buddy profile";

  const theme = useTheme();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar sx={{ mt: 2.1, margin: "auto" }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-end",
          height: HEADER.H_MOBILE - 40,
          maxHeight: HEADER.H_MOBILE - 40,
          width: "100%",
          maxWidth: 425,
          margin: "auto",
          backgroundColor: "white",
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
          <HeaderTitle title={pageTitle} />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          {/* <SettingsButton /> */}

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
