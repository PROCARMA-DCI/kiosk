"use client";

import { KaosContext } from "@/app/(kiosk)/layout";
import LayoutSkeleton from "@/components/loader/LayoutSkeleton";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import ShowImageHandle from "./ShowImageHandle";

export function HeaderKaos() {
  const {
    dealer_id,
    bannerData,
    setBannerData,
    setDealerModel,
    setGlobalLoading: setLoading,
    globalLoading: loading,
  }: any = useContext(KaosContext);
  const pathname = usePathname();
  const router = useRouter();
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const date = today.getDate();

  // const fetchBanner = async (dealer_id: string) => {
  //   const response = await fetchPostObj({
  //     api: "StandingScreenCenter/dealerHeroScreenSettings",
  //     method: "POST",
  //     isValue: true,
  //     showErrorToast: true,
  //     setLoading,
  //     data: { dealer_id },
  //   });
  //   if (response.success == 1) {
  //     setBannerData(response.message);
  //   }
  // };
  // useEffect(() => {
  //   if (dealer_id) {
  //     fetchBanner(dealer_id);
  //   }
  // }, [dealer_id]);
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
          {/* Left - Date */}
          <div className=" pr-8">
            <p className="text-sm p-0 m-0 font-medium opacity-90">{month}</p>
            <p className="text-4xl p-0 m-0 font-bold">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
