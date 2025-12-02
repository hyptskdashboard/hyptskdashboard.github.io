// @ts-nocheck
import { list, put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const NOTIFICATIONS_PATH = 'notifications.json';

async function readNotifications(): Promise<any[]> {
  const { blobs } = await list();
  const existing = blobs.find((b) =>
    b.pathname.toLowerCase().endsWith(NOTIFICATIONS_PATH)
  );
  if (!existing) return [];

  const resp = await fetch(existing.url);
  if (!resp.ok) return [];

  try {
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeNotifications(listData: any[]): Promise<void> {
  const body = JSON.stringify(listData, null, 2);
  await put(NOTIFICATIONS_PATH, Buffer.from(body, 'utf8'), {
    access: 'public',
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { method } = req;

    if (method === 'GET') {
      const listData = await readNotifications();
      res.status(200).json(listData);
      return;
    }

    if (method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const buffer = Buffer.concat(chunks);
      const payload = JSON.parse(buffer.toString('utf8') || '{}');

      const { title, message, startAt, endAt } = payload;
      if (!title || !message || !endAt) {
        res.status(400).send('title, message and endAt are required');
        return;
      }

      const now = new Date();
      const nowIso = now.toISOString();

      const newItem = {
        id: `notif_${now.getTime()}`,
        title: String(title),
        message: String(message),
        startAt: startAt ? String(startAt) : nowIso,
        endAt: String(endAt),
        createdAt: nowIso,
      };

      const listData = await readNotifications();
      listData.push(newItem);
      await writeNotifications(listData);

      res.status(200).json(newItem);
      return;
    }

    res.status(405).send('Method Not Allowed');
  } catch (err) {
    console.error('Error in /api/notifications handler:', err);
    res.status(500).send('Internal Server Error');
  }
}


