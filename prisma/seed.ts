import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@prompthub.dev" },
    update: {},
    create: { email: "demo@prompthub.dev", name: "Demo User" },
  });

  const samples = [
    {
      title: "Summarize Meeting Notes",
      content: "You are an expert executive assistant. Summarize the following notes into key decisions, risks, and action items.",
      slug: "summarize-meeting-notes-seed01",
    },
    {
      title: "Refactor TypeScript Function",
      content: "Refactor the provided TypeScript function for readability and performance while preserving behavior. Include before/after rationale.",
      slug: "refactor-typescript-function-seed02",
    },
    {
      title: "Generate Product Launch Plan",
      content: "Create a 30-day product launch checklist for a SaaS tool with marketing, sales enablement, and analytics milestones.",
      slug: "generate-product-launch-plan-seed03",
    },
  ];

  for (const sample of samples) {
    await prisma.prompt.upsert({
      where: { slug: sample.slug },
      update: {},
      create: {
        ...sample,
        visibility: "PUBLIC",
        authorId: user.id,
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
