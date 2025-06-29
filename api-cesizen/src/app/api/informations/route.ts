import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get('limit');

  const limit = limitParam ? parseInt(limitParam) : undefined;

  try {
    const infos = await prisma.information.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        contenus: true,
      },
    });

    return NextResponse.json(infos);
  } catch (error) {
    console.error('[GET /informations]', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des informations.' },
      { status: 500 }
    );
  }
}
