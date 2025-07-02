"use client";

import { IconButton } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import SettingIcon from "@/assets/icons/SettingIcon";
import { getActiveAgent } from "@/redux/features/agent.slice";
import { RootState } from "@/redux/store";
import { routes } from "@/routes";

function SettingsButton() {
  const dispatch = useDispatch();
  const { activeAgent } = useSelector((state: RootState) => state.agentState);
  useEffect(() => {
    dispatch(getActiveAgent());
  }, [dispatch]);
  return activeAgent ? (
    <Link href={`${routes.agent.url}${activeAgent.id}`}>
      <IconButton color="primary" sx={{ p: 0 }}>
        <SettingIcon height={30} width={30} />
      </IconButton>
    </Link>
  ) : (
    <span />
  );
}

export default SettingsButton;
