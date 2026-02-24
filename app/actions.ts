"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPromptSchema } from "@/lib/validations";
import { promptSlug } from "@/lib/utils";

export async function createPrompt(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createPromptSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    visibility: formData.get("visibility"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid prompt input");
  }

  let slug = promptSlug(parsed.data.title);
  for (let i = 0; i < 3; i++) {
    try {
      const prompt = await prisma.prompt.create({
        data: { ...parsed.data, slug, authorId: session.user.id },
      });
      revalidatePath("/");
      revalidatePath("/dashboard");
      redirect(`/p/${prompt.slug}`);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        slug = promptSlug(parsed.data.title);
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not generate unique slug.");
}

export async function likePrompt(promptId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    const prompt = await tx.prompt.findUnique({ where: { id: promptId }, select: { authorId: true } });
    if (!prompt) throw new Error("Prompt not found");
    if (prompt.authorId === session.user.id) throw new Error("You cannot like your own prompt");

    const existing = await tx.like.findUnique({
      where: { userId_promptId: { userId: session.user.id, promptId } },
    });
    if (existing) return;

    await tx.like.create({ data: { userId: session.user.id, promptId } });
    await tx.prompt.update({ where: { id: promptId }, data: { likeCount: { increment: 1 } } });
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}

export async function unlikePrompt(promptId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: { userId_promptId: { userId: session.user.id, promptId } },
    });

    if (!existing) return;

    await tx.like.delete({ where: { id: existing.id } });
    await tx.prompt.update({ where: { id: promptId }, data: { likeCount: { decrement: 1 } } });
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}
