"use client";

import React from "react";
import { motion } from "framer-motion";

const AnimatedText = ({ text, delay = 0.05 }: { text: string; delay: number }) => {
  const letters = text.split("");

  return (
    <span style={{ display: "inline-block", overflow: "hidden" }}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: `0.25em` }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * delay, duration: 0.3 }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default AnimatedText;
