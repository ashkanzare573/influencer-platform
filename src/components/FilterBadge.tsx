"use client";

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
  color?: "blue" | "purple" | "green" | "pink" | "red";
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  green: "bg-green-100 text-green-800",
  pink: "bg-pink-100 text-pink-800",
  red: "bg-red-100 text-red-800",
};

export function FilterBadge({ label, value, onRemove, color = "blue" }: FilterBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${colorClasses[color]} text-sm px-3 py-1 rounded-full`}>
      <span>{label}: {value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-full p-0.5 transition-colors cursor-pointer hover:bg-black/10"
        aria-label={`Clear ${label.toLowerCase()} filter`}
      >
        ✕
      </button>
    </span>
  );
}
