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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    if ('isActive' in body) {
      const updated = await prisma.exerciceRespiration.update({
        where: { id },
        data: { isActive: body.isActive },
      })
      return NextResponse.json(updated)
    }

    const updatedExercice = await prisma.exerciceRespiration.update({
      where: { id },
      data: {
        nom: body.nom,
        description: body.description,
        bienfait: body.bienfait,
        icone: body.icone,
      },
    })

    await prisma.actionRespiration.deleteMany({
      where: { exerciceId: id },
    })

    await prisma.actionRespiration.createMany({
      data: body.actions.map((a: any) => ({
        exerciceId: id,
        ordre: a.ordre,
        type: a.type,
        dureeSecondes: a.dureeSecondes,
      })),
    })

    return NextResponse.json({ ...updatedExercice, actions: body.actions })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}