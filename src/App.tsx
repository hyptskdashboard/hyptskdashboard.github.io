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
    </>
  );
}

export default App;
