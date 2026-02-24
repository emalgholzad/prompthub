import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PromptCard } from "@/components/prompt-card";

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? "1") || 1);
  const limit = 20;

  const prompts = await prisma.prompt.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * limit,
    take: limit,
    include: {
      author: { select: { name: true } },
      likes: session?.user?.id ? { where: { userId: session.user.id }, select: { id: true } } : { where: { id: "" }, select: { id: true } },
    },
  });

  const total = await prisma.prompt.count({ where: { visibility: "PUBLIC" } });
  const hasNext = currentPage * limit < total;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Latest Public Prompts</h1>
      <div className="space-y-4">
        {prompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} userId={session?.user?.id} />)}
      </div>
      <div className="flex gap-3">
        {currentPage > 1 && <a className="text-sm underline" href={`/?page=${currentPage - 1}`}>Previous</a>}
        {hasNext && <a className="text-sm underline" href={`/?page=${currentPage + 1}`}>Next</a>}
      </div>
    </section>
  );
}
