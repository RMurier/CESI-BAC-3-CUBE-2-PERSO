import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const item = await prisma.journalEmotionnel.findFirst({ where: { id: id }, include: { emotion: true } });
    return item ? NextResponse.json(item) : NextResponse.json({ erreur: 'Not found' }, { status: 404 });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { refEmotion, description } = body;

        if (!refEmotion || !description) {
            return NextResponse.json({ erreur: 'Champs manquants' }, { status: 400 });
        }

        const updated = await prisma.journalEmotionnel.update({
            where: { id },
            data: {
                refEmotion,
                description,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[PATCH /journal/:id]', error);
        return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await prisma.journalEmotionnel.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Supprimé' }, { status: 200 });
}
