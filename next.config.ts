import type { NextConfig } from "next";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("===== SUPABASE BUILD CHECK =====");

console.log(
  "SUPABASE URL:",
  supabaseUrl ?? "MISSING"
);

console.log(
  "ANON KEY EXISTS:",
  Boolean(supabaseKey)
);

console.log(
  "ANON KEY LENGTH:",
  supabaseKey?.length ?? 0
);

console.log(
  "ANON KEY PREFIX:",
  supabaseKey
    ? supabaseKey.substring(0, 6)
    : "MISSING"
);

console.log(
  "ANON KEY SUFFIX:",
  supabaseKey
    ? supabaseKey.substring(
        supabaseKey.length - 6
      )
    : "MISSING"
);

console.log(
  "HAS LEADING/TRAILING SPACES:",
  supabaseKey
    ? supabaseKey !== supabaseKey.trim()
    : false
);

console.log("===============================");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "gxazdlhmsbrcdtoarrzy.supabase.co",
      },
    ],
  },
};

export default nextConfig;