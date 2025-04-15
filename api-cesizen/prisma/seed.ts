import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const roles = [
    { nom: 'Administrateur', description: 'Accès total aux fonctionnalités' },
    { nom: 'Utilisateur', description: 'Rôle par défaut pour nouveaux inscrits' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { nom: role.nom },
      update: {},
      create: role,
    });
  }

  console.log('✅ Seed terminé : Rôles ajoutés avec succès.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
