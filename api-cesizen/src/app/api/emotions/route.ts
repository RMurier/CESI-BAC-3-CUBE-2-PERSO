import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const emotions = await prisma.emotion.findMany();
    return NextResponse.json(emotions);
  } catch (ex: any) {
    console.error(ex);
    return NextResponse.json(
      { erreur: ex.message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  const body = await req.json();
  const emotion = await prisma.emotion.create({
    data: {
      nom: body.nom,
      description: body.description,
      icon: body.icon,
      niveau: body.niveau,
    },
  });

  return NextResponse.json(emotion);
}


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
