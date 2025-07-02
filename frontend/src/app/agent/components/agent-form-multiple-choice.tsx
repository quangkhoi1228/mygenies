import { Card, CardHeader } from "@mui/material";
import { RHFMultiCheckboxVertical } from "@/components/hook-form/rhf-checkbox-vertical";
import { UserAiConfigType } from "@/redux/types/user-ai-config-type";

function AgentFormMultipleChoice({ config }: { config: UserAiConfigType }) {
  return (
    <Card data-name={config.key}>
      <CardHeader
        title={`${config.name} (Max: ${config.maxSelection} option${config.maxSelection > 1 ? "s" : ""})`}
      />
      <RHFMultiCheckboxVertical
        name={config.key}
        options={
          config.options?.map((option) => ({ label: option.name, value: option.value })) || []
        }
      />
    </Card>
  );
}

export default AgentFormMultipleChoice;
