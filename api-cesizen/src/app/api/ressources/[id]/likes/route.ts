import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { idUtilisateur } = await req.json();

  if (!idUtilisateur || typeof idUtilisateur !== 'string') {
    return NextResponse.json({ error: 'Utilisateur requis' }, { status: 400 });
  }

  try {
    const existingLike = await prisma.ressourceLike.findUnique({
      where: {
        refRessource_refUtilisateur: {
          refRessource: params.id,
          refUtilisateur: idUtilisateur,
        },
      },
    });

    if (existingLike) {
      await prisma.ressourceLike.delete({
        where: {
          refRessource_refUtilisateur: {
            refRessource: params.id,
            refUtilisateur: idUtilisateur,
          },
        },
      });

      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.ressourceLike.create({
        data: {
          refRessource: params.id,
          refUtilisateur: idUtilisateur,
        },
      });

      return NextResponse.json({ success: true, liked: true });
    }
  } catch (error) {
    console.error('[RESSOURCE_LIKE_TOGGLE]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
