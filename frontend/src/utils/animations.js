/**
 * Animation Variants
 * Reusable Framer Motion animation configurations
 */

export const shakeVariant = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};
