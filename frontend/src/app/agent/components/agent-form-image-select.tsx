import { UserAiConfigType } from "@/redux/types/user-ai-config-type";
import { Box, Card, Stack, Avatar, CardHeader, CardContent } from "@mui/material";
import { Controller } from "react-hook-form";

function AgentFormImageSelect({ config }: { config: UserAiConfigType }) {
  // useEffect(() => {
  //   console.log(config);
  // }, [config]);
  // set default value

  return (
    <Card data-name={config.key}>
      <CardHeader title={config.name} />
      <CardContent>
        <Controller
          name={config.key}
          render={({ field, fieldState: { error } }) => (
            // console.log(field, config.options);
            <Stack
              role="radiogroup"
              className="avatar-grid"
              direction="row"
              flexWrap="wrap"
              justifyContent="space-between"
            >
              {config.options?.map((option) => (
                <Box
                  key={option.id}
                  sx={{
                    cursor: "pointer",
                    border: field.value === option.value ? "10px solid #00A76F" : "10px solid #fff",
                    borderRadius: "50%",
                    padding: 0,
                    margin: 0,
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",

                    justifyContent: "center",
                  }}
                  onClick={() => field.onChange(option.value)}
                >
                  <Avatar src={option.url} sx={{ width: 52, height: 52, borderRadius: "50%" }} />
                </Box>
              ))}
            </Stack>
          )}
        />
      </CardContent>
    </Card>
  );
}

export default AgentFormImageSelect;
