import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShareButton } from "@/components/share-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const prompts = await prisma.prompt.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Prompts</h1>
        <Link className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" href="/dashboard/new">New Prompt</Link>
      </div>
      <div className="space-y-2">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="font-medium">{prompt.title}</p>
              <p className="text-sm text-muted-foreground">{prompt.visibility} • {prompt.likeCount} likes</p>
            </div>
            <ShareButton slug={prompt.slug} />
          </div>
        ))}
      </div>
    </section>
  );
}
