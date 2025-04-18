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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const {id} = await params;
        const body = await request.json();
        const { nom } = schemaUtilisateur.parse(body);

        const utilisateur = await prisma.utilisateur.update({
            where: { clerkUserId: id },
            data: { nom },
        });

        return NextResponse.json(utilisateur);
    } catch (error: any) {
        return NextResponse.json(
            { erreur: error.message || 'Erreur serveur' },
            { status: 500 }
        );
    }
}
