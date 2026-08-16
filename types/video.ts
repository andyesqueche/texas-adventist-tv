export type VideoRecord = {
  id: string;

  title: string;
  subtitle: string | null;
  slug: string | null;
  description: string | null;

  category: string | null;
  series_id: string | null;

  featured: boolean;
  published: boolean;

  display_order: number;

  thumbnail_url: string | null;
  hero_url: string | null;

  // Legacy trailer field.
  // Keep it temporarily for compatibility.
  trailer_url: string | null;

  // Trailer — Cloudflare Stream
  trailer_stream_uid: string | null;
  trailer_playback_url: string | null;
  trailer_stream_status: string | null;

  // Full Video — existing system
  stream_provider: string | null;
  stream_uid: string | null;
  playback_url: string | null;
  stream_status: string | null;

  created_at: string;
  updated_at: string;
};

export type SaveVideoInput = {
  title: string;
  subtitle: string;
  slug: string;
  description: string;

  category: string;
  series_id: string | null;

  published: boolean;
  featured: boolean;

  thumbnail_url: string | null;
  hero_url: string | null;

  // Legacy trailer field.
  // Keep it temporarily for compatibility.
  trailer_url: string | null;

  // Trailer — Cloudflare Stream
  trailer_stream_uid: string | null;
  trailer_playback_url: string | null;
  trailer_stream_status: string | null;

  // Full Video — existing system
  stream_provider: string | null;
  stream_uid: string | null;
  playback_url: string | null;
};