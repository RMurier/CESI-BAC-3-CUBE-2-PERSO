import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get('limit');

  const limit = limitParam ? parseInt(limitParam) : undefined;

  try {
    const infos = await prisma.information.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        contenus: true,
      },
    });

    return NextResponse.json(infos);
  } catch (error) {
    console.error('[GET /informations]', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des informations.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const titre = form.get('titre')?.toString();
    const type = form.get('type')?.toString();

    if (!titre || !type) {
      return NextResponse.json({ error: 'Titre et type requis' }, { status: 400 });
    }

    let valeur = '';

    if (type === 'TEXTE') {
      valeur = form.get('valeur')?.toString() || '';
      if (!valeur) {
        return NextResponse.json({ error: 'Contenu texte requis' }, { status: 400 });
      }
    } else {
      const file = form.get('file') as File;
      if (!file) {
        return NextResponse.json({ error: 'Fichier requis' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'uploads');

      await fs.mkdir(uploadDir, { recursive: true }); // assure que le dossier existe
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      valeur = `/api/uploads/${fileName}`; // lien API public vers le fichier
    }

    const info = await prisma.information.create({
      data: {
        titre,
        contenus: {
          create: {
            type,
            valeur,
          },
        },
      },
      include: {
        contenus: true,
      },
    });

    return NextResponse.json(info, { status: 201 });
  } catch (error) {
    console.error('[POST /informations]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
