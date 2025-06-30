import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  try {
    const info = await prisma.information.findUnique({
      where: { id },
      include: {
        contenus: true,
      },
    });

    if (!info) {
      return NextResponse.json({ error: 'Information introuvable' }, { status: 404 });
    }

    return NextResponse.json(info);
  } catch (error) {
    console.error('[GET /informations/:id]', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l’information.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
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
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      valeur = `/api/uploads/${fileName}`;
    }

    // ⚠️ On supprime les anciens contenus liés
    await prisma.contenuInformation.deleteMany({
      where: { refInformation: id },
    });

    // 🔄 Mise à jour
    const updated = await prisma.information.update({
      where: { id },
      data: {
        titre,
        contenus: {
          create: {
            type,
            valeur,
          },
        },
      },
      include: { contenus: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PUT /informations/:id]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
