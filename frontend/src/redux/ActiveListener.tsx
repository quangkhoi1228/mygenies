"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

import { Box } from "@mui/material";
import Loading from "@/app/loading";
import useOnboarding from "@/hooks/use-onboarding";
import { audioPlayerActions } from "./features/audioPlayer.slice";
import { setPathname } from "./features/pathname.slice";

export default function ActiveListener({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { loading, redirect } = useOnboarding();
  const [loadingState, setLoadingState] = useState(loading);
  const onboardingPath = "/onboarding/";

  useLayoutEffect(() => {
    const isOnboarding = pathname === onboardingPath;

    if (isOnboarding) {
      setLoadingState(false); // Đã ở onboarding, tắt loading
    } else if (redirect) {
      setLoadingState(true); // Đang redirect, show loading
    } else if (!loading) {
      setLoadingState(false); // Không redirect và đã loading xong
    }
  }, [loading, redirect, pathname]);
  const router = useRouter();
  useEffect(() => {
    if (pathname) {
      dispatch(setPathname(pathname));
    }
  }, [pathname, dispatch]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      dispatch(audioPlayerActions.setIsClick(true));
    },
    [dispatch]
  );

  useEffect(() => {
    if (redirect) {
      router.push("/onboarding");
    }
  }, [redirect, router]);

  useLayoutEffect(() => {
    document.body.addEventListener("click", handleClick, true);

    return () => {
      document.body.removeEventListener("click", handleClick, true);
    };
  }, [handleClick]);

  return (
    <ActiveListenerLayout loading={loadingState} onClick={handleClick}>
      {loadingState || (redirect && pathname !== onboardingPath) ? null : children}
    </ActiveListenerLayout>
  );
}
const ActiveListenerLayout = ({
  children,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  loading: boolean;
  onClick: (e: MouseEvent) => void;
}) => (
  <Box
    sx={{
      maxWidth: 425,
      mx: "auto",
      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      borderRadius: 0,
      height: "100vh",
      overflow: "auto",
      scrollbarWidth: "none", // Firefox
      "&::-webkit-scrollbar": {
        display: "none", // Chrome, Safari
      },
    }}
  >
    {loading ? <Loading /> : children}
  </Box>
);
