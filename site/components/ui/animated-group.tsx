"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: {
      staggerChildren: 0.08,
      delayChildren: delay,
    },
  }),
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      bounce: 0.3,
      duration: 0.8,
    },
  },
};

export function AnimatedGroup({
  children,
  className,
  delay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
