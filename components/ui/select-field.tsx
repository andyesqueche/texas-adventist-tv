type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export function SelectField({
  id,
  label,
  value,
  placeholder = "Select an option",
  options,
  required = false,
  disabled = false,
  onChange,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-200"
      >
        {label}
      </label>

      <select
        id={id}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-white outline-none transition focus:border-[#003B5C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}