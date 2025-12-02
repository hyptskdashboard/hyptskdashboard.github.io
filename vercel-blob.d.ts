declare module '@vercel/blob' {
  export interface BlobItem {
    pathname: string;
    url: string;
    uploadedAt: string;
    size: number;
  }

  export async function list(options?: {
    prefix?: string;
    limit?: number;
  }): Promise<{ blobs: BlobItem[] }>;

  export async function put(
    pathname: string,
    body: Blob | ArrayBuffer | Uint8Array | File,
    options?: { access?: 'public' | 'private' }
  ): Promise<BlobItem>;

  export async function del(pathname: string | string[]): Promise<void>;
}


