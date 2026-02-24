"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton({ slug }: { slug: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        const url = `${window.location.origin}/p/${slug}`;
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }}
    >
      Share
    </Button>
  );
}
