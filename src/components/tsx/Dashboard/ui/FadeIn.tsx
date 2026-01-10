import { motion } from "framer-motion";
import React from "react";

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

/**
 * FadeIn Component
 *
 * A reusable animation wrapper that fades in its children when they enter the viewport.
 * Supports different entrance directions (up, down, left, right) and custom delays.
 * Powered by framer-motion.
 *
 * @component
 */
export default function FadeIn({ children, delay = 0, direction = "up" }: FadeInProps) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...(direction ? directions[direction] : {})
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0
            }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.5,
                delay,
                ease: "easeOut"
            }}
        >
            {children}
        </motion.div>
    );
}
