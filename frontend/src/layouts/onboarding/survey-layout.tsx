import { Box } from "@mui/material";
import MessageStatic from "@/app/chat/components/message/MessageStatic";

export default function SurveyLayout({
  title,
  listChose,
  multiChose,
  onBack,
  onNext,
}: {
  title: string;
  listChose: string[];
  multiChose: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <Box>
      <MessageStatic text="Hello, how are you?" />
    </Box>
  );
}
