import { alpha, useTheme, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { find } from "lodash";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ChatNavIcon from "@/assets/icons/chat-nav-icon";
import HomeIcon from "@/assets/icons/home-icon";
import PracticeIcon from "@/assets/icons/practice-icon";
import VocabularyIcon from "@/assets/icons/vocabulary-icon";

const listPath = {
  vocabulary: "/dashboard/vocabulary",
  practice: "/dashboard/practice",
  letTalk: "/let-talk/",
  home: "/dashboard",
};
export default function NavigateMobile({ height }: { height: number }) {
  const theme = useTheme();
  const path = usePathname();
  const currentPath = find(listPath, (value, key) => path.includes(value));
  const [selectPath, setSelectPath] = useState<string>(currentPath || listPath.home);
  const router = useRouter();

  const homeValue = listPath.home;
  const vocabularyValue = listPath.vocabulary;
  const practiceValue = listPath.practice;
  const letTalkValue = listPath.letTalk;
  useEffect(() => {
    const pathNew = find(listPath, (value, key) => path.includes(value));
    setSelectPath(pathNew || listPath.home);
  }, [path]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };
  return (
    <BottomNavigation
      value={selectPath}
      onChange={handleChange}
      sx={{
        height,
        borderTop: "1px solid #919EAB80",
        "& .MuiBottomNavigationAction-label": {
          fontSize: 12, // normal
          fontWeight: "bold",
          color: "primary.main",
          transition: "all 0.3s ease",
          mt: 0.4,
        },
        "& .Mui-selected": {
          bgcolor: alpha(theme.palette.primary.main, 0.2),
          "&.MuiBottomNavigationAction-label ": {
            backgroundColor: "transparent",
          },
        },

        "& .Mui-selected .MuiBottomNavigationAction-label": {
          fontSize: 12, // larger when selected
        },
      }}
      showLabels
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        value={homeValue}
        sx={{
          px: 0,
          pb: 2.5,
          minWidth: 68,
          mx: 1.6,
        }}
      />
      <BottomNavigationAction
        label="Vocabulary"
        value={vocabularyValue}
        icon={<VocabularyIcon />}
        sx={{
          px: 0,
          pb: 2.5,
          minWidth: 68,
          mx: 1.6,
        }}
      />
      <BottomNavigationAction
        label="Practice"
        value={practiceValue}
        icon={<PracticeIcon />}
        sx={{
          px: 0,
          pb: 2.5,
          minWidth: 68,
          mx: 1.6,
        }}
      />
      <BottomNavigationAction
        label="Let's Talk"
        value={letTalkValue}
        icon={<ChatNavIcon />}
        sx={{
          px: 0,
          pb: 2.5,
          minWidth: 68,
          mx: 1.6,
        }}
      />
    </BottomNavigation>
  );
}
