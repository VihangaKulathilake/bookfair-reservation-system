import React from 'react';
import { motion } from 'framer-motion';

const ScrollAnimation = ({ children, variants, delay = 0, ...props }) => {
    const defaultVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
                delay: delay
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }} // Trigger animation when element is 100px into the viewport
            variants={variants || defaultVariants}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default ScrollAnimation;
