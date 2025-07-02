"use client";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";

import { Box, Stack, Button, ListItemText } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "@/components/iconify";
import Label from "@/components/label";
import {
  getActiveAgent,
  setActiveAgentID,
  setAgentListMeta,
} from "@/redux/features/agent.slice";
import { RootState } from "@/redux/store";
import { routes } from "@/routes";

export default function AgentList() {
  const dispatch = useDispatch();
  const { agentList, activeAgent } = useSelector((state: RootState) => state.agentState);
  useEffect(() => {
    dispatch(setAgentListMeta({ page: 1 }));
    dispatch(getActiveAgent());
  }, [dispatch]);

  useEffect(() => {
    console.log("agentList", agentList);
  }, [agentList]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2, mb:8 }}>
      {agentList.map((agent) => {
        const selected = agent.id === activeAgent?.id;
        return (
          <Card
            key={agent.id}
            sx={{
              display: "flex",
              alignItems: "center",
              p: (theme) => theme.spacing(3, 2, 3, 3),
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Avatar src={agent.targetInfo.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                <ListItemText
                  primary={agent.targetInfo.name}
                  secondary={
                    <div>
                      <Iconify
                        icon="bxs:quote-alt-left"
                        width={16}
                        sx={{ flexShrink: 0, mr: 0.5 }}
                      />
                      <span style={{ fontSize: 12 }}>{agent.targetInfo.voice}</span>
                    </div>
                  }
                  primaryTypographyProps={{
                    noWrap: true,
                    typography: "subtitle2",
                  }}
                  secondaryTypographyProps={{
                    mt: 0.5,
                    noWrap: true,
                    display: "flex",
                    component: "span",
                    alignItems: "center",
                    typography: "caption",
                    color: "text.disabled",
                  }}
                />
                <Button
                  size="small"
                  variant={selected ? "outlined" : "contained"}
                  color={selected ? "inherit" : "primary"}
                  onClick={() => {
                    if (!selected) {
                      console.log("agent.id", agent.id);
                      dispatch(setActiveAgentID(agent.id));
                    }
                  }}
                  sx={{
                    flexShrink: 0,
                    ml: 1.5,
                    position: "absolute",
                    right: "1rem",
                    top: "1.25rem",
                  }}
                >
                  {selected ? "Current" : "Choose"}
                </Button>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                sx={{ mt: 2 }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                  overflow="scroll"
                  gap={2}
                  sx={{
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {[
                    ...(agent.targetInfo.tone?.slice(0, 2) || []),
                    ...(agent.targetInfo.ability?.slice(0, 1) || []),
                  ].map((tone) => (
                    <Label
                      key={tone}
                      variant="soft"
                      color="default"
                      whiteSpace="nowrap"
                      minWidth="auto !important"
                    >
                      {tone}
                    </Label>
                  ))}
                </Stack>
                <Link href={`${routes.agent.url}${agent.id}`}>
                  <Button size="small" variant="text" color="inherit" sx={{ ml: 1.5 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        textDecoration: "underline",
                        fontStyle: "italic",
                        color: "#637381",
                      }}
                    >
                      View detail
                    </span>
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Card>
        );
      })}
    </Box>
  );
}
