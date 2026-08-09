import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  description,
  actions,
}: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>

        {description && (
          <p className="mt-2 text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {actions}
    </div>
  );
}