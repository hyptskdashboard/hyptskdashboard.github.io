import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import Navbar from './components/Navbar';
import MenuCarousel from './components/MenuCarousel';
import { loadPDF, parseMenuData, mergeMenus } from './utils/pdfParser';
import type { DailyMenu } from './types';

function App() {
  const [menus, setMenus] = useState<DailyMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);

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

  return (
    <>
      <Navbar />

      <Container
        maxWidth="xl"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <Box sx={{ textAlign: 'center', mb: { xs: 1, sm: 2 }, zIndex: 10 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '0 0 30px rgba(0, 242, 255, 0.3)',
              fontFamily: '"Outfit", sans-serif',
              letterSpacing: '-1px',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }
            }}
          >
            Günün Menüsü
          </Typography>
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
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          minHeight: 0
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
    </>
  );
}

export default App;
