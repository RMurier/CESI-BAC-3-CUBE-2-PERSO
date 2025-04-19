import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(req.url);
    const periode = searchParams.get('periode') || 'week';

    const now = new Date();
    let start: Date;

    switch (periode) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        // semaine
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(now.setDate(diff));
        start.setHours(0, 0, 0, 0);
        break;
    }

    const data = await prisma.journalEmotionnel.groupBy({
      by: ['refEmotion'],
      where: {
        refUtilisateur: userId,
        date: {
          gte: start,
          lte: new Date(),
        },
      },
      _count: true,
    });

    const emotions = await prisma.emotion.findMany({
      where: { id: { in: data.map((d) => d.refEmotion) } },
    });

    const response = data.map((entry) => {
      const emotion = emotions.find((e) => e.id === entry.refEmotion);
      return {
        emotion: emotion?.nom || 'Inconnu',
        icon: emotion?.icon || 'help-circle',
        count: entry._count,
      };
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('[GET /rapport]', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
