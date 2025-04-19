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