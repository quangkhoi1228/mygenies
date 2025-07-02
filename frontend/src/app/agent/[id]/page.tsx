"use client";

import { Tab, Card, Tabs, tabsClasses } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAgentConfigList } from "@/redux/features/agent.slice";
import { RootState } from "@/redux/store";

import AgentForm from "../components/agent-form";
import ProfileCover from "../components/profile-cover";
import { tabs } from "../create/tabs";

function AgentDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("config");
  const agentState = useSelector((state: RootState) => state.agentState);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    dispatch(getAgentConfigList());
  }, [dispatch]);

  // useEffect(() => {
  //   const defaultState = {
  //     name: `Speakko ${Math.random().toString(36).substring(2, 8)}`,
  //     avatar: "/assets/images/agent/avatar/1.png",
  //     tone: [],
  //     voice: "",
  //     ability: [],
  //     maxCharacter: 200,
  //     maxHintCharacter: 200,
  //   };
  //   dispatch(setEditAgentState(defaultState));
  // }, [dispatch]);

  return (
    <section style={{ marginBottom: 80 }}>
      <Card
        sx={{
          mb: 3,
          // height: 290,
          height: 200,
        }}
      >
        <ProfileCover
          name={agentState.editAgentState.name}
          avatarUrl={agentState.editAgentState.avatar}
          coverUrl="/assets/images/agent/create-background-default.svg"
        />
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            display: "none",
            bottom: 0,
            zIndex: 9,
            position: "absolute",
            bgcolor: "background.paper",
            [`& .${tabsClasses.flexContainer}`]: {
              justifyContent: "center",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>
      <AgentForm type="edit" agentId={Number(params.id)} />
    </section>
  );
}

export default AgentDetailPage;
