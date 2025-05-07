import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bienfait = searchParams.get('bienfait');

    const exercices = await prisma.exerciceRespiration.findMany({
      where: bienfait
        ? {
            isActive: true,
            bienfait: {
              contains: bienfait,
              mode: 'insensitive',
            },
          }
        : { isActive: true },
      orderBy: { nom: 'asc' },
    });

    return NextResponse.json(exercices);
  } catch (error) {
    console.error('[GET /respiration]', error);
    return NextResponse.json(
      { erreur: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const exercice = await prisma.exerciceRespiration.create({
      data: {
        nom: body.nom,
        description: body.description,
        bienfait: body.bienfait,
        icone: body.icone,
        isActive: true,
        actions: {
          create: body.actions.map((action: any) => ({
            ordre: action.ordre,
            type: action.type,
            dureeSecondes: action.dureeSecondes,
          })),
        },
      },
      include: {
        actions: true,
      },
    })

    return NextResponse.json(exercice)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de l’exercice' },
      { status: 500 }
    )
  }
}