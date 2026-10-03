import { useState, type KeyboardEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SWIPE_THRESHOLD_PX = 50;

export function PhotoGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  function goPrev() {
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }

  function goNext() {
    setIndex((i) => (i + 1) % photos.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") goPrev();
    if (event.key === "ArrowRight") goNext();
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    setTouchStartX(event.touches[0].clientX);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (deltaX <= -SWIPE_THRESHOLD_PX) goNext();
    if (deltaX >= SWIPE_THRESHOLD_PX) goPrev();
    setTouchStartX(null);
  }

  return (
    <div
      role="group"
      aria-label="Photo gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <img
        src={photos[index]}
        alt={`${alt} photo ${index + 1} of ${photos.length}`}
        className="h-96 w-full rounded-lg object-cover"
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <div className="mt-2 flex gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo}
            type="button"
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-accent-600" : "bg-stone-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
