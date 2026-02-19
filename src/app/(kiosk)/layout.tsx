"use client";

import { useRedirectOnRefresh } from "@/@core/hooks/useRedirectOnRefresh";
import { getActivity } from "@/action/activity";
import { fetchPostObj } from "@/action/function";
import {
  getLocalStorageDealerID,
  removeLocalStorageDealerID,
} from "@/action/localStorage";
import { HeaderKaos } from "@/common/HeaderKaos";
import KioskSignIn from "@/common/KioskSignIn";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { HtmlVideoEmbed } from "@/components/videoPlayer";
import { playWheelSound, safeAtob } from "@/utils/helpers";
import { getOrCreateSession, getSessionId } from "@/utils/session";
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
  const [dealers, setDealers] = useState<Record<string, any>[]>([]);
  const [dealer_id, setDealerID] = useState<string | undefined | null>(null);
  const [session_id, setSessionId] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<any>(null);

  const [dealerModel, setDealerModel] = useState<boolean>(false);
  const [inactive, setInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useRedirectOnRefresh();
  useEffect(() => {
    try {
      const stored = getLocalStorageDealerID();

      const DealerID = stored ? safeAtob(stored) : null;
      if (DealerID) {
        setDealerID(DealerID);
      } else {
        removeLocalStorageDealerID(); // cleanup tampered value
      }
    } finally {
      setLoading(false); // 🔥 always stop loading
    }
  }, []);
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
      setLoading: setGlobalLoading,
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
  // 🔥 detect day change ONLY ONCE
  useEffect(() => {
    const checkDayChange = () => {
      const newSession = getSessionId();
      setSessionId((prev) => (prev !== newSession ? newSession : prev));
    };

    const timer = setInterval(checkDayChange, 60 * 1000); // every minute
    return () => clearInterval(timer);
  }, []);
  return loading ? (
    <ScreenLoader />
  ) : (
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
      {!loading && !dealer_id ? (
        <div className="relative flex max-w-[731px] w-full min-h-screen flex-col items-center justify-center overflow-hidden m-auto">
          {/* Layer 1: ShaderAnimation at the very bottom */}
          <div className="absolute inset-0 z-0">
            <ShaderAnimation />
          </div>

          {/* Layer 2: Your overlays on top of shader */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            {/* Dark overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "#021620",
                opacity: 0.35, // Reduced to let shader show through
              }}
            />
            <div className="absolute inset-0 w-full h-full">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90.9deg, #00BCFF 0%, #6BB38D 44.71%, #81B176 53.85%, #EFA800 100%)",
                  opacity: 0.1, // keep same light effect
                  transform: "rotate(-90deg)",
                  transformOrigin: "center center",
                  width: "120vh",
                  height: "120vw",
                  left: "30%",
                  top: "50%",
                  marginLeft: "-50vh",
                  marginTop: "-50vw",
                }}
              />
            </div>

            <div className="absolute inset-0 w-full h-full">
              <div
                className="absolute "
                style={{
                  opacity: 0.1,
                  transform: "rotate(-90deg)",
                  transformOrigin: "center center",
                  width: "120vh",
                  height: "120vw",
                  left: "30%",
                  top: "50%",
                  marginLeft: "-50vh",
                  marginTop: "-50vw",
                }}
              >
                <img
                  src="/images/signinbackground.png"
                  alt="Background"
                  className="w-full h-full"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            </div>
            {/* Gradient overlay - Color */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90.9deg, #00BCFF 0%, #EFA800 100%)",
                opacity: 0.1, // Reduced to let shader show through
                mixBlendMode: "color",
              }}
            />

            {/* Gradient overlay - Soft light */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90.9deg, #00BCFF 0%, #6BB38D 44.71%, #81B176 53.85%, #EFA800 100%)",
                opacity: 0.1, // Reduced to let shader show through
                mixBlendMode: "soft-light",
              }}
            />
          </div>

          {/* Layer 3: Sign-in form - NO pointer-events-none here! */}
          <div className="relative z-10 w-full">
            <KioskSignIn />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex m-auto  justify-center bg-background">
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
      )}
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
