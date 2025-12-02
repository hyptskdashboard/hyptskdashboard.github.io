import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { WbSunny, NightsStay } from '@mui/icons-material';
import type { MenuData } from '../types';

interface MenuCardProps {
    menu: MenuData;
    isActive: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, isActive }) => {
    return (
        <motion.div
            animate={{
                scale: isActive ? 1 : 0.85,
                opacity: isActive ? 1 : 0.5,
                y: isActive ? 0 : 0,
                filter: isActive ? 'blur(0px)' : 'blur(3px)',
            }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
            <Card
                sx={{
                    width: { xs: 320, sm: 360, md: 380 },
                    minHeight: { xs: 550, sm: 600 },
                    maxHeight: { xs: 650, sm: 700 },
                    borderRadius: 5,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isActive
                        ? '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset, 0 30px 60px -12px rgba(0, 242, 255, 0.15)'
                        : '0 4px 16px 0 rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    }
                }}
            >
                {/* Header */}
                <Box sx={{
                    p: { xs: 2.5, sm: 3 },
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
                    textAlign: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <Typography variant="h5" component="div" sx={{
                        fontWeight: 700,
                        letterSpacing: '-0.5px',
                        fontFamily: '"Outfit", sans-serif',
                        color: '#fff',
                        fontSize: { xs: '1.3rem', sm: '1.5rem' }
                    }}>
                        {menu.day}
                    </Typography>
                    <Typography variant="subtitle2" sx={{
                        opacity: 0.5,
                        letterSpacing: '1.5px',
                        mt: 0.5,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                    }}>
                        {menu.date}
                    </Typography>
                </Box>

                <CardContent sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '10px',
                        margin: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '10px',
                        transition: 'background 0.2s',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(255,255,255,0.25)',
                    },
                }}>

                    {/* Lunch Section */}
                    <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip
                            icon={<WbSunny sx={{ fontSize: { xs: 14, sm: 16 }, color: '#FFD700 !important' }} />}
                            label="SABAH"
                            size="small"
                            sx={{
                                mb: 1.5,
                                bgcolor: 'rgba(255, 215, 0, 0.08)',
                                color: '#FFD700',
                                fontWeight: 700,
                                border: '1px solid rgba(255, 215, 0, 0.2)',
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                letterSpacing: '1px',
                                backdropFilter: 'blur(10px)',
                                px: 2
                            }}
                        />
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                            {menu.breakfast.length > 0 ? menu.breakfast.map((meal, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        textAlign: 'center',
                                        py: 1,
                                        px: 2,
                                        borderRadius: 2,
                                        background: 'rgba(255,255,255,0.02)',
                                        backdropFilter: 'blur(5px)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.05)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'rgba(255,255,255,0.95)',
                                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {meal}
                                    </Typography>
                                </Box>
                            )) : (
                                <Typography variant="body2" sx={{ opacity: 0.3, mt: 2, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                                    Menü bilgisi yok
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    <Divider sx={{
                        borderColor: 'rgba(255,255,255,0.06)',
                        width: '85%',
                        alignSelf: 'center',
                        my: 1
                    }} />

                    {/* Dinner Section */}
                    <Box sx={{ p: { xs: 2, sm: 2.5 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip
                            icon={<NightsStay sx={{ fontSize: { xs: 14, sm: 16 }, color: '#b388ff !important' }} />}
                            label="AKŞAM"
                            size="small"
                            sx={{
                                mb: 1.5,
                                bgcolor: 'rgba(179, 136, 255, 0.08)',
                                color: '#b388ff',
                                fontWeight: 700,
                                border: '1px solid rgba(179, 136, 255, 0.2)',
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                letterSpacing: '1px',
                                backdropFilter: 'blur(10px)',
                                px: 2
                            }}
                        />
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                            {menu.dinner.length > 0 ? menu.dinner.map((meal, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        textAlign: 'center',
                                        py: 1,
                                        px: 2,
                                        borderRadius: 2,
                                        background: 'rgba(255,255,255,0.02)',
                                        backdropFilter: 'blur(5px)',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            background: 'rgba(255,255,255,0.05)',
                                            transform: 'translateY(-1px)'
                                        }
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color: 'rgba(255,255,255,0.95)',
                                            fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {meal}
                                    </Typography>
                                </Box>
                            )) : (
                                <Typography variant="body2" sx={{ opacity: 0.3, mt: 2, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                                    Menü bilgisi yok
                                </Typography>
                            )}
                        </Box>
                    </Box>

                </CardContent>

                {menu.calories && (
                    <Box sx={{
                        p: 1.5,
                        textAlign: 'center',
                        background: 'rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderTop: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <Typography variant="caption" sx={{ opacity: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                            {menu.calories}
                        </Typography>
                    </Box>
                )}
            </Card>
        </motion.div>
    );
};

export default MenuCard;
