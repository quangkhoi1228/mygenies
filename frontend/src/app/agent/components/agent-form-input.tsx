import { Card, CardHeader, CardContent } from "@mui/material";
import { UserAiConfigType } from "@/redux/types/user-ai-config-type";
import RHFTextField from "@/components/hook-form/rhf-text-field";

function AgentFormInput({ config }: { config: UserAiConfigType }) {
  return (
    <Card data-name={config.key}>
      <CardHeader title={config.name} />
      <CardContent>
        <RHFTextField
          name={config.key}
          placeholder={config.name}
          size="medium"
          fullWidth
          sx={{ fontSize: 16 }}
        />
      </CardContent>
    </Card>
  );
}

export default AgentFormInput;
