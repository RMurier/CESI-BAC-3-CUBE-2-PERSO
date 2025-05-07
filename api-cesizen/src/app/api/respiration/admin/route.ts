import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const bienfait = searchParams.get('bienfait');
  
      const exercices = await prisma.exerciceRespiration.findMany({
        where: bienfait
          ? {
              bienfait: {
                contains: bienfait,
                mode: 'insensitive',
              },
            }
          : undefined,
        orderBy: { nom: 'asc' },
      });
  
      return NextResponse.json(exercices);
    } catch (error) {
      console.error('[GET /respiration]', error);
      return NextResponse.json(
        { erreur: 'Erreur serveur' },
        { status: 500 }
      );
    }
  }