"use client";

import { fetchPostObj } from "@/action/function";

import { cn } from "@/lib/utils";

import { getActivity } from "@/action/activity";
import { KaosContext } from "@/app/(kiosk)/layout";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { playWheelSound } from "@/utils/helpers";
import { getSessionId } from "@/utils/session";
import { useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import ShowImageHandle from "./ShowImageHandle";

const InnerFeatureCardKaos = () => {
  const { setSelectedCard, dealer_id } = useContext(KaosContext);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const router = useRouter();

  const session_id = getSessionId();
  const handleClick = (feature: any) => {
    playWheelSound("/sound/MAIN-BUTTON-CLICK.mp3");
    setSelectedCard(feature);
    if (dealer_id && session_id) {
      getActivity({
        session_id: session_id,
        activity: `Button Click: ${feature.title} `,
        type: `internal`,
        dealer_id: dealer_id,
      });
    }

    // Navigate based on type
    if (feature.type === "list") {
      router.push(`/${feature.id}?name=${feature.title}`);
    } else if (feature.type === "spinwheel") {
      router.push(`/spin_code?id=${feature.id}`);
    } else if (feature.type === "external") {
      if (feature.urliframe == 1) {
        router.push(`/external_url?url=${feature.url}`);
      } else {
        window.open(feature.url, "_blank", "noopener,noreferrer");
      }

      // setIframeUrl(feature.url);
      // window.open(feature.url, "_blank", "noopener,noreferrer");
    } else if (feature.type === "pagebuilder") {
      router.push(`/${feature.id}/${feature.card_detail_id}`);
    }
  };
  const fetchWeatherApi = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/dealerStandingScreenCards",
      method: "POST",
      setLoading,
      isValue: true,
      showErrorToast: true,
      data: { dealer_id },
    });

    if (response.success == 1) {
      setCards(response.message);
    }
  };
  useEffect(() => {
    if (!dealer_id) return;

    const fetchData = async () => {
      try {
        const data = await fetchWeatherApi(dealer_id);
        // setWeatherData(data); // fine here
      } catch (err) {
        console.error("Weather fetch error:", err);
      }
    };

    fetchData();
  }, [dealer_id]);
  return iframeUrl ? (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex flex-col">
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <button
          onClick={() => setIframeUrl(null)}
          className="text-white px-4 py-2 rounded bg-[#19b324] hover:bg-[#148d1f] text-lg"
        >
          ← Back
        </button>
        <span className="text-lg font-semibold">External Page</span>
        <div className="w-[60px]" />
      </div>

      <iframe
        src={iframeUrl}
        className="w-full flex-1 bg-white"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  ) : (
    <div
      className="w-full grid grid-cols-3 gap-6 font-uni z-[1]"
      style={{ fontFamily: '"Uni Sans", sans-serif' }}
    >
      {loading
        ? // 🔹 Show 6 skeleton cards while loading
          Array(6)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="w-[176.73px] h-[178.08px] rounded-[14.9px] bg-gray-200 animate-pulse shadow-md border-5 border-gray-200"
              />
            ))
        : // 🔹 Show actual cards when loaded
          cards.map((feature, i) => (
            <div key={i}>
              <button onClick={() => handleClick(feature)} className={cn("  ")}>
                <div className="mb-4">
                  {feature.icon && (
                    <ShowImageHandle
                      src={feature.icon}
                      alt={feature.title}
                      className="w-[176.73px] h-[178.08px] rounded-[14.9px] transition-all duration-300 hover:scale-105 cursor-pointer object-cover"
                      width={500}
                      height={500}
                    />
                  )}
                </div>
                {/* <h3 className=" text-[13.54px] leading-[13.54px] tracking-[0] uppercase text-center text-[#455D69]">
                  {feature.title}
                </h3> */}
              </button>
            </div>
          ))}
    </div>
  );
};

export default function FeatureCardKaos() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <InnerFeatureCardKaos />
    </Suspense>
  );
}
