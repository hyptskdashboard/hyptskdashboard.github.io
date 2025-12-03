import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge, Dialog, DialogTitle, DialogContent, TextField, Button, Stack } from '@mui/material';
import { InfoOutlined, FolderOpen, NotificationsNone, LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';
import InfoModal from './InfoModal';
import FileManagementModal from './FileManagementModal';
import NotificationsModal from './NotificationsModal';
import type { NotificationItem } from '../types';
import { filterActiveNotifications, getReadNotificationIds, markNotificationsRead } from '../utils/notifications';
import { useThemeMode } from '../theme/ThemeProvider';

const Navbar: React.FC = () => {
    const [infoOpen, setInfoOpen] = useState(false);
    const [filesOpen, setFilesOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [newEndAt, setNewEndAt] = useState('');
    const [savingNotification, setSavingNotification] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { mode, toggleMode } = useThemeMode();
    const isDarkMode = mode === 'dark';

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const res = await fetch('/api/notifications');
                if (!res.ok) return;
                const data = (await res.json()) as NotificationItem[];
                setNotifications(data);

                const now = new Date();
                const active = filterActiveNotifications(data, now);
                const readIds = new Set(getReadNotificationIds());
                const unreadActive = active.filter(n => !readIds.has(n.id));
                setUnreadCount(unreadActive.length);
            } catch (e) {
                console.error('Bildirimler yüklenemedi', e);
            }
        };
        loadNotifications();
    }, []);

    const handleCreateNotification = async () => {
        if (!newTitle.trim() || !newMessage.trim() || !newEndAt) return;
        try {
            setSavingNotification(true);
            const endIso = new Date(newEndAt).toISOString();

            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTitle.trim(),
                    message: newMessage.trim(),
                    endAt: endIso
                })
            });

            if (!res.ok) {
                console.error('Bildirim eklenemedi', await res.text());
                return;
            }

            // Listeyi tazele
            await (async () => {
                try {
                    const resList = await fetch('/api/notifications');
                    if (!resList.ok) return;
                    const data = (await resList.json()) as NotificationItem[];
                    setNotifications(data);

                    const now = new Date();
                    const active = filterActiveNotifications(data, now);
                    const readIds = new Set(getReadNotificationIds());
                    const unreadActive = active.filter(n => !readIds.has(n.id));
                    setUnreadCount(unreadActive.length);
                } catch (e) {
                    console.error('Bildirimler tekrar yüklenemedi', e);
                }
            })();

            setAddModalOpen(false);
            setNewTitle('');
            setNewMessage('');
            setNewEndAt('');
        } catch (e) {
            console.error(e);
        } finally {
            setSavingNotification(false);
        }
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'var(--navbar-bg)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: '1px solid var(--navbar-border)',
                    boxShadow: 'var(--shadow-strong)',
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: { xs: 56, sm: 64 },
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 }, minWidth: 0, flexShrink: 1 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                fontFamily: '"Outfit", sans-serif',
                                letterSpacing: '-0.5px',
                            color: 'var(--text-primary)',
                                fontSize: { xs: '0.95rem', sm: '1.3rem' },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            TSK Haydarpaşa Yurdu
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: { xs: 0.4, sm: 0.75 }, flexShrink: 0 }}>
                        <IconButton
                            onClick={() => setNotificationsOpen(true)}
                            sx={{
                                color: 'var(--text-primary)',
                                background: 'var(--icon-btn-bg)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid var(--icon-btn-border)',
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                '& svg': { fontSize: { xs: 16, sm: 20 } },
                                '&:hover': {
                                    background: 'var(--icon-btn-hover-bg)',
                                    border: '1px solid var(--border-strong)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <Badge
                                color="error"
                                badgeContent={unreadCount > 0 ? unreadCount : undefined}
                                overlap="circular"
                            >
                                <NotificationsNone />
                            </Badge>
                        </IconButton>

                        <IconButton
                            onClick={() => setFilesOpen(true)}
                            sx={{
                                color: 'var(--text-primary)',
                                background: 'var(--icon-btn-bg)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid var(--icon-btn-border)',
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                '& svg': { fontSize: { xs: 16, sm: 20 } },
                                '&:hover': {
                                    background: 'var(--icon-btn-hover-bg)',
                                    border: '1px solid var(--border-strong)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <FolderOpen />
                        </IconButton>

                        <IconButton
                            onClick={() => setInfoOpen(true)}
                            sx={{
                                color: 'var(--text-primary)',
                                background: 'var(--icon-btn-bg)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid var(--icon-btn-border)',
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                '& svg': { fontSize: { xs: 16, sm: 20 } },
                                '&:hover': {
                                    background: 'var(--icon-btn-hover-bg)',
                                    border: '1px solid var(--border-strong)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <InfoOutlined />
                        </IconButton>

                        <IconButton
                            onClick={toggleMode}
                            aria-label="Tema değiştir"
                            sx={{
                                color: 'var(--text-primary)',
                                background: 'var(--icon-btn-bg)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid var(--icon-btn-border)',
                                width: { xs: 32, sm: 40 },
                                height: { xs: 32, sm: 40 },
                                '& svg': { fontSize: { xs: 16, sm: 20 } },
                                '&:hover': {
                                    background: 'var(--icon-btn-hover-bg)',
                                    border: '1px solid var(--border-strong)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            {isDarkMode ? (
                                <LightModeOutlined />
                            ) : (
                                <DarkModeOutlined />
                            )}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Toolbar sx={{ minHeight: { xs: 40, sm: 52 } }} />

            <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
            <FileManagementModal open={filesOpen} onClose={() => setFilesOpen(false)} />
            <NotificationsModal
                open={notificationsOpen}
                onClose={() => {
                    setNotificationsOpen(false);
                    if (notifications.length) {
                        markNotificationsRead(notifications.map(n => n.id));
                        setUnreadCount(0);
                    }
                }}
                notifications={notifications}
                onAddNotification={() => setAddModalOpen(true)}
            />

            <Dialog
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
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
                        color: 'var(--text-primary)'
                    }
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 2,
                        borderBottom: '1px solid var(--border-soft)'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}
                    >
                        Yeni Bildirim
                    </Typography>
                    <IconButton
                        onClick={() => setAddModalOpen(false)}
                        sx={{
                            color: 'var(--text-secondary)',
                            '&:hover': {
                                background: 'var(--surface-hover)',
                                color: 'var(--text-primary)'
                            }
                        }}
                    >
                        <InfoOutlined />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 1.25, pb: 3 }}>
                    <Stack
                        spacing={2}
                        sx={{
                            mt: 1.25,
                            '& .MuiInputBase-root': {
                                color: 'var(--text-primary)',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'var(--text-secondary)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border-soft)',
                            },
                            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border-strong)',
                            },
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--text-primary)',
                            },
                        }}
                    >
                        <TextField
                            label="Başlık"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Mesaj"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                            size="small"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Bitiş Zamanı"
                            type="datetime-local"
                            value={newEndAt}
                            onChange={(e) => setNewEndAt(e.target.value)}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1.5 }}>
                            <Button
                                onClick={() => setAddModalOpen(false)}
                                disabled={savingNotification}
                                color="inherit"
                            >
                                Vazgeç
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCreateNotification}
                                disabled={savingNotification || !newTitle.trim() || !newMessage.trim() || !newEndAt}
                                sx={{
                                    background: 'linear-gradient(135deg, var(--button-gradient-from), var(--button-gradient-to))',
                                    color: '#ffffff !important',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, var(--button-gradient-from), var(--button-gradient-to))',
                                        opacity: 0.9
                                    }
                                }}
                            >
                                Kaydet
                            </Button>
                        </Box>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Navbar;
