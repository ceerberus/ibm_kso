import CategoryFilter from './CategoryFilter';

export default function Sidebar() {
  return (
    <div className="hidden md:block w-48 bg-white border-r border-gray-200 p-3.5 flex-shrink-0">
      <CategoryFilter />
    </div>
  );
}

// Made with Bob
