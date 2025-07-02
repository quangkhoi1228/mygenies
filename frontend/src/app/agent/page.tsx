import { Stack } from "@mui/material";
import { Metadata } from "next";
import AddNewAgent from "./components/add-new-agent";
import AgentList from "./components/agent";

export const metadata: Metadata = {
  title: "Agent",
  description: "Agent",
};

function AgentPage() {
  return (
    <Stack>
      <AddNewAgent />
      <AgentList />
    </Stack>
  );
}

export default AgentPage;
