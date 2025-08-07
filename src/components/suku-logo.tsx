import { cn } from "@/lib/utils";

export function SukuLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-8", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sukuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <g>
        <path
          d="M 50,10 A 40,40 0 1 1 50,90 A 40,40 0 0 1 50,10"
          fill="none"
          stroke="url(#sukuGradient)"
          strokeWidth="10"
        />
        <circle cx="35" cy="40" r="5" fill="hsl(var(--primary-foreground))" />
        <circle cx="65" cy="40" r="5" fill="hsl(var(--primary-foreground))" />
        <path
          d="M 35 65 Q 50 75, 65 65"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
