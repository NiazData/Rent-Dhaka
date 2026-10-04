import { getTestimonials } from "../lib/content-repository";

export function TestimonialsList() {
  const testimonials = getTestimonials();

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {testimonials.map((testimonial) => (
        <blockquote key={testimonial.id} className="rounded-lg border border-stone-200 p-4">
          <p className="text-stone-700">"{testimonial.quote}"</p>
          <footer className="mt-2 text-sm font-medium text-stone-900">{testimonial.name}</footer>
        </blockquote>
      ))}
    </div>
  );
}
