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
                    background: 'var(--surface-main)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid var(--border-soft)',
                    borderRadius: 4,
                    boxShadow: 'var(--shadow-strong)',
                    color: 'var(--text-primary)',
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
                    background: 'linear-gradient(180deg, var(--surface-alt) 0%, transparent 100%)',
                    borderBottom: '1px solid var(--border-soft)'
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
                                    color: 'var(--text-primary)',
                                    '&:hover': {
                                        background: 'var(--icon-btn-hover-bg)'
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
                            color: 'var(--text-secondary)',
                            '&:hover': {
                                background: 'var(--surface-hover)',
                                color: 'var(--text-primary)'
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
                        background: 'var(--scrollbar-track)',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'var(--scrollbar-thumb)',
                        borderRadius: '10px',
                        transition: 'background 0.2s',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'var(--scrollbar-thumb-hover)',
                    },
                }}
            >
                {notifications.length === 0 ? (
                    <Typography sx={{ color: 'var(--text-secondary)', textAlign: 'center', py: 4 }}>
                        Şu anda görüntülenecek bildirim yok.
                    </Typography>
                ) : (
                    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {notifications.map((n) => (
                            <ListItem
                                key={n.id}
                                sx={{
                                    background: 'var(--surface-alt)',
                                    backdropFilter: 'blur(5px)',
                                    borderRadius: 2,
                                    border: '1px solid var(--border-soft)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        background: 'var(--surface-hover)',
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
                                                        bgcolor: 'var(--surface-hover)',
                                                        color: 'var(--text-secondary)',
                                                        border: '1px solid var(--border-soft)',
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
                                                color: 'var(--text-secondary)',
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


