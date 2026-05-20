import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  as?: React.ElementType;
}

export function SectionWrapper({
  children,
  className,
  innerClassName,
  as: Tag = "section",
}: SectionWrapperProps) {
  return (
    <Tag className={cn("w-full py-16 md:py-24", className)}>
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        {children}
      </div>
    </Tag>
  );
}
