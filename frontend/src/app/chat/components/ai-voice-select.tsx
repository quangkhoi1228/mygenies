"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { routes } from "@/routes";
import { useRouter } from "next/navigation";

import { Box, Select, MenuItem, Typography, FormControl } from "@mui/material";

export default function AiVoiceSelect() {
  const { activeAgent } = useSelector((state: RootState) => state.agentState);

  const router = useRouter();
  // const handleChange = (event: SelectChangeEvent) => {
  //   setSelectedCountry(event.target.value);
  // };

  return activeAgent ? (
    <FormControl size="small">
      <Select
        readOnly
        labelId="country-select-label"
        id="country-select"
        variant="outlined"
        color="primary"
        value={activeAgent?.userAiInfo.name}
        onClick={() => router.push(routes.agent.url)}
        // label="Country"
        // onChange={handleChange}
        renderValue={(value) => (
          <Box display="flex" alignItems="center" gap={1}>
            {/* <Box sx={{ borderRadius: 1, overflow: "hidden" }}>
                <Image width={24} height={24} src={voice.img} alt={voice.name} />
              </Box> */}
            <Typography color="primary.main" fontSize={14}>
              {activeAgent?.userAiInfo.name}
            </Typography>
          </Box>
        )}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
            borderWidth: "1px",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.dark",
            borderWidth: "1px",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
            borderWidth: "1px",
          },
          "& .MuiSelect-icon": {
            color: "primary.main",
          },
        }}
      >
        <MenuItem value={activeAgent?.userAiInfo.name}>
          <Typography>{activeAgent?.userAiInfo.name}</Typography>
        </MenuItem>
      </Select>
    </FormControl>
  ) : (
    <span />
  );
}
