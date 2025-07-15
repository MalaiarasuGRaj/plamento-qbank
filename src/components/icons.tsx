import type { LucideProps } from "lucide-react";

export const Icons = {
    logo: ({ className, ...props }: LucideProps) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="10.5" cy="14.5" r="2.5" />
        <line x1="12.5" y1="16.5" x2="15" y2="19" />
      </svg>
    ),
  };
