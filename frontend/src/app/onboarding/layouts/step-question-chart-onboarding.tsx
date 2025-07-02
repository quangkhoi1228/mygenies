"use client";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  Box,
  Grid,
  alpha,
  Stack,
  Button,
  Typography,
  FormControl,
  LinearProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { map, round, sumBy } from "lodash";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { onboardingActions } from "@/redux/features/onboarding.slice";
import MessageStatic from "@/app/chat/components/message/MessageStatic";
import ImageChart from "./image-chart";

type ProcessOnboarding = {
  current: number;
  total: number;
};
type StepOnboarding = {
  code: string;
  title: string;
  description: string;
  template: "landingPage" | "question" | "questionWithChart";
  content: ContentOnboarding;
};
type ContentOnboarding = {
  type: "static" | "singleChoiceQuestion" | "multipleChoiceQuestion";
  options: {
    text: string;
    value: string;
    image: string;
    translateText: string;
  }[];
};
export default function StepQuestionChartOnboarding({
  process,
  step,
}: {
  process: ProcessOnboarding[];
  step: StepOnboarding;
}) {
  const totalSum = sumBy(process, "total");
  const result = map(process, (item) => ({
    ...item,
    column: totalSum === 0 ? 0 : round((item.total / totalSum) * 12),
  }));
  const dispatch = useDispatch();

  const { title, content } = step;
  const { type, options } = content;
  const theme = useTheme();
  const [valueRadio, setValueRadio] = useState<string>("");

  const handleChange = (value: string) => {
    setValueRadio(value);
    dispatch(onboardingActions.setUserSelected(value));
  };

  const handleBack = () => {
    dispatch(onboardingActions.previousActionOnboarding());
  };
  useEffect(() => {
    if (valueRadio) {
      dispatch(onboardingActions.setDisableButtonContinue(false));
    } else {
      dispatch(onboardingActions.setDisableButtonContinue(true));
    }
  }, [valueRadio, dispatch]);
  useEffect(() => {
    setValueRadio(options[1]?.value || "");
    dispatch(onboardingActions.setUserSelected(options[1]?.value || ""));
  }, [options, dispatch]);

  return (
    <Stack height="100%">
      <Box height={90} sx={{ borderBottom: 1, borderColor: alpha(theme.palette.divider, 0.5) }}>
        <Stack height="100%" sx={{ p: 2 }}>
          <Box flexGrow={1} sx={{ mt: 2 }}>
            <Button
              size="small"
              color="primary"
              onClick={handleBack}
              startIcon={<ArrowBackIosRoundedIcon sx={{ fontSize: "14px !important" }} />}
            >
              Back
            </Button>
          </Box>
          <Grid container spacing={1}>
            {map(result, ({ column, current, total }) => (
              <Grid item xs={column} key={`${step.code}-${current}-${total}`}>
                <LinearProgress variant="determinate" value={round((current / total) * 100)} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
      <Box height="calc(100% - 90px)" sx={{ p: 2 }}>
        <FormControl fullWidth sx={{ height: "100%", overflowY: "hidden" }}>
          <Stack spacing={1} height="100%">
            <MessageStatic text={title} />
            <Box
              flexGrow={1}
              sx={{
                // height: "calc(100% - 175px)",
                mb: "125px",
                pt: 1,
                overflowY: "auto",
                scrollbarWidth: "none", // Firefox
                "&::-webkit-scrollbar": {
                  display: "none", // Chrome, Safari
                },
              }}
            >
              <Box sx={{ px: 1.5 }}>
                <ImageChart />
              </Box>
              <Box>
                <FormRadio
                  selectedValue={valueRadio}
                  handleChange={handleChange}
                  options={options}
                />
              </Box>
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </Stack>
  );
}
const FormRadio = ({
  selectedValue,
  handleChange,
  options,
}: {
  selectedValue: string;
  handleChange: (value: string) => void;
  options: { text: string; value: string; image: string; translateText: string }[];
}) => (
  <Box sx={{ px: 2.5 }}>
    <Grid container spacing={2}>
      {options.map(({ text, value, translateText }, index) => (
        <Grid item xs={6} key={value}>
          <Button
            key={value}
            variant={selectedValue === value ? "contained" : "outlined"}
            color="primary"
            fullWidth
            sx={{ overflow: "hidden", height: 50 }}
            onClick={() => handleChange(value)}
          >
            <Stack spacing={0.5}>
              <Typography color="inherit" fontWeight={700} fontSize={15}>
                {text}
              </Typography>
            </Stack>
          </Button>
        </Grid>
      ))}
    </Grid>
  </Box>
);
