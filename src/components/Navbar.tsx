import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Badge } from '@mui/material';
import { InfoOutlined, FolderOpen, NotificationsNone } from '@mui/icons-material';
import InfoModal from './InfoModal';
import FileManagementModal from './FileManagementModal';
import NotificationsModal from './NotificationsModal';
import type { NotificationItem } from '../types';
import { filterActiveNotifications, getReadNotificationIds, markNotificationsRead } from '../utils/notifications';

const Navbar: React.FC = () => {
    const [infoOpen, setInfoOpen] = useState(false);
    const [filesOpen, setFilesOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const res = await fetch('/notifications.json');
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

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    background: 'rgba(20, 20, 20, 0.7)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: { xs: 56, sm: 64 },
                        px: { xs: 1.5, sm: 2 },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                fontFamily: '"Outfit", sans-serif',
                                letterSpacing: '-0.5px',
                                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '1rem', sm: '1.3rem' }
                            }}
                        >
                            TSK Haydarpaşa Yurdu
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <IconButton
                            onClick={() => setNotificationsOpen(true)}
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                width: { xs: 36, sm: 40 },
                                height: { xs: 36, sm: 40 },
                                '& svg': { fontSize: { xs: 18, sm: 20 } },
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
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
                                color: 'rgba(255,255,255,0.9)',
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                width: { xs: 36, sm: 40 },
                                height: { xs: 36, sm: 40 },
                                '& svg': { fontSize: { xs: 18, sm: 20 } },
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <FolderOpen />
                        </IconButton>

                        <IconButton
                            onClick={() => setInfoOpen(true)}
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                width: { xs: 36, sm: 40 },
                                height: { xs: 36, sm: 40 },
                                '& svg': { fontSize: { xs: 18, sm: 20 } },
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                },
                                transition: 'all 0.2s'
                            }}
                        >
                            <InfoOutlined />
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
            />
        </>
    );
};

export default Navbar;
