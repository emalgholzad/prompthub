"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { createPromptSchema } from "@/lib/validations";
import { createPrompt } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

type FormValues = z.infer<typeof createPromptSchema>;

export function PromptForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(createPromptSchema),
    defaultValues: { visibility: "PUBLIC" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("content", values.content);
      formData.set("visibility", values.visibility);
      await createPrompt(formData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create prompt");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input placeholder="Prompt title" {...register("title")} />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>
      <div>
        <Textarea placeholder="Write your prompt content" rows={8} {...register("content")} />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>
      <div>
        <Select {...register("visibility")}>
          <option value="PUBLIC">Public</option>
          <option value="UNLISTED">Unlisted</option>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create prompt"}</Button>
    </form>
  );
}
