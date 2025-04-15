import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { encrypt } from '@/lib/cryptoHandler';

const schemaUtilisateur = z.object({
  email: z.string().email(),
  nom: z.string().min(1),
  motDePasse: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nom, motDePasse } = schemaUtilisateur.parse(body);

    const encryptedEmail = encrypt(email);

    const clerk = await clerkClient();
    
    const utilisateurClerk = await clerk.users.createUser({
      emailAddress: [email],
      password: motDePasse,
    });

    const roleUtilisateur = await prisma.role.findUnique({
      where: { nom: 'Utilisateur' },
    });

    if (!roleUtilisateur) {
      throw new Error('Le rôle par défaut "Utilisateur" est introuvable.');
    }

    const utilisateur = await prisma.utilisateur.create({
      data: {
        clerkUserId: utilisateurClerk.id,
        email: encryptedEmail,
        nom,
        refRole: roleUtilisateur.id,
      },
    });

    return NextResponse.json(
      { id: utilisateur.id, clerkUserId: utilisateur.clerkUserId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur détaillée Clerk :', error.errors || error);
    return NextResponse.json(
      { erreur: error.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
