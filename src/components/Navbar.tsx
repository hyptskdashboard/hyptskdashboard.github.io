import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { InfoOutlined, FolderOpen } from '@mui/icons-material';
import InfoModal from './InfoModal';
import FileManagementModal from './FileManagementModal';

const Navbar: React.FC = () => {
    const [infoOpen, setInfoOpen] = useState(false);
    const [filesOpen, setFilesOpen] = useState(false);

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
                <Toolbar sx={{ justifyContent: 'space-between' }}>
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
                                fontSize: { xs: '1.1rem', sm: '1.3rem' }
                            }}
                        >
                            TSK Haydarpaşa Yurdu
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={() => setFilesOpen(true)}
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255,255,255,0.1)',
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

            {/* Spacer to prevent content from going under navbar */}
            <Toolbar />

            <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
            <FileManagementModal open={filesOpen} onClose={() => setFilesOpen(false)} />
        </>
    );
};

export default Navbar;
