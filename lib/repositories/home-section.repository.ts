import { createClient } from "@/lib/supabase/browser";

export type HomeSectionType =
  | "shows"
  | "continue_watching"
  | "latest"
  | "series"
  | "category";

export type HomeCardFormat =
  | "landscape"
  | "portrait";

export type HomeSectionRecord = {
  id: string;

  title: string;
  subtitle: string | null;

  section_type: HomeSectionType;
  source_id: string | null;

  card_format: HomeCardFormat;

  sort_order: number;
  is_visible: boolean;

  created_at: string;
  updated_at: string;
};

export type HomeSeriesOption = {
  id: string;
  title: string;
  orientation:
    | "landscape"
    | "portrait";
};

const homeSectionFields = `
  id,
  title,
  subtitle,
  section_type,
  source_id,
  card_format,
  sort_order,
  is_visible,
  created_at,
  updated_at
`;

function getSupabase() {
  return createClient();
}

// =========================================================
// GET HOME SECTIONS
// =========================================================

export async function getHomeSections(): Promise<
  HomeSectionRecord[]
> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("home_sections")
    .select(homeSectionFields)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error(
      "GET HOME SECTIONS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as HomeSectionRecord[];
}

// =========================================================
// GET AVAILABLE SERIES
// =========================================================

export async function getHomeSeriesOptions(): Promise<
  HomeSeriesOption[]
> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("series")
    .select(`
      id,
      title,
      orientation
    `)
    .eq("published", true)
    .order("title", {
      ascending: true,
    });

  if (error) {
    console.error(
      "GET HOME SERIES OPTIONS ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return (data ?? []) as HomeSeriesOption[];
}

// =========================================================
// ADD SERIES TO HOME
// =========================================================

export async function addSeriesToHome(
  series: HomeSeriesOption
) {
  const supabase = getSupabase();

  // Confirm that the browser client actually
  // has the authenticated admin session.

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error(
      "HOME AUTH ERROR:",
      userError
    );

    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "Your admin session is not available in the browser. Please sign in again."
    );
  }

  const existing =
    await getHomeSections();

  const alreadyExists =
    existing.some(
      (section) =>
        section.section_type ===
          "series" &&
        section.source_id ===
          series.id
    );

  if (alreadyExists) {
    throw new Error(
      "This show is already on the Home page."
    );
  }

  const nextOrder =
    existing.length > 0
      ? Math.max(
          ...existing.map(
            (section) =>
              section.sort_order
          )
        ) + 10
      : 10;

  const { data, error } =
    await supabase
      .from("home_sections")
      .insert({
        title: series.title,

        subtitle: null,

        section_type:
          "series",

        source_id:
          series.id,

        card_format:
          series.orientation,

        sort_order:
          nextOrder,

        is_visible:
          true,
      })
      .select(homeSectionFields)
      .single();

  if (error) {
    console.error(
      "ADD SERIES TO HOME ERROR:",
      error
    );

    throw new Error(error.message);
  }

  return data as HomeSectionRecord;
}

// =========================================================
// VISIBILITY
// =========================================================

export async function updateHomeSectionVisibility(
  id: string,
  isVisible: boolean
) {
  const supabase = getSupabase();

  const { error } =
    await supabase
      .from("home_sections")
      .update({
        is_visible:
          isVisible,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    console.error(
      "UPDATE HOME VISIBILITY ERROR:",
      error
    );

    throw new Error(error.message);
  }
}

// =========================================================
// ORDER
// =========================================================

export async function updateHomeSectionOrder(
  sections: HomeSectionRecord[]
) {
  const supabase = getSupabase();

  const updates =
    sections.map(
      (section, index) => ({
        id:
          section.id,

        sort_order:
          (index + 1) * 10,
      })
    );

  for (const item of updates) {
    const { error } =
      await supabase
        .from("home_sections")
        .update({
          sort_order:
            item.sort_order,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", item.id);

    if (error) {
      console.error(
        "UPDATE HOME ORDER ERROR:",
        error
      );

      throw new Error(
        error.message
      );
    }
  }
}

// =========================================================
// REMOVE SERIES FROM HOME
// =========================================================

export async function removeSeriesFromHome(
  id: string
) {
  const supabase = getSupabase();

  const { error } =
    await supabase
      .from("home_sections")
      .delete()
      .eq("id", id)
      .eq(
        "section_type",
        "series"
      );

  if (error) {
    console.error(
      "REMOVE HOME SERIES ERROR:",
      error
    );

    throw new Error(error.message);
  }
}