import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Divider,
    Chip
} from '@mui/material';
import { Close, Restaurant, Wifi, AccessTime, LocalLaundryService } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoModalProps {
    open: boolean;
    onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ open, onClose }) => {
    const mealTimes = [
        {
            icon: <AccessTime sx={{ fontSize: 20, color: '#FFD700' }} />,
            title: 'Hafta İçi Kahvaltı',
            time: '06:00 - 10:30',
            color: '#FFD700'
        },
        {
            icon: <AccessTime sx={{ fontSize: 20, color: '#00D9FF' }} />,
            title: 'Hafta Sonu Kahvaltı',
            time: '07:00 - 11:00',
            color: '#00D9FF'
        },
        {
            icon: <Restaurant sx={{ fontSize: 20, color: '#b388ff' }} />,
            title: 'Akşam Yemekleri',
            time: '18:00 - 21:00',
            color: '#b388ff'
        }
    ];

    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    open={open}
                    onClose={onClose}
                    maxWidth="sm"
                    fullWidth
                    scroll="paper"
                    PaperProps={{
                        sx: {
                            background: 'rgba(30, 30, 30, 0.95)',
                            backdropFilter: 'blur(40px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            overflow: 'hidden',
                            maxHeight: { xs: '90vh', sm: '80vh' },
                            m: { xs: 1.5, sm: 3 },
                            borderRadius: { xs: 3, sm: 4 },
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pb: 2,
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)'
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                fontFamily: '"Outfit", sans-serif',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            Yurt Bilgileri
                        </Typography>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white'
                                }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent sx={{
                        pt: 3,
                        pb: 4,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '10px',
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
                        {/* Meal Times Section */}
                        <Box sx={{ mt: 2.5, mb: 4 }}>
                            <Chip
                                label="YEMEK SAATLERİ"
                                size="small"
                                sx={{
                                    mb: 2,
                                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                                    color: '#FFD700',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    letterSpacing: '1px',
                                    border: '1px solid rgba(255, 215, 0, 0.2)'
                                }}
                            />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {mealTimes.map((meal, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 2,
                                                borderRadius: 2,
                                                background: 'rgba(255,255,255,0.03)',
                                                backdropFilter: 'blur(5px)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    background: 'rgba(255,255,255,0.05)',
                                                    transform: 'translateX(4px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {meal.icon}
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 500,
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    {meal.title}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: meal.color,
                                                    fontFamily: 'monospace',
                                                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {meal.time}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 3 }} />

                        {/* Internet Section */}
                        <Box>
                            <Chip
                                icon={<Wifi sx={{ fontSize: 14, color: '#00D9FF !important' }} />}
                                label="İNTERNET BAĞLANTISI"
                                size="small"
                                sx={{
                                    mb: 2,
                                    bgcolor: 'rgba(0, 217, 255, 0.1)',
                                    color: '#00D9FF',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    letterSpacing: '1px',
                                    border: '1px solid rgba(0, 217, 255, 0.2)'
                                }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* WiFi Credentials */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(0, 217, 255, 0.05)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(0, 217, 255, 0.15)',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#00D9FF',
                                                mb: 1,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            WiFi Bağlantısı
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.85rem',
                                                fontFamily: 'monospace'
                                            }}
                                        >
                                            Şifre: <strong style={{ color: '#00D9FF' }}>haydarpasa2015</strong>
                                        </Typography>
                                    </Box>

                                    {/* Login Info */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(0, 217, 255, 0.05)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(0, 217, 255, 0.15)',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#00D9FF',
                                                mb: 1,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            İnternet Erişimi
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.85rem',
                                                mb: 1
                                            }}
                                        >
                                            Giriş için: <a
                                                href="http://ns1.google.com/login"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: '#00D9FF', textDecoration: 'none', fontWeight: 600 }}
                                            >
                                                ns1.google.com/login
                                            </a>
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255,255,255,0.5)',
                                                fontSize: '0.75rem',
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            TC ve doğum tarihiniz ile giriş yapın
                                        </Typography>
                                    </Box>

                                    {/* Performance Tip */}
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(0, 217, 255, 0.05)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(0, 217, 255, 0.15)',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                lineHeight: 1.7,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            💡 <strong>İpucu:</strong> En iyi internet deneyimi için <strong>Ethernet</strong> kablosu ile bilgisayarınıza bağlanın.
                                            Ardından bilgisayardan <strong>mobil hotspot</strong> açarak diğer cihazlarınızı bağlayabilirsiniz.
                                        </Typography>
                                    </Box>
                                </Box>
                            </motion.div>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 3 }} />

                        {/* Entry/Exit Hours Section */}
                        <Box sx={{ mb: 4 }}>
                            <Chip
                                label="GİRİŞ-ÇIKIŞ SAATLERİ"
                                size="small"
                                sx={{
                                    mb: 2,
                                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                                    color: '#FF9800',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    letterSpacing: '1px',
                                    border: '1px solid rgba(255, 152, 0, 0.2)'
                                }}
                            />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Weekday */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(255, 152, 0, 0.08)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(255, 152, 0, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                background: 'rgba(255, 152, 0, 0.15)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <AccessTime sx={{ fontSize: 18, color: '#FFB74D' }} />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                Hafta İçi
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#FF9800',
                                                fontFamily: 'monospace',
                                                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            06:00 - 24:00
                                        </Typography>
                                    </Box>
                                </motion.div>

                                {/* Weekend */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(255, 152, 0, 0.08)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(255, 152, 0, 0.3)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 0.75,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                background: 'rgba(255, 152, 0, 0.15)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <AccessTime sx={{ fontSize: 18, color: '#FFB74D' }} />
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 500,
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    Hafta Sonu
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: '#FF9800',
                                                    fontFamily: 'monospace',
                                                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                06:00 - 01:00
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255,255,255,0.6)',
                                                fontSize: '0.75rem',
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            Cuma & Cumartesi: 01:00 • Pazar: 24:00
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 3 }} />

                        {/* Laundry Section */}
                        <Box>
                            <Chip
                                label="ÇAMAŞIR SAATLERİ"
                                size="small"
                                sx={{
                                    mb: 2,
                                    bgcolor: 'rgba(179, 136, 255, 0.1)',
                                    color: '#b388ff',
                                    fontWeight: 700,
                                    fontSize: '0.7rem',
                                    letterSpacing: '1px',
                                    border: '1px solid rgba(179, 136, 255, 0.2)'
                                }}
                            />

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Erkek Bireysel */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(179, 136, 255, 0.08)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(179, 136, 255, 0.35)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                background: 'rgba(179, 136, 255, 0.15)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <LocalLaundryService sx={{ fontSize: 18, color: '#b388ff' }} />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                Erkek Bireysel Yıkama
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#b388ff',
                                                fontWeight: 600,
                                                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Salı • Perşembe • Cumartesi
                                        </Typography>
                                    </Box>
                                </motion.div>

                                {/* Kız Bireysel */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(179, 136, 255, 0.08)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(179, 136, 255, 0.35)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                background: 'rgba(179, 136, 255, 0.15)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <LocalLaundryService sx={{ fontSize: 18, color: '#b388ff' }} />
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                Kız Bireysel Yıkama
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#b388ff',
                                                fontWeight: 600,
                                                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Pazartesi • Çarşamba • Cuma
                                        </Typography>
                                    </Box>
                                </motion.div>

                                {/* Ablaya Yıkatma */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'rgba(179, 136, 255, 0.08)',
                                            backdropFilter: 'blur(5px)',
                                            border: '1px solid rgba(179, 136, 255, 0.35)',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                background: 'rgba(179, 136, 255, 0.15)',
                                                transform: 'translateX(4px)'
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 700,
                                                color: '#b388ff',
                                                mb: 0.5,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            Ablaya Yıkatma
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.85rem',
                                                mb: 0.5
                                            }}
                                        >
                                            Aynı günler geçerlidir
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255,255,255,0.6)',
                                                fontSize: '0.75rem',
                                                fontStyle: 'italic'
                                            }}
                                        >
                                            Teslim: 06:00 - 09:00 arası
                                        </Typography>
                                    </Box>
                                </motion.div>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

export default InfoModal;
