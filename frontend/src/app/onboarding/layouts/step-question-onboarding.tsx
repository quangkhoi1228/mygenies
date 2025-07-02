"use client";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import {
  Box,
  Grid,
  alpha,
  Radio,
  Stack,
  Button,
  Checkbox,
  TextField,
  RadioGroup,
  Typography,
  FormControl,
  LinearProgress,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { map, find, size, round, sumBy, filter } from "lodash";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { onboardingActions } from "@/redux/features/onboarding.slice";
import MessageStatic from "@/app/chat/components/message/MessageStatic";

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
export default function StepQuestionOnboarding({
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

  const { title, content, code } = step;
  const { type, options } = content;
  const theme = useTheme();
  const [valueRadio, setValueRadio] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  const { itemStatus } = useSelector((state: RootState) => state.onboardingState);

  const itemStatusCode = find(itemStatus, { code });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueRadio(event.target.value);
    dispatch(onboardingActions.setUserSelected(event.target.value));
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof selectedValue === "string") return;
    const { value, checked } = event.target;
    console.log("value", value, "checked", checked);
    if (value === "") {
      return;
    }
    const newValue = checked
      ? [...selectedValue, value]
      : filter(selectedValue, (v) => v !== value);
    setSelectedValue(newValue);

    dispatch(onboardingActions.setUserSelected(JSON.stringify(newValue)));
  };
  const handleBack = () => {
    dispatch(onboardingActions.previousActionOnboarding());
  };

  useEffect(() => {
    if (itemStatusCode) {
      const { value } = itemStatusCode;
      setValueRadio(typeof value === "string" ? value : JSON.stringify(value));
    }
  }, [itemStatusCode]);

  useEffect(() => {
    dispatch(onboardingActions.setDisableButtonContinue(false));
  }, [dispatch, itemStatusCode]);

  useEffect(() => {
    if (size(selectedValue) > 0 || size(valueRadio) > 0) {
      dispatch(onboardingActions.setDisableButtonContinue(false));
    } else {
      dispatch(onboardingActions.setDisableButtonContinue(true));
    }
  }, [selectedValue, valueRadio, dispatch]);

  useEffect(() => {
    if (itemStatusCode) {
      const { value } = itemStatusCode;
      if (typeof value === "string") {
        setSelectedValue([]);
      } else if (typeof value === "object") {
        setSelectedValue(value || []);
      } else {
        setSelectedValue(value ? [JSON.stringify(value)] : []);
      }
    }
  }, [itemStatusCode]);

  useEffect(() => {
    if (step.code === "languageLevel") {
      setValueRadio("2");
      dispatch(onboardingActions.setUserSelected("2"));
    }
  }, [step.code, dispatch]);

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
              {type === "singleChoiceQuestion" ? (
                <FormRadio valueRadio={valueRadio} handleChange={handleChange} options={options} />
              ) : (
                <FormCheckbox
                  selectedValue={selectedValue}
                  handleChange={handleCheckboxChange}
                  options={options}
                />
              )}
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </Stack>
  );
}
const FormRadio = ({
  valueRadio,
  handleChange,
  options,
}: {
  valueRadio: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { text: string; value: string; image: string; translateText: string }[];
}) => {
  const theme = useTheme();
  return (
    <RadioGroup name="question-onboarding" value={valueRadio} onChange={handleChange}>
      <Stack spacing={2} width="100%">
        {map(options, ({ text, value, image, translateText }, index) => (
          <FormControlLabel
            value={value}
            control={<Radio />}
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Stack sx={{ py: 1.5, pl: 1 }} spacing={0.5}>
                  <Typography color="primary.dark" fontWeight={700} fontSize={15}>
                    {text}
                  </Typography>
                  <Typography color="primary.dark" fontSize={15} fontWeight={700}>
                    {translateText && `(${translateText})`}
                  </Typography>
                </Stack>
              </Stack>
            }
            sx={{
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              mx: 0,
              pl: 0.7,
              width: "100%",
              minHeight: 72,
            }}
          />
        ))}
      </Stack>
    </RadioGroup>
  );
};

