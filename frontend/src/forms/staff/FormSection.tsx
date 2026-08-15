import type { ReactNode } from "react";

export default function FormSection({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-cream/10 bg-deep-2/30 p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-cream">{title}</h3>
          {description && <p className="mt-1 text-xs text-cream/45">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
