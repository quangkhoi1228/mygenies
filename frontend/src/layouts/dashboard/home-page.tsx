"use client";

import {
  Box,
  Stack,
  Theme,
  Button,
  useTheme,
  Typography,
  CircularProgress,
  CircularProgressProps,
} from "@mui/material";
import { get } from "lodash";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { RootState } from "@/redux/features/root.reducer";
import { startPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import { dashboardApi } from "@/app/api/axios/dashboardApi";

function HomePage() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [customLoading, setCustomLoading] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.userInfoState);
  const fullName = `${get(userInfo, "userInfo.firstName", "")} ${get(userInfo, "userInfo.lastName", "")}`;

  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    dispatch(setAudioPlayerUrl("/audio/noti_start.mp3"));
    dispatch(startPlayer());
  };
  const handleTalkNow = () => {
    handleStart();
    router.push("/chat/free-talk");
  };

  useEffect(() => {
    const setGeneralTopic = async () => {
      try {
        const response = await dashboardApi.generateGeneralTopic();
      } catch (error) {
        toast.error("Failed to generate general topic !");
      }
    };
    if (tab === "onboarding") {
      setCustomLoading(true);
      setGeneralTopic();
      setTimeout(() => {
        setCustomLoading(false);
        router.push("/dashboard");
      }, 2500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200); // 10 steps * 200ms = 2000ms

    return () => clearInterval(interval);
  }, []);

  return (
    <Home
      theme={theme}
      fullName={fullName}
      customLoading={customLoading}
      progress={progress}
      handleTalkNow={handleTalkNow}
    />
  );
}
const Home = memo(
  ({
    theme,
    fullName,
    customLoading,
    progress,
    handleTalkNow,
  }: {
    theme: Theme;
    fullName: string;
    customLoading: boolean;
    progress: number;
    handleTalkNow: () => void;
  }) => (
    <Box
      height="100%"
      sx={{ backgroundColor: theme.palette.primary.light, pt: 4, position: "relative" }}
    >
      <Stack justifyContent="center" textAlign="center">
        <Typography variant="h4" color="primary.darker">
          Wellcome back
        </Typography>
        <Typography variant="h4" color="primary.darker">
          {fullName}
        </Typography>
        <Typography color="primary.darker" sx={{ mt: 1.1, px: 4 }}>
          {
            "  If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything"
          }
        </Typography>
        {!customLoading && (
          <Box sx={{ mt: 5 }}>
            <Image
              src="/assets/images/home/home-page.svg"
              alt="motivation-illustration"
              width={287}
              height={215}
            />
          </Box>
        )}
        {customLoading && (
          <Box sx={{ mt: 9 }}>
            <CircularProgressWithLabel value={progress} />
            <Typography variant="h4" color="primary.darker" sx={{ mt: 1.5 }}>
              We are customizing for you
            </Typography>
          </Box>
        )}
      </Stack>
      <Box sx={{ position: "absolute", bottom: 10, right: 15 }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleTalkNow}
          sx={{ minHeight: 36, minWidth: 78 }}
        >
          Talk Now!
        </Button>
      </Box>
    </Box>
  )
);
function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{ color: "rgba(33, 43, 54, 1)" }}
        size={100}
        thickness={2}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "primary.darker", fontSize: 12 }}
          // eslint-disable-next-line react/destructuring-assignment
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
export default memo(HomePage);
