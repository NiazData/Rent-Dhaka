export function ComingSoonPage({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-600">Coming Soon</p>
      <h1 className="mt-2 text-2xl font-bold text-stone-900">{title}</h1>
      <p className="mt-2 text-stone-600">{message}</p>
    </div>
  );
}
