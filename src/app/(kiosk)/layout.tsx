"use client";

import { useRedirectOnRefresh } from "@/@core/hooks/useRedirectOnRefresh";
import { HeaderKaos } from "@/common/HeaderKaos";
import MenuKaos from "@/common/MenuKaos";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { VideoPlayer } from "@/components/videoPlayer";
import { playWheelSound } from "@/utils/helpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Suspense, useEffect, useRef, useState } from "react";

interface KaosContextType {
  dealer_id: string | undefined | null;
  setDealerID: React.Dispatch<React.SetStateAction<string | undefined | null>>;
  bannerData: any;
  setBannerData: React.Dispatch<React.SetStateAction<any>>;
  dealerModel: boolean;
  setDealerModel: React.Dispatch<React.SetStateAction<boolean>>;
  globalLoading: boolean;
  setGlobalLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setInactive: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCard: React.Dispatch<React.SetStateAction<any>>;
  selectedCard: any;
}

export const KaosContext = createContext<KaosContextType>(
  {} as KaosContextType
);
const LayoutInner = ({ children }: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [dealer_id, setDealerID] = useState<string | undefined | null>(
    searchParams.get("dealer_id")
  );
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
  useEffect(() => {
    if (!dealer_id) return;

    const params = new URLSearchParams(searchParams.toString());
    if (params.get("dealer_id") !== dealer_id) {
      params.set("dealer_id", dealer_id);
      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [dealer_id, pathname, router, searchParams]);

  return (
    <KaosContext.Provider
      value={{
        dealer_id,
        setDealerID,
        bannerData,
        setBannerData,
        dealerModel,
        setDealerModel,
        globalLoading,
        setGlobalLoading,
        setInactive,
        setSelectedCard,
        selectedCard,
      }}
    >
      <div className="min-h-screen flex  justify-center bg-background">
        <div className="relative w-full max-w-[731px] min-h-screen shadow-2xl overflow-hidden flex flex-col">
          <MenuKaos
            dealer_id={dealer_id}
            setDealerId={setDealerID}
            dealerModel={dealerModel}
            setDealerModel={setDealerModel}
            setInactive={setInactive}
            setGlobalLoading={setGlobalLoading}
            setBannerData={setBannerData}
          />

          {!inactive && (
            <>
              <HeaderKaos />

              {children}
            </>
          )}
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
