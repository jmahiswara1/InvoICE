import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, description, children }: SectionHeaderProps) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
