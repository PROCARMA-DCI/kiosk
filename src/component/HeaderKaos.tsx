"use client";

import { fetchPostObj } from "@/action/function";
import { KaosContext } from "@/app/(kiosk)/layout";

import LayoutSkeleton from "@/components/loader/LayoutSkeleton";
import { useContext, useEffect, useState } from "react";
import ShowImageHandle from "./ShowImageHandle";

export function HeaderKaos() {
  const { dealer_id, bannerData, setBannerData, setDealerModel }: any =
    useContext(KaosContext);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const date = today.getDate();

  const fetchBanner = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/dealerHeroScreenSettings",
      method: "POST",
      isValue: true,
      showErrorToast: true,
      setLoading,
      data: { dealer_id },
    });
    if (response.success == 1) {
      setBannerData(response.message);
    }
  };
  useEffect(() => {
    if (dealer_id) {
      fetchBanner(dealer_id);
    }
  }, [dealer_id]);
  if (loading) return <LayoutSkeleton header={true} />;
  return (
    <div>
      <div
        className="  px-8 w-full flex items-center  h-20 shadow-lg  bg-cover bg-center bg-no-repeat text-white bg-gradient-to-r from-[#00BCFF] to-[#023553]"
        // style={{ backgroundImage: `url(${bannerData?.topBanner})` }}
      >
        <div className="w-full flex items-center justify-between">
          <div className="" onDoubleClick={() => setDealerModel(true)}>
            <ShowImageHandle
              src={bannerData?.dealerLogo}
              alt={bannerData?.logoImgTone}
              height={70}
              width={70}
            />
          </div>
          <h1 className="text-[50px]" style={{ fontWeight: "200" }}>
            Welcome
          </h1>
          {/* Left - Date */}
          <div className="me-4">
            <p className="text-sm p-0 m-0 font-medium opacity-90">{month}</p>
            <p className="text-4xl p-0 m-0 font-bold">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
