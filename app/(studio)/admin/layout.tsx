import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { StudioSidebar } from "@/components/studio/studio-sidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function StudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <StudioSidebar />

      <main className="min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}