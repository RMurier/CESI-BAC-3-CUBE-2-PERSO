import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { encrypt } from '@/lib/cryptoHandler';

const schemaUtilisateur = z.object({
  email: z.string().email(),
  nom: z.string().min(1),
  clerkUserId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nom, clerkUserId } = schemaUtilisateur.parse(body);

    const encryptedEmail = encrypt(email);

    const existing = await prisma.utilisateur.findUnique({
      where: { clerkUserId },
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const roleUtilisateur = await prisma.role.findUnique({
      where: { nom: 'Utilisateur' },
    });

    if (!roleUtilisateur) {
      throw new Error('Le rôle par défaut "Utilisateur" est introuvable.');
    }

    const utilisateur = await prisma.utilisateur.create({
      data: {
        clerkUserId,
        email: encryptedEmail,
        nom,
        refRole: roleUtilisateur.id,
      },
    });

    return NextResponse.json(utilisateur, { status: 201 });
  } catch (error: any) {
    console.error('Erreur API /api/utilisateurs:', error);
    return NextResponse.json(
      { erreur: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
