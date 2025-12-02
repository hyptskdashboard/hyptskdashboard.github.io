import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { motion, AnimatePresence, useMotionValue, type PanInfo } from 'framer-motion';
import MenuCard from './MenuCard';
import type { DailyMenu } from '../types';

interface MenuCarouselProps {
    menus: DailyMenu[];
    initialIndex?: number;
}

const MenuCarousel: React.FC<MenuCarouselProps> = ({ menus, initialIndex = 0 }) => {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [direction, setDirection] = useState(0);
    const dragX = useMotionValue(0);

    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % menus.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + menus.length) % menus.length);
    };

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // If dragged more than 50px or fast swipe
        if (Math.abs(offset) > 50 || Math.abs(velocity) > 500) {
            if (offset > 0) {
                handlePrev();
            } else {
                handleNext();
            }
        }
    };

    if (menus.length === 0) {
        return (
            <Box sx={{ color: 'white', textAlign: 'center', py: 4 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Menü yükleniyor...
                </motion.div>
            </Box>
        );
    }

    const prevIndex = (activeIndex - 1 + menus.length) % menus.length;
    const nextIndex = (activeIndex + 1) % menus.length;

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.85,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.85
        })
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                position: 'relative',
                perspective: '1500px',
                overflow: 'hidden',
                touchAction: 'pan-y pinch-zoom'
            }}
        >
            {/* Navigation Buttons */}
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: { xs: 8, sm: 20, md: 40 },
                    zIndex: 20,
                    color: 'white',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: { xs: 36, sm: 44 },
                    height: { xs: 36, sm: 44 },
                    '&:hover': {
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.15)',
                    },
                    transition: 'all 0.2s'
                }}
            >
                <ArrowBackIosNew sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </IconButton>

            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: { xs: 8, sm: 20, md: 40 },
                    zIndex: 20,
                    color: 'white',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    width: { xs: 36, sm: 44 },
                    height: { xs: 36, sm: 44 },
                    '&:hover': {
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.15)',
                    },
                    transition: 'all 0.2s'
                }}
            >
                <ArrowForwardIos sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </IconButton>

            {/* Carousel Container */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    width: '100%',
                    minHeight: { xs: 600, sm: 700 },
                    px: { xs: 1, sm: 2 }
                }}
            >
                {/* Previous Card (Peek) - Hidden on mobile */}
                <Box sx={{
                    position: 'absolute',
                    left: { xs: '45%', sm: '48%', md: '50%' },
                    transform: { xs: 'translateX(-140%) scale(0.75)', sm: 'translateX(-150%) scale(0.8)', md: 'translateX(-160%) scale(0.85)' },
                    opacity: 0.3,
                    zIndex: 0,
                    display: { xs: 'none', sm: 'block' },
                    pointerEvents: 'none'
                }}>
                    <MenuCard menu={menus[prevIndex].menu} isActive={false} />
                </Box>

                {/* Active Card with drag */}
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={activeIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.3 }
                        }}
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            x: dragX,
                            cursor: 'grab'
                        }}
                        whileTap={{ cursor: 'grabbing' }}
                    >
                        <MenuCard menu={menus[activeIndex].menu} isActive={true} />
                    </motion.div>
                </AnimatePresence>

                {/* Next Card (Peek) - Hidden on mobile */}
                <Box sx={{
                    position: 'absolute',
                    right: { xs: '45%', sm: '48%', md: '50%' },
                    transform: { xs: 'translateX(140%) scale(0.75)', sm: 'translateX(150%) scale(0.8)', md: 'translateX(160%) scale(0.85)' },
                    opacity: 0.3,
                    zIndex: 0,
                    display: { xs: 'none', sm: 'block' },
                    pointerEvents: 'none'
                }}>
                    <MenuCard menu={menus[nextIndex].menu} isActive={false} />
                </Box>
            </Box>
        </Box>
    );
};

export default MenuCarousel;
