import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  testid?: string;
}

export function PageHeader({ icon: Icon, title, description, action, testid }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4" data-testid={testid}>
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage-light">
          <Icon className="h-5 w-5 text-terracotta" />
        </span>
        <div>
          <h1 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
