import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Tv,
} from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">

        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003B5C]">
              <Tv className="h-5 w-5 text-white" />
            </div>

            <div>
              <div className="font-serif text-lg font-semibold">
                Texas Adventist TV
              </div>

              <div className="text-xs text-zinc-500">
                Watch. Learn. Grow.
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to TV
          </Link>
        </header>

        <section className="flex flex-1 items-center justify-center pb-24">
          <div className="w-full max-w-md">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-7 shadow-2xl sm:p-9">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003B5C]">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div className="mt-7 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Texas Adventist TV Studio
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight">
                Admin Sign In
              </h1>

              <p className="mt-3 leading-7 text-zinc-400">
                Sign in to manage Texas Adventist TV.
              </p>

              <LoginForm />

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}