"use client";

import { Suspense, useContext } from "react";

import FeatureCardKaos from "@/component/FeatureCard";
import { KaosContext } from "./layout";
const KaosHomePage = () => {
  const { bannerData }: any = useContext(KaosContext);
  console.log(bannerData);
  if (!bannerData) {
    return (
      <div className="min-h-screen flex  justify-center bg-background">
        <video
          src={
            "https://mypcp.us/assets/images/standing_screen/splash-video.mp4"
          }
          autoPlay
          muted
          loop
          playsInline
          className="max-w-[731px] min-h-[1300px] object-cover"
        />
      </div>
    );
  }
  return (
    <Suspense fallback={<div>Loading</div>}>
      <div>
        {bannerData?.bannerType === "image" && (
          <img
            className="w-full  h-[500px]"
            src={bannerData?.bannerLink}
            alt="banner"
            height={500}
            width={500}
          />
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
