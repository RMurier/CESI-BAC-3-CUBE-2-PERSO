import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { clerkUserId: string } }) {
    const { clerkUserId } = await params;
    const item = await prisma.journalEmotionnel.findMany({ where: { refUtilisateur: clerkUserId }, include: { emotion: true } });
    return item ? NextResponse.json(item) : NextResponse.json({ erreur: 'Not found' }, { status: 404 });
}

export async function POST(req: NextRequest, { params }: { params: { clerkUserId: string } }) {
    const body = await req.json();
    const { clerkUserId } = await params;
    const updated = await prisma.journalEmotionnel.create({
        data: body,
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await prisma.journalEmotionnel.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Supprimé' });
}
