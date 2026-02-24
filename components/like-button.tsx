"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { likePrompt, unlikePrompt } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function LikeButton({ promptId, liked, disabled }: { promptId: string; liked: boolean; disabled: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled || pending}
      onClick={() => {
        startTransition(async () => {
          try {
            if (liked) {
              await unlikePrompt(promptId);
              toast.success("Removed like");
            } else {
              await likePrompt(promptId);
              toast.success("Liked prompt");
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Like failed");
          }
        });
      }}
    >
      {liked ? "Unlike" : "Like"}
    </Button>
  );
}
