import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { SonnerToaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PromptHub",
  description: "Share and discover great prompts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <SonnerToaster />
      </body>
    </html>
  );
}
