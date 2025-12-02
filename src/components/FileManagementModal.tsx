import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    CircularProgress
} from '@mui/material';
import { Close, InsertDriveFile, CalendarToday } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface FileManagementModalProps {
    open: boolean;
    onClose: () => void;
}

interface FileInfo {
    name: string;
    date: string;
    size: string;
    type: string;
}

const FileManagementModal: React.FC<FileManagementModalProps> = ({ open, onClose }) => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Bilinmiyor';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    useEffect(() => {
        if (open) {
            const fetchFileMetadata = async () => {
                setLoading(true);
                const fileNames = ['sabah_aralik.pdf', 'aksam_aralik.pdf'];
                const fileData: FileInfo[] = [];

                for (const name of fileNames) {
                    try {
                        const response = await fetch(`/files/${name}`, { method: 'HEAD' });
                        if (response.ok) {
                            const size = parseInt(response.headers.get('Content-Length') || '0', 10);
                            const lastModified = response.headers.get('Last-Modified');

                            fileData.push({
                                name: name,
                                size: formatFileSize(size),
                                date: formatDate(lastModified),
                                type: 'PDF Dosyası'
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching metadata for ${name}`, error);
                    }
                }
                setFiles(fileData);
                setLoading(false);
            };

            fetchFileMetadata();
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
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
                            m: { xs: 2, sm: 3 }
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
                            Yüklü Menü Dosyaları
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

                    <DialogContent sx={{ pt: 3, pb: 4 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress sx={{ color: '#00f2ff' }} />
                            </Box>
                        ) : (
                            <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {files.length > 0 ? (
                                    files.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <ListItem
                                                sx={{
                                                    background: 'rgba(255,255,255,0.03)',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        background: 'rgba(255,255,255,0.05)',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <Box
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: '12px',
                                                            background: 'rgba(244, 67, 54, 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#ef5350'
                                                        }}
                                                    >
                                                        <InsertDriveFile />
                                                    </Box>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                                                            {file.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Chip
                                                                    label={file.size}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20,
                                                                        fontSize: '0.7rem',
                                                                        bgcolor: 'rgba(255,255,255,0.1)',
                                                                        color: 'rgba(255,255,255,0.7)'
                                                                    }}
                                                                />
                                                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                                    {file.type}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
                                                                <CalendarToday sx={{ fontSize: 14 }} />
                                                                <Typography variant="caption">
                                                                    {file.date}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))
                                ) : (
                                    <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 4 }}>
                                        Hiç dosya bulunamadı.
                                    </Typography>
                                )}
                            </List>
                        )}
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

export default FileManagementModal;
