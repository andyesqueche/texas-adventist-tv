"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { saveCategory } from "@/lib/services/category.service";

type CategoryFormProps = {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    display_order: number;
    published: boolean;
  };
};

export function CategoryForm({
  initialData,
}: CategoryFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [name, setName] = useState(
    initialData?.name ?? ""
  );

  const [slug, setSlug] = useState(
    initialData?.slug ?? ""
  );

  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );

  const [color, setColor] = useState(
    initialData?.color ?? "#003B5C"
  );

  const [icon, setIcon] = useState(
    initialData?.icon ?? ""
  );

  const [displayOrder, setDisplayOrder] = useState(
    initialData?.display_order ?? 0
  );

  const [published, setPublished] = useState(
    initialData?.published ?? true
  );

  const [saving, setSaving] = useState(false);

  function handleNameChange(value: string) {
    setName(value);

    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setSlug(generatedSlug);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }

    try {
      setSaving(true);

      await saveCategory(
        {
          name,
          slug,
          description,
          color,
          icon,
          display_order: displayOrder,
          published,
        },
        initialData?.id
      );

      toast.success(
        isEditing
          ? "Category updated successfully."
          : "Category created successfully."
      );

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      console.error("SAVE CATEGORY ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Category Information
        </h2>

        <div className="space-y-5">
          <Field
            id="name"
            label="Name"
            value={name}
            placeholder="Bible Studies"
            required
            onChange={handleNameChange}
          />

          <Field
            id="slug"
            label="Slug"
            value={slug}
            placeholder="bible-studies"
            required
            onChange={setSlug}
          />

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-zinc-200"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe this category."
              className="h-36 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="color"
                className="text-sm font-medium text-zinc-200"
              >
                Color
              </label>

              <div className="flex gap-3">
                <input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(event) =>
                    setColor(event.target.value)
                  }
                  className="h-12 w-16 rounded-lg border border-zinc-700 bg-zinc-900 p-1"
                />

                <input
                  type="text"
                  value={color}
                  onChange={(event) =>
                    setColor(event.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
                />
              </div>
            </div>

            <Field
              id="icon"
              label="Icon"
              value={icon}
              placeholder="book-open"
              onChange={setIcon}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="display-order"
              className="text-sm font-medium text-zinc-200"
            >
              Display Order
            </label>

            <input
              id="display-order"
              type="number"
              min={0}
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(
                  Number(event.target.value)
                )
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Publishing
        </h2>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(event) =>
              setPublished(event.target.checked)
            }
            className="h-4 w-4"
          />

          <span>Published</span>
        </label>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-[#003B5C] px-6 py-3 font-semibold text-white transition hover:bg-[#004d78] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving
          ? "Saving..."
          : isEditing
            ? "Update Category"
            : "Save Category"}
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function Field({
  id,
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-200"
      >
        {label}
      </label>

      <input
        id={id}
        type="text"
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none focus:border-[#003B5C]"
      />
    </div>
  );
}