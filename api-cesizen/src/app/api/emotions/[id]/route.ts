import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params
  const body = await req.json()

  const emotion = await prisma.emotion.update({
    where: { id },
    data: {
      nom: body.nom,
      description: body.description,
      icon: body.icon,
      niveau: body.niveau,
    },
  })

  return NextResponse.json(emotion)
}