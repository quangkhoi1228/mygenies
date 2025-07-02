"use client";

import { Box, alpha, Button, useTheme, CircularProgress } from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { onboardingActions } from "@/redux/features/onboarding.slice";
import Loading from "../loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loadingPage, setLoadingPage] = useState(true);

  const onboardingState = useSelector((state: RootState) => state.onboardingState);
  const templateCached = useMemo(
    () => onboardingState.step.template,
    [onboardingState.step.template]
  );
  const [disableButton, setDisableButton] = useState(false);
  const handleContinue = () => {
    if (templateCached === "landingPage") {
      dispatch(onboardingActions.setUserSelected(true));
    }

    dispatch(onboardingActions.continueActionOnboarding());
  };

  // useEffect(() => {
  //   dispatch(onboardingActions.getStatusOnboarding());
  // }, [dispatch]);

  useEffect(() => {
    if (!onboardingState.loading) {
      setLoadingPage(false);
    }
  }, [onboardingState.loading]);
  useEffect(() => {
    if (onboardingState.step.template === "landingPage") {
      setDisableButton(false);
    } else {
      setDisableButton(onboardingState.disableButtonContinue);
    }
  }, [onboardingState.step.template, onboardingState.disableButtonContinue]);

  if (loadingPage) {
    return <Loading />;
  }
  return (
    <Box
      height="100%"
      position="relative"
      sx={{
        maxWidth: 425,
        mx: "auto",
        ...(templateCached === "landingPage" && {
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.lighter, 0.2)} 0%, ${alpha(theme.palette.primary.dark, 0.2)} 100%)`,
        }),
      }}
    >
      {children}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          height: 120,
          left: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        {loadingPage ? (
          <CircularProgress color="success" size={15} />
        ) : (
          <Button
            color="primary"
            variant="contained"
            disabled={disableButton}
            sx={{
              height: 48,
              width: 180,
              fontSize: 15,
              transition: "all 0.3s ease-in-out",
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        )}
      </Box>
    </Box>
  );
}
