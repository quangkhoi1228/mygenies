import React from "react";
import Image from "next/image";
import chatIcon from "./icon-chat.png";

export default function ChatIcon() {
  return <Image src={chatIcon} width={27} height={27} alt="chat icon" />;
}
