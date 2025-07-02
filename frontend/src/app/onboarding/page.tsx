"use client";

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useObjectMemo from "@/hooks/use-object-memo";
import OverviewViewOnboarding from "./layouts/overview-onboarding";
import StepQuestionChartOnboarding from "./layouts/step-question-chart-onboarding";
import StepQuestionOnboarding from "./layouts/step-question-onboarding";

export default function Page() {
  const onboardingState = useSelector((state: RootState) => state.onboardingState);
  const stepCached = useObjectMemo(() => onboardingState.step, [onboardingState.step]);
  const [loading, setLoading] = useState(true);

  const templateCached = useMemo(
    () => onboardingState.step.template,
    [onboardingState.step.template]
  );
  const processCached = useObjectMemo(() => onboardingState.process, [onboardingState.process]);
  const titleCached = useMemo(() => onboardingState.step.title, [onboardingState.step.title]);
  const descriptionCached = useMemo(
    () => onboardingState.step.description,
    [onboardingState.step.description]
  );
  const router = useRouter();

  useEffect(() => {
    if (onboardingState.done && loading === false) {
      router.push("/dashboard?tab=onboarding");
    }
  }, [onboardingState.done, router, loading]);

  useEffect(() => {
    if (!onboardingState.loading) {
      setLoading(false);
    }
    return () => {};
  }, [onboardingState.loading]);
  const loadingCached = useMemo(() => loading, [loading]);

  return (
    <OnboardingPage
      templateCached={templateCached}
      processCached={processCached}
      stepCached={stepCached}
      loading={loadingCached}
      titleCached={titleCached}
      descriptionCached={descriptionCached}
    />
  );
}

const OnboardingPage = memo(
  ({
    templateCached,
    processCached,
    stepCached,
    loading,
    titleCached,
    descriptionCached,
  }: {
    templateCached: string;
    processCached: any;
    stepCached: any;
    loading: boolean;
    titleCached: string;
    descriptionCached: string;
  }) => (
    <Box height="100%">
      {templateCached === "landingPage" && (
        <OverviewViewOnboarding title={titleCached} description={descriptionCached} />
      )}
      {templateCached === "question" && (
        <StepQuestionOnboarding process={processCached} step={stepCached} />
      )}
      {templateCached === "questionWithChart" && (
        <StepQuestionChartOnboarding process={processCached} step={stepCached} />
      )}

      {/* <StepQuestionOnboarding /> */}
    </Box>
  )
);