const FormCheckbox = ({
  selectedValue,
  handleChange,
  options,
}: {
  selectedValue: string[];
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { text: string; value: string; image: string; translateText: string }[];
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { otherInput } = useSelector((state: RootState) => state.onboardingState);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedValue]);

  useEffect(() => {
    console.log("selectedValue", selectedValue, "options", options);
  }, [selectedValue, options]);
  return (
    <Stack spacing={2} width="100%">
      {map(options, ({ text, value, translateText }, index) =>
        value ? (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                value={value}
                checked={selectedValue?.includes(value)}
                onChange={handleChange}
              />
            }
            label={
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 24, height: 24, ml: 1 }}>
                  <IconMockup />
                </Box>
                <Stack sx={{ py: 1.5 }} spacing={0.5}>
                  <Typography color="primary.dark" fontWeight={700} fontSize={15}>
                    {text}
                  </Typography>
                  <Typography color="primary.dark" fontSize={15} fontWeight={700}>
                    {translateText && `(${translateText})`}
                  </Typography>
                </Stack>
              </Stack>
            }
            sx={{
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              mx: 0,
              pl: 0.7,
              width: "100%",
              minHeight: 72,
            }}
          />
        ) : (
          <Box
            sx={{
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              mx: 0,
              pl: 0.7,
              width: "100%",
              minHeight: 72,
            }}
          >
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  value="otherInput"
                  checked={selectedValue.includes("otherInput")}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              }
              label={
                <Box width="100%">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 24, ml: 1 }}>
                      <IconMockup />
                    </Box>
                    <Stack sx={{}} spacing={0.5}>
                      <Typography color="primary.dark" fontWeight={700} fontSize={15}>
                        {text}
                      </Typography>
                      <Typography color="primary.dark" fontSize={15} fontWeight={700}>
                        {translateText && `(${translateText})`}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              }
              sx={{
                borderRadius: 1,
                mx: 0,
                pl: 0.7,
                width: "100%",
                minHeight: 72,
                ".MuiFormControlLabel-label": {
                  flexGrow: 1,
                },
              }}
            />
            {selectedValue.includes("otherInput") && (
              <Box px={2} pb={2} sx={{ position: "relative", top: -10 }}>
                <TextField
                  fullWidth
                  placeholder="Enter your answer"
                  inputRef={inputRef}
                  value={otherInput}
                  sx={{
                    outline: "none",

                    "& .MuiInputBase-root": {
                      height: 70,
                    },
                  }}
                  onChange={(e) => dispatch(onboardingActions.setOtherInput(e.target.value))}
                />
              </Box>
            )}
          </Box>
        )
      )}
    </Stack>
  );
};

const IconMockup = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.3377 10.6583C19.0433 6.5532 16.6716 2.68562 13.9471 8.359C13.8382 8.57209 13.738 8.84391 13.6354 9.12196C13.3869 9.7956 13.125 10.5058 12.6942 10.5058V10.4986C12.2635 10.4986 12.0016 9.78845 11.7531 9.11484C11.6506 8.83676 11.5503 8.56491 11.4414 8.3518C8.71686 2.67842 6.34514 6.546 4.05072 10.6511L3.88642 10.9453C3.77362 11.1471 3.66641 11.3389 3.57025 11.5129L3.58768 11.5016L0 17.8243C1.44454 18.7184 3.31516 18.6846 4.81992 17.9614C5.53568 17.6653 6.11767 17.152 6.65115 16.474C6.93407 16.1146 7.51316 15.12 8.3885 13.4901C8.55291 13.8098 8.71374 14.1413 8.87542 14.4746C9.82206 16.4261 10.798 18.4379 12.6942 18.4739V18.4811C14.5905 18.4451 15.5664 16.4332 16.5131 14.4817C17.7174 11.9991 18.8742 9.61427 21.8182 11.52C21.7195 11.3413 21.6091 11.1439 21.4929 10.936L21.4922 10.9348L21.3377 10.6583Z"
      fill="#007867"
    />
    <path
      d="M24 16.0471C24 17.3913 22.9343 18.4811 21.6198 18.4811C20.3053 18.4811 19.2397 17.3913 19.2397 16.0471C19.2397 14.703 20.3053 13.6132 21.6198 13.6132C22.9343 13.6132 24 14.703 24 16.0471Z"
      fill="#007867"
    />
  </svg>
);
