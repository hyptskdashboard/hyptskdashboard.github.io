import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close, NotificationsActive } from '@mui/icons-material';
import Navbar from './components/Navbar';
import MenuCarousel from './components/MenuCarousel';
import { loadPDF, parseMenuData, mergeMenus } from './utils/pdfParser';
import type { DailyMenu, NotificationItem } from './types';

function App() {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const sabahUrl = '/files/sabah_aralik.pdf';
        const aksamUrl = '/files/aksam_aralik.pdf';

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
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch('/notifications.json');
        if (!res.ok) return;
        const data = (await res.json()) as NotificationItem[];
        const now = new Date();
        const active = data.filter(n => {
          const startOk = !n.startAt || new Date(n.startAt) <= now;
          const endOk = !n.endAt || new Date(n.endAt) >= now;
          return startOk && endOk;
        });
        if (active.length > 0) {
          // En son ekleneni göster
          const latest = [...active].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          setActiveNotification(latest);
          setNotificationOpen(true);
        }
      } catch (e) {
        console.error('Aktif bildirim yüklenemedi', e);
      }
    };
    loadNotifications();
  }, []);

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
              color: 'rgba(255,255,255,0.4)',
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
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Menüler yükleniyor...
              </Typography>
            </Box>
          ) : (
            <MenuCarousel menus={menus} initialIndex={initialIndex} />
          )}
        </Box>
      </Container>

      {activeNotification && (
        <Dialog
          open={notificationOpen}
          onClose={() => setNotificationOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(30, 30, 30, 0.97)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: 4,
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.7)',
              color: 'white',
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
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NotificationsActive sx={{ color: '#00D9FF' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}
                >
                  {activeNotification.title}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.25,
                    borderRadius: 10,
                    bgcolor: 'rgba(0, 217, 255, 0.08)',
                    border: '1px solid rgba(0, 217, 255, 0.25)',
                    alignSelf: 'flex-start'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#00D9FF',
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
                    }).format(new Date(activeNotification.createdAt))}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={() => setNotificationOpen(false)}
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
          <DialogContent sx={{ pt: 2, pb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}
            >
              {activeNotification.message}
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default App;
