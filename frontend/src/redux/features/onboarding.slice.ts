import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProcessOnboarding = {
  current: number;
  total: number;
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
type StepOnboarding = {
  code: string;
  title: string;
  description: string;
  template: "landingPage" | "question" | "questionWithChart";
  content: ContentOnboarding;
};
type ItemStatusOnboarding = {
  code: string;
  status: boolean;
  value: string | string[] | null;
};

type OnboardingState = {
  loading: boolean;
  process: ProcessOnboarding[];
  previousCode: string | null;
  nextCode: string | null;
  done: boolean | null;
  step: StepOnboarding;
  userSelected: string | boolean | string[];
  disableButtonContinue: boolean;
  itemStatus: ItemStatusOnboarding[];
  otherInput: string;
};

const initialState: OnboardingState = {
  disableButtonContinue: false,
  userSelected: "",
  otherInput: "",
  loading: true,
  process: [],
  previousCode: null,
  nextCode: null,
  done: null,
  step: {
    code: "",
    title: "",
    description: "",
    template: "landingPage",
    content: {
      type: "static",
      options: [],
    },
  },
  itemStatus: [],
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setItemStatus: (state, action: PayloadAction<ItemStatusOnboarding[]>) => {
      state.itemStatus = action.payload;
    },
    setDisableButtonContinue: (state, action: PayloadAction<boolean>) => {
      state.disableButtonContinue = action.payload;
    },
    setUserSelected: (state, action: PayloadAction<string | boolean | string[]>) => {
      state.userSelected = action.payload;
    },
    continueActionOnboarding: (state) => {
      // state.loading = true;
    },
    previousActionOnboarding: (state) => {
      // state.userSelected = JSON.parse(state.userSelected);
    },
    getStatusOnboarding: (state) => {
      state.loading = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.step.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.step.description = action.payload;
    },

    setProcessOnboarding: (state, action: PayloadAction<ProcessOnboarding[]>) => {
      state.process = action.payload;
    },
    setPreviousCode: (state, action: PayloadAction<string | null>) => {
      state.previousCode = action.payload;
    },
    setNextCode: (state, action: PayloadAction<string | null>) => {
      state.nextCode = action.payload;
    },
    setDone: (state, action: PayloadAction<boolean>) => {
      state.done = action.payload;
    },
    setStep: (state, action: PayloadAction<StepOnboarding>) => {
      state.step = action.payload;
    },
    setTemplate: (
      state,
      action: PayloadAction<"landingPage" | "question" | "questionWithChart">
    ) => {
      state.step.template = action.payload;
    },
    setContent: (state, action: PayloadAction<ContentOnboarding>) => {
      state.step.content = action.payload;
    },
    setOtherInput: (state, action: PayloadAction<string>) => {
      state.otherInput = action.payload;
    },
  },
});

export const onboardingActions = onboardingSlice.actions;
export const onboardingReducer = onboardingSlice.reducer;
