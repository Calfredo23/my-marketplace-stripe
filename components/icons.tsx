import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.6 13.6 13.6 20.6a2 2 0 0 1-2.8 0L3.4 13.2a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h7.8a2 2 0 0 1 1.4.6l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 9 9 0 0 1-3.7-.8L3 21l1.9-4.8a8.1 8.1 0 0 1-1.4-4.7A8.4 8.4 0 0 1 12 3.2a8.4 8.4 0 0 1 9 8.3Z" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function ElectronicsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 14a8 8 0 0 1 16 0" />
      <rect x="2.5" y="13.5" width="4" height="7" rx="1.5" />
      <rect x="17.5" y="13.5" width="4" height="7" rx="1.5" />
    </svg>
  );
}

export function FurnitureIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
      <path d="M3 11h18v6H3z" />
      <path d="M5 17v3M19 17v3" />
    </svg>
  );
}

export function ClothingIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2H8Z" />
    </svg>
  );
}

export function BooksIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4Z" />
      <path d="M20 5h-6a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h6Z" />
    </svg>
  );
}

export function SportsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="m6 17 4-9h4l4 9M10 8h4" />
    </svg>
  );
}

export function OtherIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8M12 12v8" />
    </svg>
  );
}
