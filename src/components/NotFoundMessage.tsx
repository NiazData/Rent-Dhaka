export function NotFoundMessage({ heading, message }: { heading: string; message: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-stone-900">{heading}</h1>
      <p className="mt-2 text-stone-600">{message}</p>
    </div>
  );
}
