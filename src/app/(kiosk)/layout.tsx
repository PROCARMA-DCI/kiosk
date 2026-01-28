"use client";

import { useRedirectOnRefresh } from "@/@core/hooks/useRedirectOnRefresh";
import { getActivity } from "@/action/activity";
import { fetchPostObj } from "@/action/function";
import { HeaderKaos } from "@/common/HeaderKaos";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { HtmlVideoEmbed } from "@/components/videoPlayer";
import { playWheelSound } from "@/utils/helpers";
import { getOrCreateSession, getSessionId } from "@/utils/session";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Suspense, useEffect, useRef, useState } from "react";

interface KaosContextType {
  session_id: string | null;
  dealer_id: string | undefined | null;
  setDealerID: React.Dispatch<React.SetStateAction<string | undefined | null>>;
  dealers: Record<string, any>[];
  setDealers: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
  bannerData: any;
  setBannerData: React.Dispatch<React.SetStateAction<any>>;
  dealerModel: boolean;
  setDealerModel: React.Dispatch<React.SetStateAction<boolean>>;
  globalLoading: boolean;
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInactive: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCard: React.Dispatch<React.SetStateAction<any>>;
  selectedCard: any;
  setSessionId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KaosContext = createContext<KaosContextType>(
  {} as KaosContextType,
);
const LayoutInner = ({ children }: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [dealers, setDealers] = useState<Record<string, any>[]>([]);
  const [dealer_id, setDealerID] = useState<string | undefined | null>(
    searchParams.get("dealer_id"),
  );
  const [session_id, setSessionId] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<any>(null);

  const [dealerModel, setDealerModel] = useState<boolean>(false);
  const [inactive, setInactive] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useRedirectOnRefresh();
  // 🔹 Reset inactivity timer on user action
  useEffect(() => {
    const delayTime = Number(bannerData?.delayTime ?? 0) * 1000;

    if (delayTime) {
      const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setInactive(false);
        timerRef.current = setTimeout(() => setInactive(true), delayTime);
      };

      const events = ["keydown"];

      events.forEach((e) => window.addEventListener(e, resetTimer));
      resetTimer();

      return () => {
        events.forEach((e) => window.removeEventListener(e, resetTimer));
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [bannerData?.delayTime]);

  // ✅ Whenever dealer_id changes, sync it to the query
  // useEffect(() => {
  //   if (!dealer_id) return;

  //   const params = new URLSearchParams(searchParams.toString());
  //   if (params.get("dealer_id") !== dealer_id) {
  //     params.set("dealer_id", dealer_id);
  //     const newUrl = `${pathname}?${params.toString()}`;
  //     router.replace(newUrl, { scroll: false });
  //   }
  // }, [dealer_id, pathname, router, searchParams]);

  // initialize once
  useEffect(() => {
    setSessionId(getOrCreateSession());
  }, []);

  useEffect(() => {
    if (session_id && dealer_id) {
      getActivity({
        session_id: session_id,
        activity: "visiting home page",
        type: "home",
        dealer_id: dealer_id,
      });
    }
  }, [session_id, dealer_id]);
  const fetchBanner = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "StandingScreenCenter/dealerHeroScreenSettings",
      method: "POST",
      isValue: true,
      showErrorToast: true,
      // setLoading,
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
  console.log(dealer_id);
  // 🔥 detect day change ONLY ONCE
  useEffect(() => {
    const checkDayChange = () => {
      const newSession = getSessionId();
      setSessionId((prev) => (prev !== newSession ? newSession : prev));
    };

    const timer = setInterval(checkDayChange, 60 * 1000); // every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <KaosContext.Provider
      value={{
        session_id,
        dealer_id,
        setDealerID,
        setDealers,
        dealers,
        bannerData,
        setBannerData,
        dealerModel,
        setDealerModel,
        globalLoading,
        setGlobalLoading,
        setInactive,
        setSelectedCard,
        selectedCard,
        setSessionId,
      }}
    >
      <div className="min-h-screen flex  justify-center bg-background">
        <div className="relative w-full max-w-[731px] min-h-screen shadow-2xl overflow-hidden flex flex-col">
          {/* <MenuKaos
            dealer_id={dealer_id}
            setDealerId={setDealerID}
            dealerModel={dealerModel}
            setDealerModel={setDealerModel}
            setInactive={setInactive}
            setGlobalLoading={setGlobalLoading}
            setBannerData={setBannerData}
          /> */}

          {/* {!inactive && ( */}
          <>
            <HeaderKaos />

            {children}
          </>
          {/* )} */}
        </div>
        {/* 🔹 Screensaver Overlay */}
        {inactive && bannerData?.splashVideo && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700"
            onClick={() => {
              playWheelSound("/sound/SPLASHPAGE-SOUND.mp3");
              setInactive(false);
            }} // click to close video
          >
            {bannerData.splashVideo?.includes("vimeo.com") ? (
              // ✅ Handle Vimeo embed
              <>
                {/* <TestVideo /> */}
                <HtmlVideoEmbed html={bannerData.splashVideo} />
              </>
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
          </div>
        )}
      </div>
    </KaosContext.Provider>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  );
}
