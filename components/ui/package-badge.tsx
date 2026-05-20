import { cn } from "@/lib/utils";

type BadgeVariant = "best_seller" | "new" | "promo";

const variantConfig: Record<BadgeVariant, { label: string; className: string }> = {
  best_seller: {
    label: "Best Seller",
    className: "bg-primary text-primary-foreground",
  },
  new: {
    label: "New",
    className: "bg-accent text-accent-foreground",
  },
  promo: {
    label: "Promo",
    className: "bg-secondary text-secondary-foreground",
  },
};

interface PackageBadgeProps {
  variant: BadgeVariant;
  className?: string;
}

export function PackageBadge({ variant, className }: PackageBadgeProps) {
  const config = variantConfig[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
