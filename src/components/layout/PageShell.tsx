import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export const PageShell = ({
  title,
  description,
  actions,
  children,
}: PageShellProps) => {
  return (
    <div className="min-h-screen bg-(--background) text-(--foreground)">
      <div className="px-6 pt-28 pb-16">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-(--nav-text)">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-sm sm:text-base text-(--nav-muted)">
                {description}
              </p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};
