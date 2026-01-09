import { useState } from "react";

export default function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const [showFull, setShowFull] = useState(false);

  if (!images || images.length === 0) return null;

  const prev = () =>
    setCurrent((current - 1 + images.length) % images.length);

  const next = () =>
    setCurrent((current + 1) % images.length);

  return (
    <>
      {/* SLIDER */}
      <div className="relative w-full h-[420px] rounded-lg overflow-hidden shadow-lg">
        <img
          src={images[current]}
          alt="property"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setShowFull(true)}
        />

        {/* ARROWS */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded"
            >
              ›
            </button>
          </>
        )}

        {/* COUNTER */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm px-2 py-1 rounded">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* FULLSCREEN MODAL */}
      {showFull && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowFull(false)}
        >
          <img
            src={images[current]}
            alt="fullscreen"
            className="max-h-[90%] max-w-[90%] object-contain"
          />
        </div>
      )}
    </>
  );
}