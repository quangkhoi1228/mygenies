"use client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import { alpha, useTheme } from "@mui/material/styles";

import { bgGradient } from "src/theme/css";

import { IUserProfileCover } from "src/types/user";

// ----------------------------------------------------------------------

export default function ProfileCover({ name, avatarUrl, coverUrl }: IUserProfileCover) {
  const theme = useTheme();

  const { agentConfigList } = useSelector((state: RootState) => state.agentState);

  function getAvatarUrl(avatar: string) {
    console.log("agentConfigList", agentConfigList);
    const avatarConfig = agentConfigList?.find((config) => config.key === "avatar");
    const avatarOption = avatarConfig?.options?.find((option) => option.value === avatar);
    return avatarOption?.url;
  }
  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.8),
          imgUrl: coverUrl,
        }),
        height: 1,
        color: "common.white",
      }}
    >
      <Stack
        direction={{ xs: "column" }}
        sx={{
          pt: { xs: 6 },
        }}
      >
        <Avatar
          alt={name}
          src={getAvatarUrl(avatarUrl)}
          sx={{
            mx: "auto",
            width: { xs: 64 },
            height: { xs: 64 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        <ListItemText
          sx={{
            mt: 3,
            textAlign: { xs: "center" },
          }}
          primary={name}
          primaryTypographyProps={{
            typography: "h4",
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: "inherit",
            component: "span",
            typography: "body2",
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}
