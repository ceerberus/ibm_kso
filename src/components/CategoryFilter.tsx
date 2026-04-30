import { CATEGORIES } from '../data/mockEvents';
import { useEventStore } from '../store/eventStore';

export default function CategoryFilter() {
  const { activeCat, setCategory } = useEventStore();

  return (
    <div>
      <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2 px-1.5 font-syne">
        Categories
      </div>
      <div className="space-y-0.5">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
              activeCat === cat.id
                ? 'bg-sky-50'
                : 'hover:bg-slate-50'
            }`}
          >
            <span className="text-sm w-5 text-center">{cat.emoji}</span>
            <span
              className={`text-[13px] font-medium ${
                activeCat === cat.id ? 'text-primary' : 'text-slate-600'
              }`}
            >
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Made with Bob
