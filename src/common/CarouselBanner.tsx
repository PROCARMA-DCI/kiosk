"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

type Props = {
  data: { url: string }[];
  delay?: number; // autoplay delay (ms)
  autoScroll?: boolean; // ON / OFF
};

export default function CarouselBanner({
  data,
  delay = 4000,
  autoScroll = false,
}: Props) {
  // Create autoplay plugin only when enabled
  const autoplay = React.useRef(
    Autoplay(
      {
        delay,
        stopOnInteraction: false,
        stopOnMouseEnter: true, // optional UX improvement
      },
      // @ts-ignore
      (emblaRoot) => emblaRoot.parentElement,
    ),
  );

  const plugins = autoScroll ? [autoplay.current] : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
    },
    plugins,
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Update selected dot
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  // Update autoplay delay dynamically
  React.useEffect(() => {
    if (!autoScroll || !emblaApi) return;

    autoplay.current?.reset();
  }, [delay, autoScroll, emblaApi]);

  const goTo = (index: number) => emblaApi?.scrollTo(index);

  if (!data?.length) return null;
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
                className="w-full h-full object-cover"
                alt={`banner-${idx}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* === Dots - centered a bit above bottom === */}
      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {data &&
          data.length > 1 &&
          data.map((_, i) => (
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
