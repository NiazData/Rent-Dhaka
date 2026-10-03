export function EmptyListingsState() {
  return (
    <div
      role="status"
      className="rounded-lg border border-dashed border-stone-300 p-8 text-center text-stone-600"
    >
      <p className="font-medium">No listings match your filters.</p>
      <p className="mt-1 text-sm">Try widening your rent range or clearing a filter.</p>
    </div>
  );
}
