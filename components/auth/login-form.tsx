"use client";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      const {
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        throw signInError;
      }

      router.replace("/admin");
      router.refresh();

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5"
    >
      {error ? (
        <div className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-300"
        >
          Email
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-300"
          >
            Password
          </label>

          <Link
            href="/forgot-password"
            className="text-xs font-medium text-zinc-500 transition hover:text-white"
          >
            Forgot password?
          </Link>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" />

          <input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-12 pr-12 text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (current) => !current
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 transition hover:text-white"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}