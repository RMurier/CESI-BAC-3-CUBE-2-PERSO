import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const roles = [
    { nom: 'Administrateur', description: 'Accès total aux fonctionnalités' },
    { nom: 'Utilisateur', description: 'Rôle par défaut pour nouveaux inscrits' },
  ];

  const emotions = [
    { nom: 'Joie',        description: 'Sensation de bonheur et de plaisir.',       icon: 'smile' },
    { nom: 'Tristesse',   description: 'Sensation de peine ou de mélancolie.',      icon: 'frown' },
    { nom: 'Colère',      description: 'Sentiment de frustration ou d’injustice.',  icon: 'zap' },
    { nom: 'Peur',        description: 'Sensation d’inquiétude ou de danger.',      icon: 'alert-triangle' },
    { nom: 'Surprise',    description: 'Réaction à quelque chose d’inattendu.',     icon: 'bell' },
    { nom: 'Dégoût',      description: 'Répulsion ou rejet face à une situation.',  icon: 'x-circle' },
    { nom: 'Fierté',      description: 'Satisfaction vis-à-vis de soi ou d’autrui.',icon: 'award' },
    { nom: 'Honte',       description: 'Gêne liée à une faute ou une maladresse.',  icon: 'eye-off' },
    { nom: 'Sérénité',    description: 'Calme intérieur et apaisement.',            icon: 'cloud' },
    { nom: 'Stress',      description: 'Tension ou pression mentale.',              icon: 'wind' },
    { nom: 'Amour',       description: 'Affection profonde ou attachement.',        icon: 'heart' },
    { nom: 'Solitude',    description: 'Sensation d’isolement, voulu ou subi.',     icon: 'user' },
    { nom: 'Empathie',    description: 'Partage des émotions d’autrui.',            icon: 'users' },
    { nom: 'Motivation',  description: 'Énergie dirigée vers un objectif.',         icon: 'target' },
    { nom: 'Frustration', description: 'Blocage dans une volonté ou un besoin.',    icon: 'slash' },
  ];  

  for (const role of roles) {
    await prisma.role.upsert({
      where: { nom: role.nom },
      update: {},
      create: role,
    });
  }
  console.log('✅ Seed terminé : Rôles ajoutés avec succès.');

  for(const emotion of emotions){
    await prisma.emotion.upsert({
      where: {nom: emotion.nom, description: emotion.description, icon: emotion.icon},
      update: {},
      create: emotion
    });
  }
  console.log('✅ Seed terminé : Emotions ajoutés avec succès.');


}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
