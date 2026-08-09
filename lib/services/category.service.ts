import {
  createCategory,
  updateCategory,
  type SaveCategoryInput,
} from "@/lib/repositories/category.repository";

export async function saveCategory(
  values: SaveCategoryInput,
  id?: string
) {
  if (id) {
    return updateCategory(id, values);
  }

  return createCategory(values);
}