import { prisma } from '../index.ts';

async function main() {
  console.log('Seeding mock data...');

  // Create a default workspace if it doesn't exist
  let ws = await prisma.workspace.findFirst();
  if (!ws) {
    ws = await prisma.workspace.create({
      data: { id: 'test-ws-id', name: 'Alpha Brand Workspace' }
    });
  }

  const wsId = ws.id;

  // Create some posts
  const postsData: any[] = [
    {
      content: 'Summer 2026 Collection Launch! 🚀 Check out our new sustainable line.',
      status: 'PUBLISHED',
      workspaceId: wsId,
      createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
    },
    {
      content: 'How AI is changing social media marketing in 2026. #AI #Marketing',
      status: 'SCHEDULED',
      workspaceId: wsId,
      scheduledAt: new Date(Date.now() + 3600000 * 24), // Tomorrow
      createdAt: new Date()
    },
    {
      content: 'Weekly Team Highlight: Meet our lead designer, Sarah! 🎨',
      status: 'DRAFT',
      workspaceId: wsId,
      createdAt: new Date()
    },
    {
      content: 'Flash Sale! 24 hours only. Use code FLASH26 for 20% off.',
      status: 'SCHEDULED',
      workspaceId: wsId,
      scheduledAt: new Date(Date.now() + 86400000 * 3), // 3 days from now
      createdAt: new Date()
    }
  ];

  for (const post of postsData) {
    await prisma.post.create({ data: post });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
