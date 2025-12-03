import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close, NotificationsActive } from '@mui/icons-material';
import Navbar from './components/Navbar';
import MenuCarousel from './components/MenuCarousel';
import { loadPDF, parseMenuData, mergeMenus } from './utils/pdfParser';
import type { DailyMenu, NotificationItem } from './types';
import { filterActiveNotifications, getReadNotificationIds, markNotificationsRead } from './utils/notifications';

function App() {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const [notificationQueue, setNotificationQueue] = useState<NotificationItem[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const resolveMenuUrls = async (): Promise<{ sabahUrl: string; aksamUrl: string }> => {
          const res = await fetch('/api/files');
          if (!res.ok) {
            throw new Error('PDF dosya listesi alınamadı.');
          }

          const data = (await res.json()) as {
            name: string;
            pathname: string;
            url: string;
            uploadedAt: string;
            size: number;
          }[];

          const pickLatest = (prefix: string) => {
            const filtered = data.filter((f) => f.name.toLowerCase().startsWith(prefix));
            if (filtered.length === 0) return undefined;
            return filtered
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
              )[0].url;
          };

          const sabahFromBlob = pickLatest('sabah_');
          const aksamFromBlob = pickLatest('aksam_');

          if (!sabahFromBlob || !aksamFromBlob) {
            throw new Error('Vercel Blob içinde sabah_*/aksam_* PDF dosyaları bulunamadı.');
          }

          return {
            sabahUrl: sabahFromBlob,
            aksamUrl: aksamFromBlob,
          };
        };

        const { sabahUrl, aksamUrl } = await resolveMenuUrls();

        const [sabahItems, aksamItems] = await Promise.all([
          loadPDF(sabahUrl),
          loadPDF(aksamUrl)
        ]);

        const sabahMenus = parseMenuData(sabahItems, 'breakfast');
        const aksamMenus = parseMenuData(aksamItems, 'dinner');

        const merged = mergeMenus(sabahMenus, aksamMenus);

        if (merged.length === 0) {
          console.warn("No menus parsed. Check PDF format.");
        }

        // Find today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayIndex = merged.findIndex(menu => {
          const menuDate = new Date(menu.date);
          menuDate.setHours(0, 0, 0, 0);
          return menuDate.getTime() === today.getTime();
        });

        setInitialIndex(todayIndex >= 0 ? todayIndex : 0);
        setMenus(merged);
      } catch (error) {
        console.error('Failed to load menus:', error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = (await res.json()) as NotificationItem[];
        const now = new Date();
        const active = filterActiveNotifications(data, now);
        const readIds = new Set(getReadNotificationIds());
        const unreadActive = active.filter(n => !readIds.has(n.id));
        if (unreadActive.length > 0) {
          // En son eklenenden en eskiye doğru sırala
          const sorted = [...unreadActive].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setNotificationQueue(sorted);
          setNotificationOpen(true);
        }
      } catch (e) {
        console.error('Aktif bildirim yüklenemedi', e);
      }
    };
    loadNotifications();
  }, []);

  const handleDismissNotification = () => {
    setNotificationQueue(prev => {
      if (prev.length === 0) {
        setNotificationOpen(false);
        return prev;
      }
      const [current, ...rest] = prev;
      markNotificationsRead([current.id]);
      if (rest.length === 0) {
        setNotificationOpen(false);
      }
      return rest;
    });
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          pt: { xs: 1, sm: 3 },
          pb: { xs: 3, sm: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
          gap: { xs: 2, sm: 3 }
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 1.25, sm: 2.25 },
            zIndex: 10,
            width: '100%',
            maxWidth: 380,
            mx: 'auto'
          }}
        >
          
          <Typography
            variant="subtitle2"
            sx={{
              color: 'var(--text-muted)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              mt: 0.5
            }}
          >
          </Typography>
        </Box>

        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          minHeight: { xs: 0, sm: 480 }
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress
                sx={{
                  color: '#00f2ff',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  }
                }}
                size={60}
                thickness={4}
              />
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Menüler yükleniyor...
              </Typography>
            </Box>
          ) : (
            <MenuCarousel menus={menus} initialIndex={initialIndex} />
          )}
        </Box>
      </Container>

      {notificationQueue.length > 0 && (
        <Dialog
          open={notificationOpen}
          onClose={handleDismissNotification}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'var(--surface-main)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid var(--modal-border)',
              borderRadius: 4,
              boxShadow: 'var(--shadow-strong)',
              color: 'var(--text-primary)',
              m: { xs: 1.5, sm: 3 }
            }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1.5,
              borderBottom: '1px solid var(--border-soft)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NotificationsActive sx={{ color: '#00D9FF' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}
                >
                  {notificationQueue[0].title}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.25,
                    borderRadius: 10,
                  bgcolor: 'var(--surface-hover)',
                  border: '1px solid var(--border-soft)',
                    alignSelf: 'flex-start'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                    color: 'var(--text-secondary)',
                      fontSize: '0.7rem'
                    }}
                  >
                    Eklendi:{' '}
                    {new Intl.DateTimeFormat('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: 'Europe/Istanbul'
                    }).format(new Date(notificationQueue[0].createdAt))}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleDismissNotification}
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
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}
            >
              {notificationQueue[0].message}
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default App;
