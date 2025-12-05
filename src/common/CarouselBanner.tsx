"use client";

import useEmblaCarousel from "embla-carousel-react";
import React from "react";

type Props = { data: { url: string }[] };

export default function CarouselBanner({ data }: Props) {
  // Embla hook: ref to attach to viewport; emblaApi becomes available once initialized
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // When embla initializes or changes slides, update selected index
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect(); // set initial

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  const goTo = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      // ensure index is within bounds
      const max = emblaApi.scrollSnapList().length - 1;
      const safeIndex = Math.min(Math.max(0, index), max);
      emblaApi.scrollTo(safeIndex);
    },
    [emblaApi]
  );

  if (!data || data.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* === Embla viewport === */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] h-[500px]" // each slide takes full viewport width
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${idx + 1}`}
            >
              <img
                src={item.url}
                alt={`banner-${idx}`}
                className="w-full h-[500px] object-cover"
                width={1200}
                height={500}
              />
            </div>
          ))}
        </div>
      </div>

      {/* === Dots - centered a bit above bottom === */}
      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[6px] w-[6px] rounded-full transition-all duration-200
              ${selectedIndex === i ? "bg-white scale-125" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
