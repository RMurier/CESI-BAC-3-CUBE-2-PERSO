import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const exercice = await prisma.exerciceRespiration.findUnique({
      where: { id },
      include: {
        actions: {
          orderBy: { ordre: 'asc' },
        },
      },
    });

    if (!exercice) {
      return NextResponse.json({ erreur: 'Exercice non trouvé' }, { status: 404 });
    }

    return NextResponse.json(exercice);
  } catch (err) {
    console.error('[GET /respiration/:id]', err);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
