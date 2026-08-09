import { supabase } from "@/lib/supabase/client";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type SaveCategoryInput = {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  display_order: number;
  published: boolean;
};

const categoryFields = `
  id,
  name,
  slug,
  description,
  color,
  icon,
  display_order,
  published,
  created_at,
  updated_at
`;

export async function getCategories(): Promise<
  CategoryRecord[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select(categoryFields)
    .order("display_order")
    .order("name");

  if (error) {
    console.error("GET CATEGORIES ERROR:", error);
    throw new Error(error.message);
  }

  return data as CategoryRecord[];
}

export async function getPublishedCategoryOptions(): Promise<
  CategoryOption[]
> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("published", true)
    .order("display_order")
    .order("name");

  if (error) {
    console.error("GET CATEGORY OPTIONS ERROR:", error);
    throw new Error(error.message);
  }

  return data as CategoryOption[];
}

export async function getCategoryById(
  id: string
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .select(categoryFields)
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET CATEGORY ERROR:", error);
    throw new Error(error.message);
  }

  return data as CategoryRecord;
}

export async function createCategory(
  values: SaveCategoryInput
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description:
        values.description.trim() || null,
      color: values.color.trim() || "#003B5C",
      icon: values.icon.trim() || null,
      display_order: values.display_order,
      published: values.published,
    })
    .select(categoryFields)
    .single();

  if (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    throw new Error(error.message);
  }

  return data as CategoryRecord;
}

export async function updateCategory(
  id: string,
  values: SaveCategoryInput
): Promise<CategoryRecord> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description:
        values.description.trim() || null,
      color: values.color.trim() || "#003B5C",
      icon: values.icon.trim() || null,
      display_order: values.display_order,
      published: values.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(categoryFields)
    .single();

  if (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    throw new Error(error.message);
  }

  return data as CategoryRecord;
}

export async function deleteCategory(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    throw new Error(error.message);
  }
}