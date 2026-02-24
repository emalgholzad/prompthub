import { redirect } from "next/navigation";
import { PromptForm } from "@/components/prompt-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function NewPromptPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <PromptForm />
      </CardContent>
    </Card>
  );
}
