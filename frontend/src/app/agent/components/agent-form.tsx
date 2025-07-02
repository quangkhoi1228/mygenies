"use client";

import FormProvider from "@/components/hook-form/form-provider";
import {
  createAgent,
  updateAgent,
  getEditAgentInfo,
  setCreateAgentStatus,
  setFullEditAgentState,
} from "@/redux/features/agent.slice";
import { RootState } from "@/redux/store";
import { UserAiConfigTypeEnum } from "@/redux/types/user-ai-config-type";
import { UserAiType } from "@/redux/types/user-ai-type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { Box, Button } from "@mui/material";

import AgentFormImageSelect from "./agent-form-image-select";
import AgentFormInput from "./agent-form-input";
import AgentFormMultipleChoice from "./agent-form-multiple-choice";
import AgentFormSingleChoice from "./agent-form-single-choice";

function AgentForm({ type, agentId }: { type: "create" | "edit"; agentId?: number }) {
  const pathname = usePathname();
  const { agentConfigList, fullEditAgentState } = useSelector(
    (state: RootState) => state.agentState
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const AgentSchema = Yup.object().shape({
    name: Yup.string().max(15, "Max 15 characters").required("Title is required"),
    avatar: Yup.string().min(1, "Avatar is required"),
    tone: Yup.array().of(Yup.string()).min(1, "Tone is required").max(3, "Max 3 tones"),
    voice: Yup.string().required("Voice is required"),
    ability: Yup.array().of(Yup.string()).min(1, "Ability is required").max(3, "Max 3 abilities"),
    maxCharacter: Yup.number().required("Max character is required"),
    maxHintCharacter: Yup.number().required("Max hint character is required"),
  });

  const agentState = useSelector((state: RootState) => state.agentState);
  const methods = useForm({
    resolver: yupResolver(AgentSchema),
    defaultValues: agentState.editAgentState,
  });
  const {
    reset,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(
    async (data) => {
      console.log(data);
      try {
        if (type === "create") {
          dispatch(createAgent(data as UserAiType));
          return;
        }

        if (type === "edit") {
          dispatch(updateAgent({ data: data as UserAiType, id: agentId as number }));
        }
      } catch (error) {
        console.error(error);
      }
    },
    (errors) => {
      setErrorFocus(errors);
    }
  );

  const setErrorFocus = (errors: FieldErrors) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`[data-name="${firstErrorKey}"]`);
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // const allValues = watch(); // all form values

  // useEffect(() => {
  //   console.log("Form changed:", allValues);
  // }, [allValues]);

  useEffect(() => {
    if (type === "create") {
      reset(agentState.editAgentState);
      dispatch(setFullEditAgentState(undefined));
    }

    if (type === "edit") {
      reset(agentState.editAgentState);
    }
  }, [type, reset, agentState.editAgentState, dispatch]);

  useEffect(() => {
    if (agentState.createAgentStatus === "success") {
      reset();
      // router.push("/agent");
      router.back();
      dispatch(setCreateAgentStatus("idle"));
    }
  }, [agentState.createAgentStatus, reset, router, dispatch]);

  useEffect(() => {
    if (agentId) {
      dispatch(getEditAgentInfo(agentId));
    }
  }, [agentId, dispatch]);

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {agentConfigList?.map((config) => {
          switch (config.type) {
            case UserAiConfigTypeEnum.imageSelect:
              return <AgentFormImageSelect key={config.id} config={config} />;
            case UserAiConfigTypeEnum.multipleChoiceQuestion:
              return <AgentFormMultipleChoice key={config.id} config={config} />;
            case UserAiConfigTypeEnum.singleChoiceQuestion:
              return <AgentFormSingleChoice key={config.id} config={config} />;
            default:
              return <AgentFormInput key={config.id} config={config} />;
          }
        })}
      </div>

      <Box
        sx={{
          textAlign: "center",
          mt: 4,
          display: fullEditAgentState?.userId === 0 ? "none" : "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 145 }}
          type="submit"
          size="large"
          // disabled={loading}
          // startIcon={loading ? <CircularProgress color="success" size={12} /> : ""}
        >
          Save config
        </Button>
      </Box>
    </FormProvider>
  );
}

export default AgentForm;
