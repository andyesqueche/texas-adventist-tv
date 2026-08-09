type InformationSectionProps = {
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  description: string;

  showCategoryField?: boolean;

  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

export function InformationSection({
  title,
  subtitle,
  slug,
  category,
  description,
  showCategoryField = true,
  onTitleChange,
  onSubtitleChange,
  onSlugChange,
  onCategoryChange,
  onDescriptionChange,
}: InformationSectionProps) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
      <h2 className="mb-6 text-xl font-semibold">
        General Information
      </h2>

      <div className="space-y-5">
        <TextField
          id="title"
          label="Title"
          required
          value={title}
          placeholder="Title"
          onChange={onTitleChange}
        />

        <TextField
          id="subtitle"
          label="Subtitle"
          value={subtitle}
          placeholder="Subtitle"
          onChange={onSubtitleChange}
        />

        <TextField
          id="slug"
          label="Slug"
          required
          value={slug}
          placeholder="content-slug"
          onChange={onSlugChange}
        />

        {showCategoryField ? (
          <TextField
            id="category"
            label="Category"
            value={category}
            placeholder="Bible Studies"
            onChange={onCategoryChange}
          />
        ) : null}

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
            placeholder="Short description"
            onChange={(event) =>
              onDescriptionChange(event.target.value)
            }
            className="h-40 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none transition focus:border-[#003B5C]"
          />
        </div>
      </div>
    </section>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function TextField({
  id,
  label,
  value,
  placeholder,
  required = false,
  onChange,
}: TextFieldProps) {
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
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none transition focus:border-[#003B5C]"
      />
    </div>
  );
}