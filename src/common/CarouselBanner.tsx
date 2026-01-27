"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React from "react";

type Props = {
  data: { url: string }[];
  delay?: number;
  autoScroll?: boolean;
};

export default function CarouselBanner({
  data,
  delay = 4000,
  autoScroll = false,
}: Props) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Create plugins array based on autoScroll
  const plugins = React.useMemo(() => {
    if (!autoScroll) return [];
    return [
      Autoplay({
        delay: delay,
        stopOnInteraction: false,
      }),
    ];
  }, [autoScroll, delay]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
    },
    plugins,
  );

  // Handle slide selection
  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Set up event listeners
  React.useEffect(() => {
    if (!emblaApi) return;

    onSelect(); // Set initial index
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = React.useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  if (!data?.length) return null;

  return (
    <div className="relative w-full">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex-[0_0_100%] min-w-0 h-[500px]"
              role="group"
              aria-label={`Slide ${idx + 1} of ${data.length}`}
            >
              <img
                src={item.url}
                className="w-full h-full object-cover"
                alt={`Banner ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {data.length > 1 && (
        <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {data.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : "false"}
              className={`h-[6px] w-[6px] rounded-full transition-all duration-200 ${
                selectedIndex === index ? "bg-white scale-125" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
