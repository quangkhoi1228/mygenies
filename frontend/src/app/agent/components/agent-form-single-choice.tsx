import { Card, CardHeader, IconButton } from "@mui/material";
import { useRef } from "react";
import SpeakIcon from "@/assets/icons/SpeakIcon";
import RHFRadioGroupVertical from "@/components/hook-form/rhf-radio-group-vertical";
import { UserAiConfigType } from "@/redux/types/user-ai-config-type";

function AgentFormSingleChoice({ config }: { config: UserAiConfigType }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <Card data-name={config.key}>
      <CardHeader
        title={`${config.name} (Max: ${config.maxSelection} option${config.maxSelection > 1 ? "s" : ""})`}
      />
      <RHFRadioGroupVertical
        name={config.key}
        options={
          config.options?.map((option) => ({
            label: option.name,
            value: option.value,
            actions:
              config.key === "voice" ? (
                <IconButton
                  sx={{ position: "absolute", right: 10 }}
                  onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    audioRef.current = new Audio(option.url);
                    audioRef.current.play();
                  }}
                >
                  <SpeakIcon width={22} height={22} />
                </IconButton>
              ) : null,
          })) || []
        }
      />
    </Card>
  );
}

export default AgentFormSingleChoice;
