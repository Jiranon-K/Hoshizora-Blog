"use client";

import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1], // spring-like ease
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const imageVariants = {
  hidden: { scale: 1.08, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 0.3,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function HeroBackground({ children, style, className }) {
  return (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      animate="visible"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function HeroContent({ children, className }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroBadge({ children, className }) {
  return (
    <motion.div variants={badgeVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function HeroTitle({ children, className }) {
  return (
    <motion.h1 variants={titleVariants} className={className}>
      {children}
    </motion.h1>
  );
}

export function HeroDescription({ children, className }) {
  return (
    <motion.div variants={descriptionVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function HeroCTA({ children, className }) {
  return (
    <motion.div variants={ctaVariants} className={className}>
      {children}
    </motion.div>
  );
}
