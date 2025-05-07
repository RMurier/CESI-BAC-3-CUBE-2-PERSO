import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ erreur: 'Identifiant requis' }, { status: 400 });
    }

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const emotionDuJour = await prisma.journalEmotionnel.findFirst({
      where: {
        refUtilisateur: id,
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        emotion: true,
      },
    });

    return NextResponse.json(emotionDuJour ?? null);
  } catch (error: any) {
    console.error('[journal/today]', error);
    return NextResponse.json(
      { erreur: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
