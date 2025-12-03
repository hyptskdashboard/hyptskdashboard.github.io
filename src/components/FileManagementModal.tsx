import React, { useEffect, useRef, useState } from 'react';
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
    CircularProgress,
    Tooltip,
    Button
} from '@mui/material';
import { Close, InsertDriveFile, CalendarToday, DeleteForever, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { loadPDFData, parseMenuData } from '../utils/pdfParser';
import type { DailyMenu } from '../types';

interface FileManagementModalProps {
    open: boolean;
    onClose: () => void;
}

interface FileInfo {
    name: string;
    pathname: string;
    url: string;
    date: string;
    size: string;
    type: string;
}

const FileManagementModal: React.FC<FileManagementModalProps> = ({ open, onClose }) => {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/files');
            if (!res.ok) {
                throw new Error('Dosya listesi alınamadı');
            }
            const data = await res.json() as { name: string; pathname: string; url: string; uploadedAt: string; size: number }[];
            const mapped: FileInfo[] = data.map((b) => ({
                name: b.name,
                pathname: b.pathname,
                url: b.url,
                size: formatFileSize(b.size),
                date: formatDate(b.uploadedAt),
                type: 'PDF Dosyası'
            }));
            setFiles(mapped);
        } catch (e) {
            console.error(e);
            setFiles([]);
            setError('Dosyalar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchFiles();
        }
    }, [open]);

    const validatePdfStructure = async (file: File): Promise<boolean> => {
        try {
            const lowerName = file.name.toLowerCase();
            const isBreakfast = lowerName.startsWith('sabah_');
            const isDinner = lowerName.startsWith('aksam_');
            if (!isBreakfast && !isDinner) return false;

            const buffer = await file.arrayBuffer();
            const pages = await loadPDFData(new Uint8Array(buffer));
            if (!pages.length) return false;

            const menus: DailyMenu[] = parseMenuData(pages, isBreakfast ? 'breakfast' : 'dinner');
            return menus.length > 0;
        } catch (e) {
            console.error('PDF doğrulama hatası', e);
            return false;
        }
    };

    const handleDelete = async (file: FileInfo) => {
        if (!confirm(`Bu dosyayı silmek istediğine emin misin?\n${file.name}`)) return;
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/files?pathname=${encodeURIComponent(file.pathname)}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error('Silme işlemi başarısız oldu');
            }
            await fetchFiles();
        } catch (e) {
            console.error(e);
            setError('Dosya silinirken bir hata oluştu.');
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            setError(null);

            if (!file.type.includes('pdf')) {
                setError('Sadece PDF dosyaları yüklenebilir.');
                return;
            }

            const lowerName = file.name.toLowerCase();
            const nameRegex = /^(sabah|aksam)_[a-zçğıöşü]+\.pdf$/i;
            if (!nameRegex.test(lowerName)) {
                setError('Dosya ismi sabah_ayadi veya aksam_ayadi formatında olmalı (örn. sabah_aralik.pdf).');
                return;
            }

            const isValid = await validatePdfStructure(file);
            if (!isValid) {
                setError('PDF içeriği beklenen menü formatında değil.');
                return;
            }

            const res = await fetch(`/api/files?name=${encodeURIComponent(lowerName)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/pdf'
                },
                body: file
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Yükleme başarısız');
            }

            await fetchFiles();
        } catch (e) {
            console.error(e);
            setError('Dosya yüklenirken bir hata oluştu.');
        } finally {
            setUploading(false);
            if (event.target) event.target.value = '';
        }
    };

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
                            background: 'var(--surface-main)',
                            backdropFilter: 'blur(40px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                            border: '1px solid var(--border-soft)',
                            borderRadius: 4,
                            boxShadow: 'var(--shadow-strong)',
                            color: 'var(--text-primary)',
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
                            background: 'linear-gradient(180deg, var(--surface-alt) 0%, transparent 100%)',
                            borderBottom: '1px solid var(--border-soft)'
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Tooltip title="PDF Ekle">
                                <span>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Add />}
                                        onClick={handleAddClick}
                                        disabled={uploading || loading}
                                        sx={{
                                            borderColor: 'var(--border-soft)',
                                            color: 'var(--text-primary)',
                                            textTransform: 'none',
                                            fontSize: '0.8rem',
                                            '&:hover': {
                                                borderColor: 'var(--border-strong)',
                                                background: 'var(--surface-hover)'
                                            }
                                        }}
                                    >
                                        PDF Ekle
                                    </Button>
                                </span>
                            </Tooltip>
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

                    <DialogContent sx={{ pt: 3, pb: 4 }}>
                        <input
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {error && (
                            <Typography sx={{ color: '#f97373', mb: 2, fontSize: '0.8rem' }}>
                                {error}
                            </Typography>
                        )}
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
                                                    background: 'var(--surface-alt)',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid var(--border-soft)',
                                                    borderRadius: 2,
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        background: 'var(--surface-hover)',
                                                        transform: 'translateX(4px)'
                                                    }
                                                }}
                                                secondaryAction={
                                                    <Tooltip title="Sil">
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() => handleDelete(file)}
                                                            sx={{
                                                                color: '#ef5350',
                                                                '&:hover': {
                                                                    background: 'rgba(239,83,80,0.15)'
                                                                }
                                                            }}
                                                        >
                                                            <DeleteForever />
                                                        </IconButton>
                                                    </Tooltip>
                                                }
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
                                                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
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
                                                                        bgcolor: 'var(--surface-hover)',
                                                                        color: 'var(--text-secondary)'
                                                                    }}
                                                                />
                                                                <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                                    {file.type}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'var(--text-muted)' }}>
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
                                    <Typography sx={{ color: 'var(--text-muted)', textAlign: 'center', py: 4 }}>
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
