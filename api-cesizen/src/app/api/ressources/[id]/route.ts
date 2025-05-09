import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params;
    const ressource = await prisma.ressource.findUnique({
      where: { id: id },
      include: {
        likes: true,
      },
    });

    if (!ressource || !ressource.isActive) {
      return NextResponse.json(
        { error: 'Ressource non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: ressource.id,
      title: ressource.title,
      description: ressource.description,
      type: ressource.type,
      url: ressource.url,
      content: ressource.content,
      imagePreviewUrl: ressource.imagePreviewUrl,
      vues: ressource.vues,
      likes: ressource.likes,
      createdAt: ressource.createdAt,
      modifiedAt: ressource.modifiedAt,
      isActive: ressource.isActive,
    });
  } catch (error) {
    console.error('[RESSOURCE_GET_BY_ID]', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}