import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function CarouselBanner({ data }: { data: any[] }) {
  return (
    <Carousel className="w-full p-0 m-0 h-[500px] z-0">
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem key={index}>
            <div className="">
              <img
                src={item.url}
                alt="Banner"
                className="w-full h-[500px] object-cover"
                height={500}
                width={500}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
