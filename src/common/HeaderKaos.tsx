"use client";

import { fetchPostObj } from "@/action/function";
import { KaosContext } from "@/app/(kiosk)/layout";
import LayoutSkeleton from "@/components/loader/LayoutSkeleton";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  Snowflake,
  Sun,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ShowImageHandle from "./ShowImageHandle";

const weatherIcons: any = {
  "clear sky": <Sun />,
  "few clouds": <Cloud />,
  "scattered clouds": <Cloud />,
  "broken clouds": <Cloud />,
  "shower rain": <CloudRain />,
  rain: <CloudRain />,
  thunderstorm: <CloudLightning />,
  snow: <Snowflake />,
  mist: <CloudFog />,
};

export function HeaderKaos() {
  const {
    dealer_id,
    bannerData,
    setDealerModel,
    setGlobalLoading: setLoading,
    globalLoading: loading,
  }: any = useContext(KaosContext);
  const pathname = usePathname();
  const router = useRouter();
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const date = today.getDate();
  const [todayWeather, setTodayWeather] = useState<any>(null);

  const fetchBanner = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/dealerWeatherDetail",
      method: "POST",
      isValue: true,
      showErrorToast: true,
      setLoading,
      data: { dealer_id },
    });
    if (response.success == 1) {
      const todayWeather = response?.data?.current;
      setTodayWeather(todayWeather);
    }
  };
  const weatherIcon = weatherIcons[
    todayWeather?.description?.toLowerCase()
  ] || <Sun />;
  useEffect(() => {
    if (dealer_id) {
      fetchBanner(dealer_id);
    }
  }, [dealer_id]);
  if (loading) return <LayoutSkeleton header={true} />;

  const homeRoute = () => {
    router.push("/");
  };
  return (
    <div>
      <div
        className="   w-full flex items-center  h-20 shadow-lg  bg-cover bg-center bg-no-repeat text-white "
        // style={{ backgroundImage: `url(${bannerData?.topBanner})` }}
        style={
          bannerData?.heroBackgroundType?.toLowerCase() === "image"
            ? {
                backgroundImage: `url(${bannerData?.topBanner})`,
              }
            : bannerData?.heroBackgroundType?.toLowerCase() === "gradient"
            ? {
                background: `
                linear-gradient(to right, ${bannerData?.startGradient}, ${bannerData?.endGradient}),
                -webkit-linear-gradient(left, ${bannerData?.startGradient}, ${bannerData?.endGradient})
          `,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
              }
            : {}
        }
      >
        <div className="w-full flex items-center justify-between ">
          <div
            className="relative pl-8 p-3"
            onClick={homeRoute}
            onDoubleClick={() => setDealerModel(true)}
          >
            <ShowImageHandle
              src={bannerData?.dealerLogo}
              alt={bannerData?.logoImgTone}
              height={70}
              width={70}
            />
            <div
              className="absolute rounded-r-[200px] left-0 inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                backgroundColor: "#FFFFFF52",
              }}
            />
          </div>
          {pathname === "/" && (
            <h1 className="text-[50px]" style={{ fontWeight: "200" }}>
              {bannerData?.mainHeading}
            </h1>
          )}
          {/* {weatherIcon} */}
          {/* Right - Weather box */}
          <div className="flex  items-center gap-3 justify-center bg-[#ffffff22] rounded-2xl px-5  backdrop-blur-md">
            <div className="flex items-center gap-2">
              {weatherIcon}
              <div className="flex items-center flex-col">
                <p className="text-sm font-medium">
                  {todayWeather?.temperature ?? "66°F"}
                </p>
                <p className="text-xs opacity-80">
                  {todayWeather?.humidity ? `${todayWeather.humidity}` : "20%"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl font-semibold mt-1">{month?.slice(0, 3)}</p>
              <p className="text-3xl font-bold leading-none">{date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
