import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'demo@contentcommand.ai',
      name: 'Demo User',
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Workspace',
      users: {
        connect: { id: user.id },
      },
    },
  });

  await prisma.teamMember.create({
    data: {
      userId: user.id,
      workspaceId: workspace.id,
      role: 'ADMIN',
    },
  });

  await prisma.brandKit.create({
    data: {
      workspaceId: workspace.id,
      name: 'Main Brand',
      hashtags: ['#AI', '#ContentCommand'],
      bannedWords: ['spam', 'buy now'],
    },
  });

  const campaign = await prisma.campaign.create({
    data: {
      workspaceId: workspace.id,
      name: 'Launch Campaign',
      status: 'ACTIVE',
    },
  });

  await prisma.post.create({
    data: {
      workspaceId: workspace.id,
      campaignId: campaign.id,
      content: 'Excited to launch ContentCommand AI today! 🚀 #AI #ContentCommand',
      status: 'PUBLISHED',
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
