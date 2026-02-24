import type { ReactNode } from "react";

export function DropdownMenu({ trigger, children }: { trigger: ReactNode; children: ReactNode }) {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer">{trigger}</summary>
      <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-md border bg-white p-2 shadow">{children}</div>
    </details>
  );
}
