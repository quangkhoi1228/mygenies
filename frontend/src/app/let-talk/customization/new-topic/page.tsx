"use client";

import {
  Box,
  Stack,
  Button,
  useTheme,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { startPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import createNewTopic from "./helpers/createNewTopic";

export default function Page() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = (data: any) => {
    dispatch(setAudioPlayerUrl("/audio/noti_start.mp3"));
    dispatch(startPlayer());
    setLoading(true);
    const fetchData = async () => {
      const res = await createNewTopic(data);
      const { id } = res;
      router.push(`/chat/topic?id=${id}&ref=/let-talk/customization`);
    };
    fetchData();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box height="100%">
      <Box sx={{ mt: 1.5 }}>
        <Typography
          color="primary.dark"
          variant="h3"
          textAlign="center"
          sx={{ lineHeight: 1.2, letterSpacing: "-0.02em" }}
        >
          What do you want to talk about?
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Box>
              {" "}
              <TextField
                inputRef={inputRef}
                variant="outlined"
                label="Scenario"
                fullWidth
                {...register("topic", { required: true })}
                sx={{
                  "& input": {
                    fontSize: 14,
                    color: `${theme.palette.primary.main}`,
                  },
                  "& label": {
                    color: `${theme.palette.primary.main} !important`, // màu mặc định
                  },

                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: `${theme.palette.primary.main} !important`, // màu mặc định
                    },
                  },
                }}
              />
              {errors.topic && (
                <Typography color="error" sx={{ fontSize: 12, lineHeight: 1 }}>
                  Scenario is required
                </Typography>
              )}
            </Box>
            <Box position="relative">
              <TextField
                label="Doku role"
                {...register("systemRole", { required: true })}
                fullWidth
                sx={{
                  "& input": {
                    fontSize: 14,
                    color: `${theme.palette.primary.main}`,
                  },
                  "& label": {
                    color: `${theme.palette.primary.main} !important`, // màu mặc định
                  },

                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: `${theme.palette.primary.main} !important`, // màu mặc định
                    },
                  },
                }}
              />
              {errors.systemRole && (
                <Typography color="error" sx={{ fontSize: 12, lineHeight: 1 }}>
                  System role is required
                </Typography>
              )}
            </Box>

            <Box>
              <TextField
                label="Your role"
                {...register("userRole", { required: true })}
                fullWidth
                sx={{
                  "& input": {
                    fontSize: 14,
                    color: `${theme.palette.primary.main}`,
                  },
                  "& label": {
                    color: `${theme.palette.primary.main} !important`, // màu mặc định
                  },

                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: `${theme.palette.primary.main} !important`, // màu mặc định
                    },
                  },
                }}
              />
              {errors.userRole && (
                <Typography color="error" sx={{ fontSize: 12, lineHeight: 1 }}>
                  User role is required
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: 145 }}
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress color="success" size={12} /> : ""}
              >
                Let&apos;s talk
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
