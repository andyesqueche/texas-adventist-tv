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

  thumbnail_url: string | null;
  hero_url: string | null;
  trailer_url: string | null;

  stream_provider: string | null;
  stream_uid: string | null;
  playback_url: string | null;
  stream_status: string | null;

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
  trailer_url: string | null;

  stream_provider: string | null;
  stream_uid: string | null;
  playback_url: string | null;
};