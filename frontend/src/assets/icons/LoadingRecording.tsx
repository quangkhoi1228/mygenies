"use client";

import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import React from "react";

export default function LoadingRecording() {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const LoadingIcon = styled.span`
    @keyframes quiet {
      25% {
        transform: scaleY(0.6);
      }
      50% {
        transform: scaleY(0.4);
      }
      75% {
        transform: scaleY(0.8);
      }
    }

    @keyframes normal {
      25% {
        transform: scaleY(1);
      }
      50% {
        transform: scaleY(0.4);
      }
      75% {
        transform: scaleY(0.6);
      }
    }
    @keyframes loud {
      25% {
        transform: scaleY(1);
      }
      50% {
        transform: scaleY(0.4);
      }
      75% {
        transform: scaleY(1.2);
      }
    }
    body {
      display: flex;
      justify-content: center;
      background: black;
      margin: 0;
      padding: 0;
      align-items: center;
      height: 100vh;
    }

    .boxContainer {
      display: flex;
      justify-content: space-between;
      height: 40px;
      --boxSize: 8px;
      --gutter: 4px;
      width: calc((var(--boxSize) + var(--gutter)) * 5);
    }

    .box {
      transform: scaleY(0.4);
      height: 100%;
      width: var(--boxSize);
      background: ${primary};
      animation-duration: 1.2s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      border-radius: 8px;
    }

    .box1 {
      animation-name: quiet;
    }

    .box2 {
      animation-name: normal;
    }

    .box3 {
      animation-name: quiet;
    }

    .box4 {
      animation-name: loud;
    }

    .box5 {
      animation-name: quiet;
    }
  `;
  return (
    <LoadingIcon>
      <span className="boxContainer">
        <span className="box box1" />
        <span className="box box2" />
        <span className="box box3" />
        <span className="box box4" />
        <span className="box box5" />
      </span>
    </LoadingIcon>
  );
}
