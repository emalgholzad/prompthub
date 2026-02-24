import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await prisma.prompt.findUnique({ where: { slug }, select: { title: true, content: true } });
  if (!prompt) return { title: "Prompt not found" };
  return {
    title: `${prompt.title} | PromptHub`,
    description: prompt.content.slice(0, 140),
  };
}

export default async function PromptDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const prompt = await prisma.prompt.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      likes: session?.user?.id ? { where: { userId: session.user.id }, select: { id: true } } : { where: { id: "" }, select: { id: true } },
    },
  });

  if (!prompt) return notFound();

  const isAuthor = session?.user?.id === prompt.authorId;

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">{prompt.title}</h1>
      <p className="text-sm text-muted-foreground">by {prompt.author.name ?? "Anonymous"} • {formatDate(prompt.createdAt)}</p>
      <pre className="whitespace-pre-wrap rounded-md border p-4 text-sm">{prompt.content}</pre>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{prompt.likeCount} likes</p>
        <div className="flex gap-2">
          <LikeButton promptId={prompt.id} liked={prompt.likes.length > 0} disabled={!session?.user?.id || isAuthor} />
          <ShareButton slug={prompt.slug} />
        </div>
      </div>
    </article>
  );
}
