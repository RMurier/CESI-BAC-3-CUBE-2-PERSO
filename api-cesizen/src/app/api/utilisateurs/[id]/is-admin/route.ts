import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest, { params }: { params: { id: string } }) {
  const { id } = await params;

  try {
    const user = await prisma.utilisateur.findUnique({
      where: { clerkUserId: id },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const isAdmin = user.role.nom === 'Administrateur';
    return NextResponse.json({isAdmin});
  } catch (error) {
    console.error('[is-admin]', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
