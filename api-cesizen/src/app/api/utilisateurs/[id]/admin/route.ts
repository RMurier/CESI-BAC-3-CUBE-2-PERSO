import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params

  const user = await prisma.utilisateur.findUnique({
    where: { clerkUserId: id },
    include: { role: true },
  })

  if (!user) {
    return NextResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 })
  }

  const isAdmin = user.role?.nom === 'Administrateur'
  return NextResponse.json({ isAdmin })
}
