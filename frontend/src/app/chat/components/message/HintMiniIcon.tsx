import { Box, IconButton } from "@mui/material";
import { useRef } from "react";
import HintIcon from "@/assets/icons/HintIcon";

export default function HintMiniIcon({
  handleChangeHint,
  data,
}: {
  handleChangeHint: () => void;
  data?: string;
}) {
  const hintRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (hintRef.current) {
  //     hintRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //     });
  //   }
  // }, []);
  return (
    data && (
      <Box ref={hintRef} sx={{ textAlign: "right", mr: 0.6 }}>
        <IconButton onClick={handleChangeHint}>
          <HintIcon />
        </IconButton>
      </Box>
    )
  );
}
