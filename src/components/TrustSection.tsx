export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="bg-stone-50 px-4 py-12">
      <div className="mx-auto max-w-6xl text-center">
        <h2 id="trust-heading" className="text-2xl font-bold text-stone-900">
          Why Customers Trust Us
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-accent-700">8+</p>
            <p className="mt-1 text-sm text-stone-600">Years serving Dhaka renters</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent-700">500+</p>
            <p className="mt-1 text-sm text-stone-600">Verified properties managed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent-700">4.8/5</p>
            <p className="mt-1 text-sm text-stone-600">Average tenant satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}
