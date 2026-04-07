"use client";

interface Category {
  _id: string;
  name: string;
}

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
        style={{
          backgroundColor: !selected ? "var(--bg-header)" : "var(--bg-card)",
          color: !selected ? "var(--text-primary)" : "var(--text-dark)",
          borderColor: "var(--border-light)",
        }}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat._id)}
          className="px-3 py-1.5 rounded-full text-sm font-medium border transition-colors"
          style={{
            backgroundColor: selected === cat._id ? "var(--bg-header)" : "var(--bg-card)",
            color: selected === cat._id ? "var(--text-primary)" : "var(--text-dark)",
            borderColor: "var(--border-light)",
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
