import React from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const Logo = ({ variant = 'default', color = 'primary', sx = {} }) => {
    const theme = useTheme();

    const isHero = variant === 'hero';
    const isFooter = variant === 'footer';

    const iconSize = isHero ? 64 : 32; // Double checks size
    // Adjust hero font size slightly if needed
    const fontSize = isHero ? '2.5rem' : '1.5rem';

    const textColor = color === 'white' ? 'white' : theme.palette.primary.main;
    const iconColor = color === 'white' ? 'white' : theme.palette.primary.main;

    // Animation Variants
    const containerVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.3, ease: 'easeOut' } },
        tap: { scale: 0.95 }
    };

    const iconVariants = {
        rest: { rotate: 0, scale: 1 },
        hover: {
            rotate: [0, -10, 10, -5, 5, 0],
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: 'easeInOut',
                type: "spring", stiffness: 300
            }
        }
    };

    const textVariants = {
        rest: { x: 0, opacity: 1 },
        hover: {
            x: [0, 2, -2, 0],
            transition: { duration: 0.4, ease: 'easeInOut' }
        }
    };

    const letterContainerVariants = {
        hover: { transition: { staggerChildren: 0.05 } }
    };

    const letterVariants = {
        rest: { y: 0 },
        hover: { y: -3, transition: { duration: 0.2, yoyo: Infinity } } // Simple bounce
    };

    return (
        <motion.div
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={containerVariants}
        >
            <Box
                component={RouterLink}
                to="/"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: isHero ? 2 : 1.5,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    userSelect: 'none',
                    ...sx
                }}
            >
                {/* Icon Container with interactive background for Hero */}
                <motion.div variants={iconVariants}>
                    <Box
                        sx={{
                            color: iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: isHero ? 2.5 : 1,
                            borderRadius: '16px',
                            background: isHero
                                ? `linear-gradient(135deg, ${alpha('#fff', 0.1)} 0%, ${alpha('#fff', 0.05)} 100%)`
                                : 'transparent',
                            backdropFilter: isHero ? 'blur(12px)' : 'none',
                            boxShadow: isHero ? '0 8px 32px rgba(0,0,0,0.15)' : 'none',
                            border: isHero ? `1px solid ${alpha('#fff', 0.2)}` : 'none',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <BookOpen size={iconSize} strokeWidth={isHero ? 2 : 2.5} />
                    </Box>
                </motion.div>

                {/* Text Container */}
                <Box>
                    <Typography
                        variant="h6"
                        component={motion.div}
                        variants={textVariants} // Apply simple shake/move to whole block or letters? Let's keep it simple for block first or try staggered letters if we split string.
                        sx={{
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 800,
                            color: textColor,
                            lineHeight: 1,
                            fontSize: fontSize,
                            letterSpacing: '-0.03em',
                            display: 'flex',
                            flexDirection: 'column',
                            textShadow: isHero ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        {/* Staggered text effect for BookFair */}
                        <Box component={motion.div} variants={letterContainerVariants} sx={{ display: 'flex' }}>
                            {/* Simplified: Treating as one block for now to ensure stability, adding gradient text for Hero */}
                            <Box component="span" sx={{
                                background: isHero ? 'transparent' : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: isHero ? 'border-box' : 'text',
                                WebkitBackgroundClip: isHero ? 'border-box' : 'text',
                                color: isHero ? 'white' : 'transparent',
                                // Fallback for non-text clip browsers or just keep it simple color if requested
                                // Actually let's assume we want solid color for Navbar but gradient for brand feel in other places if supported.
                                // For now, adhere to passed color prop but maybe add a subtle gradient if default primary.
                            }}>
                                BookFair
                            </Box>
                        </Box>

                        {isHero && (
                            <Typography
                                variant="caption"
                                component={motion.p}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                sx={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: alpha('#fff', 0.8),
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    mt: 0.5,
                                    display: 'block'
                                }}
                            >
                                Reservation
                            </Typography>
                        )}
                    </Typography>
                </Box>
            </Box>
        </motion.div>
    );
};

export default Logo;
