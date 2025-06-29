import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const { filename } = params;

  try {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();

    const contentType = ext === '.png' ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
      : ext === '.mp4' ? 'video/mp4'
      : 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (err) {
    console.error('[GET /api/uploads]', err);
    return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
  }
}
