import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getAuth } from '@clerk/nextjs/server';

const schemaUtilisateur = z.object({
    nom: z.string().min(1),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const {id} = await params;
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { clerkUserId: id },
        });

        if (!utilisateur) {
            return NextResponse.json({ erreur: 'Utilisateur non trouvé' }, { status: 404 });
        }

        return NextResponse.json(utilisateur);
    } catch (error) {
        return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  const body = await req.json()

  const dataToUpdate: any = {}

  if (typeof body.nom === 'string') {
    dataToUpdate.nom = body.nom
  }

  if (typeof body.roleId === 'string') {
    dataToUpdate.refRole = body.roleId
  }

  if (typeof body.isActive === 'boolean') {
    dataToUpdate.isActive = body.isActive
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return NextResponse.json(
      { message: 'Aucune donnée valide fournie pour la mise à jour.' },
      { status: 400 }
    )
  }

  try {
    const updatedUser = await prisma.utilisateur.update({
      where: { clerkUserId: id },
      data: dataToUpdate,
      include: { role: true },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}
