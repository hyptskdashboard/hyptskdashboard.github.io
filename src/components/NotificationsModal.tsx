import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    Tooltip
} from '@mui/material';
import { Close, NotificationsActive, Add } from '@mui/icons-material';
import type { NotificationItem } from '../types';

interface NotificationsModalProps {
    open: boolean;
    onClose: () => void;
    notifications: NotificationItem[];
    onAddNotification?: () => void;
}

const formatDateTime = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Istanbul'
    }).format(d);
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({ open, onClose, notifications, onAddNotification }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    background: 'rgba(30, 30, 30, 0.95)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    overflow: 'hidden',
                    maxHeight: { xs: '90vh', sm: '80vh' },
                    m: { xs: 1.5, sm: 3 },
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <NotificationsActive sx={{ color: '#00D9FF' }} />
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            fontFamily: '"Outfit", sans-serif',
                            letterSpacing: '-0.5px'
                        }}
                    >
                        Bildirimler
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {onAddNotification && (
                        <Tooltip title="Yeni bildirim ekle">
                            <IconButton
                                onClick={onAddNotification}
                                sx={{
                                    color: 'rgba(0,217,255,0.9)',
                                    '&:hover': {
                                        background: 'rgba(0,217,255,0.15)',
                                        color: '#00D9FF'
                                    }
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Tooltip>
                    )}
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
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
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
                }}
            >
                {notifications.length === 0 ? (
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', py: 4 }}>
                        Şu anda görüntülenecek bildirim yok.
                    </Typography>
                ) : (
                    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {notifications.map((n) => (
                            <ListItem
                                key={n.id}
                                sx={{
                                    background: 'rgba(255,255,255,0.03)',
                                    backdropFilter: 'blur(5px)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,0.07)',
                                        transform: 'translateX(4px)'
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    {n.title}
                                                </Typography>
                                                <Chip
                                                    label={`Eklendi: ${formatDateTime(n.createdAt)}`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(0, 217, 255, 0.08)',
                                                        color: '#00D9FF',
                                                        border: '1px solid rgba(0, 217, 255, 0.25)',
                                                        fontSize: '0.7rem',
                                                        height: 22,
                                                        alignSelf: 'flex-start'
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    }
                                    secondary={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                mt: 1,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {n.message}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NotificationsModal;


