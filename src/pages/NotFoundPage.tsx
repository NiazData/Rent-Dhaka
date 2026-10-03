import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-stone-600">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-4 inline-block text-accent-600 underline">
        Back to home
      </Link>
    </div>
  );
}
