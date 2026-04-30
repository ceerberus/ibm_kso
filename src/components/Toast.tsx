import { useEventStore } from '../store/eventStore';

export default function Toast() {
  const { toastMessage, showToast } = useEventStore();

  if (!showToast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-dark text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
        {toastMessage}
      </div>
    </div>
  );
}

// Made with Bob
