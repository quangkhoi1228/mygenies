"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import { stopPlayer, startPlayer, setAudioPlayerUrl } from "@/redux/features/audioPlayer.slice";
import { RootState } from "@/redux/store";
import { useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export const pageHasAudio = ["/chat/topic", "/chat/free-talk"];

export default function AudioPlayer() {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { audioUrl, isPlaying, isClick } = useSelector(
    (state: RootState) => state.audioPlayerState
  );
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isClick && pageHasAudio.includes(pathname)) {
      router.push("/");

      return () => {};
    }
    if (audioUrl && isClick) {
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.addEventListener("ended", () => {
          dispatch(stopPlayer());
        });
      }
      // dispatch(stopPlayer());
      if (isPlaying) {
        audioRef.current.src = audioUrl;

        audioRef.current
          .play()

          .catch((error) => {
            throw error;
          });
      } else {
        audioRef.current.pause();
      }
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [audioUrl, dispatch, isClick, isPlaying, router, pathname]); // Khi audioUrl thay đổi thì phát nhạc mới

  const handlePlayNewAudio = (newAudioUrl: string) => {
    dispatch(setAudioPlayerUrl(newAudioUrl)); // Thay đổi URL của audio và phát nhạc
    dispatch(startPlayer());
  };

  const handleStopAudio = () => {
    dispatch(stopPlayer());
  };

  return (
    <div>
      {/* <Button onClick={() => handlePlayNewAudio("/audio/temp.mp3")}>Play Audio 1</Button>
      <Button onClick={() => handlePlayNewAudio("/audio/temp2.mp3")}>Play Audio 2</Button>
      <Button onClick={handleStopAudio}>Stop Audio</Button>

      {isPlaying && <div>Playing: {audioUrl}</div>} */}
    </div>
  );
}
