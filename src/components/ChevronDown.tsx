interface ChevronDownProps {
  isOpen: boolean;
  className?: string;
}

export function ChevronDown({ isOpen, className = "" }: ChevronDownProps) {
  return (
    <svg
      className={`w-5 h-5 text-gray-400 pointer-events-none transition-transform duration-200 ${
        isOpen ? "rotate-180" : ""
      } ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
