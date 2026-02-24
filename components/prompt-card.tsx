import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    slug: string;
    likeCount: number;
    createdAt: Date;
    authorId: string;
    author: { name: string | null };
    likes: { id: string }[];
  };
  userId?: string;
}

export function PromptCard({ prompt, userId }: PromptCardProps) {
  const isAuthor = userId === prompt.authorId;
  const liked = prompt.likes.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg"><Link href={`/p/${prompt.slug}`}>{prompt.title}</Link></CardTitle>
        <p className="text-sm text-muted-foreground">by {prompt.author.name ?? "Anonymous"} • {formatDate(prompt.createdAt)}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{prompt.likeCount} likes</p>
        <div className="flex gap-2">
          <LikeButton promptId={prompt.id} liked={liked} disabled={!userId || isAuthor} />
          <ShareButton slug={prompt.slug} />
        </div>
      </CardContent>
    </Card>
  );
}
