import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  titleAs = "h2",
  description,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  titleAs?: "h1" | "h2";
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const Heading = titleAs;
  return (
    <section id={id} className={`mx-auto max-w-7xl px-6 py-24 ${className}`}>
      {(eyebrow || title || description) && (
        <div className="max-w-3xl mb-12">
          {eyebrow && <span className="chip">{eyebrow}</span>}
          {title && (
            <Heading className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              {title}
            </Heading>
          )}
          {description && (
            <p className="mt-4 text-base md:text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
