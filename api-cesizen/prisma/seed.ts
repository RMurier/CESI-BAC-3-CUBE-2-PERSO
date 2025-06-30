import { PrismaClient, ActionType } from '@prisma/client';
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
  console.log('✅ Seed terminé : Emotions ajoutées avec succès.');

await prisma.information.upsert({
  where: { titre: 'Bienvenue sur CESIZen' },
  update: {},
  create: {
    titre: 'Bienvenue sur CESIZen',
    contenus: {
      create: {
        type: 'TEXTE',
        valeur:
          'CESIZen est votre compagnon de bien-être pour améliorer votre santé mentale au quotidien.',
      },
    },
  },
});

  console.log('✅ Information par défaut ajoutée avec succès.');

  const exercice = await prisma.exerciceRespiration.create({
    data: {
      nom: 'Respiration 4-4-4',
      description: 'Inspirer 4 secondes, retenir 4 secondes, expirer 4 secondes.',
      bienfait: 'Favorise la détente et la concentration.',
      icone: 'wind',
      actions: {
        create: [
          { ordre: 1, type: ActionType.INSPIRER, dureeSecondes: 4 },
          { ordre: 2, type: ActionType.RETENIR, dureeSecondes: 4 },
          { ordre: 3, type: ActionType.EXPIRER, dureeSecondes: 4 },
          { ordre: 4, type: ActionType.INSPIRER, dureeSecondes: 4 },
          { ordre: 5, type: ActionType.RETENIR, dureeSecondes: 4 },
          { ordre: 6, type: ActionType.EXPIRER, dureeSecondes: 4 },
          { ordre: 7, type: ActionType.INSPIRER, dureeSecondes: 4 },
          { ordre: 8, type: ActionType.RETENIR, dureeSecondes: 4 },
          { ordre: 9, type: ActionType.EXPIRER, dureeSecondes: 4 },
        ]
      }
    }
  });
  console.log('✅ Exercice de respiration ajouté avec succès.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
