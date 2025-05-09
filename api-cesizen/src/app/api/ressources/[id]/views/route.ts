import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params;
    const ressource = await prisma.ressource.update({
      where: { id: id },
      data: { vues: { increment: 1 } },
      select: { id: true, vues: true },
    });

    return NextResponse.json(ressource);
  } catch (error) {
    console.error('[INCREMENT_VIEW]', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
