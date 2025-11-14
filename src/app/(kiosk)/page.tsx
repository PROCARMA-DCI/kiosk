"use client";

import BackButton from "@/common/BackButton";
import CarouselBanner from "@/common/CarouselBanner";
import FeatureCardKaos from "@/common/FeatureCard";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, useContext } from "react";
import { KaosContext } from "./layout";
const KaosHomePage = () => {
  const { bannerData, globalLoading }: any = useContext(KaosContext);

  return (
    <Suspense fallback={<ScreenLoader />}>
      <BackButton backRoute="/" />
      {/* <VideoPlayer url={"https://player.vimeo.com/video/1122886183"} /> */}

      <div>
        {globalLoading ? (
          <Skeleton className="h-[500px] " />
        ) : (
          <>
            {Array.isArray(bannerData?.carousal) ? (
              <CarouselBanner data={bannerData?.carousal} />
            ) : (
              <div className="h-[500px] bg-gray-500 w-full flex justify-center items-center">
                <h1 className="text-2xl font-bold text-white">
                  No data available
                </h1>
              </div>
            )}
          </>
        )}

        {/* Feature Card */}
        <div className="flex mx-[50px]  -mt-20">
          <FeatureCardKaos />
        </div>
      </div>
    </Suspense>
  );
};

export default KaosHomePage;
