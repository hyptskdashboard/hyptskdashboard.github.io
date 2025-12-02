// @ts-nocheck
import { list, put, del } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const pdfNameRegex = /^(sabah|aksam)_[a-zçğıöşü]+\.pdf$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { method } = req;

    if (method === 'GET') {
      // Tüm blobları listeleyip sadece PDF olanları döndür
      const { blobs } = await list();
      const files = blobs
        .filter((b) => b.pathname.toLowerCase().endsWith('.pdf'))
        .map((b) => ({
          name: b.pathname.split('/').pop() || b.pathname,
          pathname: b.pathname,
          url: b.url,
          uploadedAt: b.uploadedAt,
          size: b.size,
        }));
      res.status(200).json(files);
      return;
    }

    if (method === 'POST') {
      const nameParam = String(req.query.name || '').toLowerCase();
      if (!nameParam) {
        res.status(400).send('name query param is required');
        return;
      }

      if (!pdfNameRegex.test(nameParam)) {
        res.status(400).send('Invalid filename format');
        return;
      }

      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }

      const buffer = Buffer.concat(chunks);

      // Basit bir PDF kontrolü: header'da %PDF var mı?
      if (!buffer.slice(0, 1024).toString('utf8').includes('%PDF')) {
        res.status(400).send('Only PDF files are allowed');
        return;
      }

      const lowerName = nameParam;
      if (!pdfNameRegex.test(lowerName)) {
        res.status(400).send('Invalid filename format');
        return;
      }

      const blob = await put(`files/${lowerName}`, buffer, {
        access: 'public',
      });

      res.status(200).json(blob);
      return;
    }

    if (method === 'DELETE') {
      const pathname = String(req.query.pathname || '');
      if (!pathname) {
        res.status(400).send('pathname query param is required');
        return;
      }

      await del(pathname);
      res.status(200).send('Deleted');
      return;
    }

    res.status(405).send('Method Not Allowed');
  } catch (err) {
    console.error('Error in /api/files handler:', err);
    res.status(500).send('Internal Server Error');
  }
}

