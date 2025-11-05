"use client";

import { Suspense, useContext } from "react";

import BackButton from "@/common/BackButton";
import FeatureCardKaos from "@/common/FeatureCard";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { Skeleton } from "@/components/ui/skeleton";
import { KaosContext } from "./layout";
const KaosHomePage = () => {
  const { bannerData, globalLoading }: any = useContext(KaosContext);

  return (
    <Suspense fallback={<ScreenLoader />}>
      <BackButton backRoute="/" />
      <div>
        {globalLoading && <Skeleton className="h-[500px] " />}
        {bannerData?.bannerType === "image" ? (
          <img
            className="w-full  h-[500px]"
            src={bannerData?.bannerLink}
            alt="banner"
            height={500}
            width={500}
          />
        ) : (
          bannerData?.bannerType === "video" && (
            <iframe
              className="w-full h-[500px]"
              src={bannerData.splashVideo}
              title="YouTube video"
              allow="autoplay; fullscreen"
              allowFullScreen={false}
            />
          )
        )}

        {/* Feature Card */}
        <div className="flex mx-[50px] -mt-20">
          <FeatureCardKaos />
        </div>
      </div>
    </Suspense>
  );
};

export default KaosHomePage;
