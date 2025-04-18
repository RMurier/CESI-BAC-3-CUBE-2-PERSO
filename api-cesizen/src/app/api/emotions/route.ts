import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const emotions = await prisma.emotion.findMany();
        return NextResponse.json(emotions);
    }
    catch (ex: any) {
        console.error(ex);
        return NextResponse.json(
            { erreur: ex.message || 'Erreur interne du serveur' },
            { status: 500 }
        )
}
}