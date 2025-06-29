import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
