import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

export async function Header() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">PromptHub</Link>
        <div className="flex items-center gap-3">
          {session?.user?.id && <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>}
          {session?.user?.id ? (
            <DropdownMenu
              trigger={<Avatar image={session.user.image} name={session.user.name} />}
            >
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" size="sm" className="w-full">Sign out</Button>
              </form>
            </DropdownMenu>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button type="submit">Sign in with Google</Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
