import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { clerkUserId: string } }
) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { clerkUserId: params.clerkUserId },
    select: { isActive: true },
  });

  if (!utilisateur) {
    return new Response(JSON.stringify({ isActive: false }), { status: 404 });
  }

  return new Response(JSON.stringify({ isActive: utilisateur.isActive }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
