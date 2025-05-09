import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const ressources = await prisma.ressource.findMany({
      where: { isActive: true },
      include: { likes: true },
    });

    const sorted = ressources
      .sort((a, b) => {
        const likeDiff = b.likes.length - a.likes.length;
        if (likeDiff !== 0) return likeDiff;
        return b.vues - a.vues;
      })
      .slice(0, 10);

    return NextResponse.json(sorted);
  } catch (error) {
    console.error("[RESSOURCES_GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, content } = body;

    const newRessource = await prisma.ressource.create({
      data: {
        title,
        description,
        content,
        type: "HTML",
      },
    });

    return NextResponse.json(newRessource, { status: 201 });
  } catch (error) {
    console.error("[RESSOURCES_POST]", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}
