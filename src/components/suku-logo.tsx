import { cn } from "@/lib/utils";

export function SukuLogo({
  className,
  isSmiling = false,
}: {
  className?: string;
  isSmiling?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-8 suku-blink", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sukuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))" }} />
        </linearGradient>
      </defs>
      <g>
        <path
          d="M 50,10 A 40,40 0 1 1 50,90 A 40,40 0 0 1 50,10"
          fill="none"
          stroke="url(#sukuGradient)"
          strokeWidth="10"
        />
        <circle
          className="suku-eye"
          cx="35"
          cy="40"
          r="5"
          fill="hsl(var(--primary-foreground))"
          style={{ animationDelay: '0s' }}
        />
        <circle
          className="suku-eye"
          cx="65"
          cy="40"
          r="5"
          fill="hsl(var(--primary-foreground))"
          style={{ animationDelay: '0.2s' }}
        />
        <path
          d={isSmiling ? "M 35 60 Q 50 80, 65 60" : "M 35 65 Q 50 75, 65 65"}
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{ transition: 'd 0.3s' }}
        />
      </g>
    </svg>
  );
}
