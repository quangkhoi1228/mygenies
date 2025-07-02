"use client";

import { Box, Button, ButtonGroup } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function GroupTab() {
  const router = useRouter();
  const pathname = usePathname();
  const urlGeneral = "/let-talk/general";
  const urlCustomization = "/let-talk/customization";

  const [activeGeneral, setActiveGeneral] = useState<boolean>(true);
  const handleClickGeneral = () => {
    setActiveGeneral(true);
    router.push(urlGeneral);
  };
  const handleClickCustomization = () => {
    setActiveGeneral(false);
    router.push(urlCustomization);
  };
  useEffect(() => {
    if (pathname.includes(urlGeneral)) {
      setActiveGeneral(true);
    } else {
      setActiveGeneral(false);
    }
  }, [pathname]);
  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
      <ButtonGroup>
        <Button
          onClick={handleClickGeneral}
          color="primary"
          variant={activeGeneral ? "contained" : "outlined"}
          sx={{
            width: 130,
            ...(activeGeneral && { borderRadius: "8px !important", mr: "-8px !important" }),
          }}
        >
          General
        </Button>
        <Button
          onClick={handleClickCustomization}
          color="primary"
          variant={!activeGeneral ? "contained" : "outlined"}
          sx={{
            width: 130,
            ...(!activeGeneral && { borderRadius: "8px !important", ml: "-8px !important" }),
          }}
        >
          Customization
        </Button>
      </ButtonGroup>
    </Box>
  );
}
