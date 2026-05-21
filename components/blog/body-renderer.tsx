import { cn } from "@/lib/utils";

interface Props {
  body: string;
  className?: string;
}

export function BodyRenderer({ body, className }: Props) {
  const isHtml = /<[a-z][\s\S]*>/i.test(body);

  if (isHtml) {
    // Body is HTML from Tiptap — render directly.
    // Content comes from trusted admin input only.
    return (
      <div
        className={cn("blog-body", className)}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  // Plain text fallback: split on blank lines → paragraphs
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className={cn("blog-body space-y-5", className)}>
      {paragraphs.map((para, i) => (
        <p key={i} className="leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  );
}
