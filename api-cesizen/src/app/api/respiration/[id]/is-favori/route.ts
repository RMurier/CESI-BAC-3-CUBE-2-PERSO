import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user');

    if (!id || !userId) {
      return NextResponse.json({ erreur: 'Paramètres manquants' }, { status: 400 });
    }

    const favori = await prisma.favorisRespiration.findUnique({
      where: {
        refUtilisateur_refExerciceRespiration: {
          refUtilisateur: userId,
          refExerciceRespiration: id,
        },
      },
    });

    return NextResponse.json({ isFavori: !!favori });
  } catch (err) {
    console.error('[GET /is-favori]', err);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
