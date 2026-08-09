import { supabase } from "@/lib/supabase/client";

export type LiveBroadcastRecord = {
  id: string;

  title: string;
  subtitle: string | null;
  description: string | null;

  thumbnail_url: string | null;
  hero_url: string | null;

  playback_url: string | null;

  scheduled_start: string | null;
  scheduled_end: string | null;

  status:
    | "draft"
    | "scheduled"
    | "starting_soon"
    | "live"
    | "replay"
    | "ended";

  featured: boolean;
  published: boolean;

  display_order: number;

  created_at: string;
  updated_at: string;
};

export type SaveLiveBroadcastInput = {
  title: string;
  subtitle: string;
  description: string;

  thumbnail_url: string | null;
  hero_url: string | null;

  playback_url: string | null;

  scheduled_start: string | null;
  scheduled_end: string | null;

  status: LiveBroadcastRecord["status"];

  featured: boolean;
  published: boolean;

  display_order: number;
};

const liveFields = `
  id,
  title,
  subtitle,
  description,
  thumbnail_url,
  hero_url,
  playback_url,
  scheduled_start,
  scheduled_end,
  status,
  featured,
  published,
  display_order,
  created_at,
  updated_at
`;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return String(error);
}

export async function getLiveBroadcasts(): Promise<
  LiveBroadcastRecord[]
> {
  try {
    const { data, error } = await supabase
      .from("live_broadcasts")
      .select(liveFields)
      .order("display_order", {
        ascending: true,
      })
      .order("scheduled_start", {
        ascending: false,
        nullsFirst: false,
      });

    if (error) {
      console.error(
        "GET LIVE BROADCASTS SUPABASE ERROR:",
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      throw new Error(error.message);
    }

    return (data ?? []) as LiveBroadcastRecord[];
  } catch (error) {
    console.error(
      "GET LIVE BROADCASTS FETCH ERROR:",
      getErrorMessage(error)
    );

    throw error;
  }
}

export async function getLiveBroadcastById(
  id: string
): Promise<LiveBroadcastRecord> {
  try {
    const { data, error } = await supabase
      .from("live_broadcasts")
      .select(liveFields)
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "GET LIVE BROADCAST SUPABASE ERROR:",
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      throw new Error(error.message);
    }

    return data as LiveBroadcastRecord;
  } catch (error) {
    console.error(
      "GET LIVE BROADCAST FETCH ERROR:",
      getErrorMessage(error)
    );

    throw error;
  }
}

export async function createLiveBroadcast(
  values: SaveLiveBroadcastInput
): Promise<LiveBroadcastRecord> {
  try {
    const { data, error } = await supabase
      .from("live_broadcasts")
      .insert({
        title: values.title.trim(),

        subtitle:
          values.subtitle.trim() || null,

        description:
          values.description.trim() || null,

        thumbnail_url:
          values.thumbnail_url,

        hero_url:
          values.hero_url,

        playback_url:
          values.playback_url,

        scheduled_start:
          values.scheduled_start,

        scheduled_end:
          values.scheduled_end,

        status:
          values.status,

        featured:
          values.featured,

        published:
          values.published,

        display_order:
          values.display_order,
      })
      .select(liveFields)
      .single();

    if (error) {
      console.error(
        "CREATE LIVE BROADCAST SUPABASE ERROR:",
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      throw new Error(error.message);
    }

    return data as LiveBroadcastRecord;
  } catch (error) {
    console.error(
      "CREATE LIVE BROADCAST FETCH ERROR:",
      getErrorMessage(error)
    );

    throw error;
  }
}

export async function updateLiveBroadcast(
  id: string,
  values: SaveLiveBroadcastInput
): Promise<LiveBroadcastRecord> {
  try {
    const { data, error } = await supabase
      .from("live_broadcasts")
      .update({
        title: values.title.trim(),

        subtitle:
          values.subtitle.trim() || null,

        description:
          values.description.trim() || null,

        thumbnail_url:
          values.thumbnail_url,

        hero_url:
          values.hero_url,

        playback_url:
          values.playback_url,

        scheduled_start:
          values.scheduled_start,

        scheduled_end:
          values.scheduled_end,

        status:
          values.status,

        featured:
          values.featured,

        published:
          values.published,

        display_order:
          values.display_order,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select(liveFields)
      .single();

    if (error) {
      console.error(
        "UPDATE LIVE BROADCAST SUPABASE ERROR:",
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      throw new Error(error.message);
    }

    return data as LiveBroadcastRecord;
  } catch (error) {
    console.error(
      "UPDATE LIVE BROADCAST FETCH ERROR:",
      getErrorMessage(error)
    );

    throw error;
  }
}

export async function deleteLiveBroadcast(
  id: string
): Promise<void> {
  try {
    console.log(
      "DELETE LIVE BROADCAST ID:",
      id
    );

    const { data, error } = await supabase
      .from("live_broadcasts")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      console.error(
        "DELETE LIVE BROADCAST SUPABASE ERROR:",
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );

      throw new Error(error.message);
    }

    console.log(
      "DELETE LIVE BROADCAST RESULT:",
      data
    );

    if (!data || data.length === 0) {
      throw new Error(
        "Supabase did not delete the broadcast."
      );
    }
  } catch (error) {
    console.error(
      "DELETE LIVE BROADCAST FETCH ERROR:",
      getErrorMessage(error)
    );

    throw error;
  }
}