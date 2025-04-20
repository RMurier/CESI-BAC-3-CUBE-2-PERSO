import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await params;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { clerkUserId: userId },
      include: {
        favoris: {
          include: {
            exerciceRespiration: true,
          },
        },
      },
    });

    if (!utilisateur) {
      return NextResponse.json({ erreur: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const favoris = utilisateur.favoris.map((fav) => fav.exerciceRespiration);

    return NextResponse.json(favoris);
  } catch (error) {
    console.error('[GET /users/:id]', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
