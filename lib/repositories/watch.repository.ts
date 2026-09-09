import { createClient } from "@/lib/supabase/browser";

export type WatchDailyContentRecord = {
  id: string;
  content_date: string;

  bible_book: string | null;
  bible_chapter: number | null;
  verse_start: number | null;
  verse_end: number | null;

  verse_reference_en: string;
  verse_reference_es: string;
  verse_text_en: string;
  verse_text_es: string;

  prayer_title_en: string;
  prayer_title_es: string;
  prayer_text_en: string;
  prayer_text_es: string;

  is_published: boolean;

  created_at: string;
  updated_at: string;
};

export type SaveWatchDailyContentInput = {
  content_date: string;

  bible_book: string;
  bible_chapter: number;
  verse_start: number;
  verse_end: number | null;

  verse_reference_en: string;
  verse_reference_es: string;
  verse_text_en: string;
  verse_text_es: string;

  prayer_title_en: string;
  prayer_title_es: string;
  prayer_text_en: string;
  prayer_text_es: string;

  is_published: boolean;
};

const dailyContentFields = `
  id,
  content_date,
  bible_book,
  bible_chapter,
  verse_start,
  verse_end,
  verse_reference_en,
  verse_reference_es,
  verse_text_en,
  verse_text_es,
  prayer_title_en,
  prayer_title_es,
  prayer_text_en,
  prayer_text_es,
  is_published,
  created_at,
  updated_at
`;

export async function getWatchDailyContent(): Promise<
  WatchDailyContentRecord[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watch_daily_content")
    .select(dailyContentFields)
    .order("content_date", { ascending: false });

  if (error) {
    console.error("GET WATCH DAILY CONTENT ERROR:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as WatchDailyContentRecord[];
}

export async function getWatchDailyContentById(
  id: string
): Promise<WatchDailyContentRecord> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watch_daily_content")
    .select(dailyContentFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET WATCH DAILY CONTENT BY ID ERROR:", error);
    throw new Error(error.message);
  }

  return data as WatchDailyContentRecord;
}

export async function createWatchDailyContent(
  values: SaveWatchDailyContentInput
): Promise<WatchDailyContentRecord> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watch_daily_content")
    .insert(values)
    .select(dailyContentFields)
    .single();

  if (error) {
    console.error("CREATE WATCH DAILY CONTENT ERROR:", error);
    throw new Error(error.message);
  }

  return data as WatchDailyContentRecord;
}

export async function updateWatchDailyContent(
  id: string,
  values: SaveWatchDailyContentInput
): Promise<WatchDailyContentRecord> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("watch_daily_content")
    .update(values)
    .eq("id", id)
    .select(dailyContentFields)
    .single();

  if (error) {
    console.error("UPDATE WATCH DAILY CONTENT ERROR:", error);
    throw new Error(error.message);
  }

  return data as WatchDailyContentRecord;
}

export async function deleteWatchDailyContent(
  id: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("watch_daily_content")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE WATCH DAILY CONTENT ERROR:", error);
    throw new Error(error.message);
  }
}
