"use client";

import { fetchPostObj } from "@/action/function";
import { KaosContext } from "@/app/(kiosk)/layout";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import ShowImageHandle from "./ShowImageHandle";

const FeatureCardKaos = () => {
  const { dealer_id } = useContext(KaosContext) || {};
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = (feature: any) => {
    if (feature.type === "list") {
      router.push(`/${feature.id}`);
    } else if (feature.type === "spinwheel") {
      router.push(`/spin_code`);
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

  return (
    <div
      className="w-full grid grid-cols-3 gap-6 font-uni"
      style={{ fontFamily: '"Uni Sans", sans-serif' }}
    >
      {[
        ...cards,
        ...Array(
          Math.max(12, Math.ceil(cards.length / 3) * 3) - cards.length
        ).fill(null),
      ].map((feature, index) =>
        feature ? (
          <Link
            key={index}
            href={
              feature.type === "list"
                ? `/${feature.id}`
                : feature.type === "spinwheel"
                ? `/spin_code?id=${feature.id}`
                : "#"
            }
          >
            <button
              onClick={() => {
                handleClick(feature);
              }}
              className={cn(
                " w-[176.73px] bg-white h-[178.08px] rounded-[14.9px] shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer text-center flex flex-col items-center justify-center border-5 border-gray-200 hover:border-gray-300 ",
                loading && "animate-pulse bg-gray-200"
              )}
            >
              <div className="mb-4">
                {feature.icon && (
                  <ShowImageHandle
                    src={feature.icon}
                    alt={feature.title}
                    width={100}
                    height={100}
                  />
                )}
              </div>
              <h3 className="font-[900] text-[13.54px] leading-[13.54px] tracking-[0] uppercase text-center text-gray-800">
                {feature.title}
              </h3>
            </button>
          </Link>
        ) : (
          // Empty placeholder to maintain alignment
          <div
            key={index}
            className={cn(
              " w-[176.73px] bg-white h-[178.08px] rounded-[14.9px] shadow-md  border-5 border-gray-200",
              loading && "animate-pulse bg-gray-200"
            )}
          />
        )
      )}
    </div>
  );
};

export default FeatureCardKaos;
