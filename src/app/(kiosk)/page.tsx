"use client";

import BackButton from "@/common/BackButton";
import { CarouselBanner } from "@/common/CarouselBanner";
import FeatureCardKaos from "@/common/FeatureCard";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoPlayer } from "@/components/videoPlayer";
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
              // <img
              //   className="w-full  h-[500px]"
              //   src={bannerData?.bannerLink}
              //   alt="banner"
              //   height={500}
              //   width={500}
              // />
              bannerData?.bannerType === "video" && (
                <>
                  {bannerData.splashVideo?.includes("vimeo.com") ? (
                    // ✅ Handle Vimeo embed
                    <VideoPlayer url={bannerData.splashVideo} />
                  ) : (
                    // ✅ Handle direct video file
                    <video
                      className="w-full bg-black/90 shadow-md aspect-video"
                      src={bannerData.splashVideo}
                      title="Video"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                </>
              )
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
