"use client";

import { Suspense, useContext } from "react";

import FeatureCardKaos from "@/component/FeatureCard";
import { KaosContext } from "./layout";
const KaosHomePage = () => {
  const { bannerData }: any = useContext(KaosContext);
  console.log(bannerData);
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
