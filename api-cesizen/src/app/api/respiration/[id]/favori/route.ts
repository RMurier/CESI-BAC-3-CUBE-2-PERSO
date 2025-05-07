import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { userId } = await req.json();

    if (!userId || !id) {
      return NextResponse.json({ erreur: 'Paramètres manquants' }, { status: 400 });
    }

    const already = await prisma.favorisRespiration.findUnique({
      where: {
        refUtilisateur_refExerciceRespiration: {
          refUtilisateur: userId,
          refExerciceRespiration: id,
        },
      },
    });

    if (already) {
      return NextResponse.json({ message: 'Déjà en favori' }, { status: 200 });
    }

    await prisma.favorisRespiration.create({
      data: {
        refUtilisateur: userId,
        refExerciceRespiration: id,
      },
    });

    return NextResponse.json({ message: 'Ajouté aux favoris' });
  } catch (err) {
    console.error('[POST /favori]', err);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { userId } = await req.json();

  if (!userId || !id) {
    return NextResponse.json({ erreur: 'Paramètres manquants' }, { status: 400 });
  }

  await prisma.favorisRespiration.delete({
    where: {
      refUtilisateur_refExerciceRespiration: {
        refUtilisateur: userId,
        refExerciceRespiration: id,
      },
    },
  });

  return NextResponse.json({ message: 'Supprimé des favoris' });
}