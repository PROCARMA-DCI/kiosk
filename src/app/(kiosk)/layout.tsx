"use client";

import { useRedirectOnRefresh } from "@/@core/hooks/useRedirectOnRefresh";
import { getActivity } from "@/action/activity";
import { fetchPostObj } from "@/action/function";
import {
  getLocalStorageDealerID,
  getLocalStorageScreens,
  getLocalStorageSelectedScreen,
  removeLocalStorageDealerID,
  removeLocalStorageScreens,
  removeLocalStorageSelectedScreen,
  setLocalStorageScreens,
  setLocalStorageSelectedScreen,
} from "@/action/localStorage";
import { HeaderKaos } from "@/common/HeaderKaos";
import KioskSignIn from "@/common/KioskSignIn";
import ScreenSelection from "@/common/ScreenSelection";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import { HtmlVideoEmbed } from "@/components/videoPlayer";
import { playWheelSound, safeAtob } from "@/utils/helpers";
import { getOrCreateSession, getSessionId } from "@/utils/session";
import { createContext, Suspense, useEffect, useRef, useState } from "react";

interface ScreenType {
  screen_number: number;
  name: string;
}
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
  todayWeather: Record<string, any> | null;
  setTodayWeather: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  screens: ScreenType[] | undefined;
  setScreens: React.Dispatch<React.SetStateAction<ScreenType[] | undefined>>;
  selectedScreen: ScreenType | undefined;
  setSelectedScreen: React.Dispatch<
    React.SetStateAction<ScreenType | undefined>
  >;
}

export const KaosContext = createContext<KaosContextType>(
  {} as KaosContextType,
);

const LayoutInner = ({ children }: any) => {
  const [dealers, setDealers] = useState<Record<string, any>[]>([]);
  const [dealer_id, setDealerID] = useState<string | undefined | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<ScreenType>();
  const [screens, setScreens] = useState<ScreenType[]>();
  const [session_id, setSessionId] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<any>(null);
  const [todayWeather, setTodayWeather] = useState<Record<string, any> | null>(
    null,
  );

  const [dealerModel, setDealerModel] = useState<boolean>(false);
  const [inactive, setInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const screen_number = selectedScreen?.screen_number;
  console.log({ screen_number });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useRedirectOnRefresh();

  const setSelectedScreenPersist: React.Dispatch<
    React.SetStateAction<ScreenType | undefined>
  > = (value) => {
    setSelectedScreen((prev) => {
      const next = typeof value === "function" ? (value as any)(prev) : value;
      if (next) {
        setLocalStorageSelectedScreen(next);
      } else {
        removeLocalStorageSelectedScreen();
      }
      return next;
    });
  };

  const setScreensPersist: React.Dispatch<
    React.SetStateAction<ScreenType[] | undefined>
  > = (value) => {
    setScreens((prev) => {
      const next = typeof value === "function" ? (value as any)(prev) : value;
      if (next) {
        setLocalStorageScreens(next);
      } else {
        removeLocalStorageScreens();
      }
      return next;
    });
  };

  // 🔹 Restore session (dealer, screens, selected screen) from localStorage on load
  useEffect(() => {
    try {
      const stored = getLocalStorageDealerID();
      const DealerID = stored ? safeAtob(stored) : null;

      if (!DealerID) {
        removeLocalStorageDealerID();
        removeLocalStorageScreens();
        removeLocalStorageSelectedScreen();
        return;
      }

      setDealerID(DealerID);

      const storedScreens = getLocalStorageScreens<ScreenType[]>();
      const storedScreen = getLocalStorageSelectedScreen<ScreenType>();

      if (storedScreens && storedScreens.length) {
        setScreens(storedScreens);
      }

      if (storedScreen) {
        setSelectedScreen(storedScreen);
      } else if (storedScreens && storedScreens.length === 1) {
        // Only one screen was ever available — select it automatically
        setSelectedScreenPersist(storedScreens[0]);
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
    if (session_id && dealer_id && selectedScreen) {
      getActivity({
        session_id: session_id,
        activity: "visiting home page",
        type: "home",
        dealer_id: dealer_id,
        screen_number: screen_number,
      });
    }
  }, [session_id, dealer_id, selectedScreen]);
  const fetchBanner = async (dealer_id: string) => {
    const response = await fetchPostObj({
      api: "/dealerHeroScreenSettings",
      method: "POST",
      isValue: true,
      showErrorToast: true,
      setLoading: setGlobalLoading,
      data: { dealer_id, screen_number: screen_number },
    });
    if (response.success == 1) {
      setBannerData(response.data);
    }
  };
  useEffect(() => {
    if (dealer_id && screen_number) {
      fetchBanner(dealer_id);
    }
  }, [dealer_id, screen_number]);
  // 🔥 detect day change ONLY ONCE
  useEffect(() => {
    const checkDayChange = () => {
      const newSession = getSessionId();
      setSessionId((prev) => (prev !== newSession ? newSession : prev));
    };

    const timer = setInterval(checkDayChange, 60 * 1000); // every minute
    return () => clearInterval(timer);
  }, []);

  const getWeatherVideo = () => {
    const description = todayWeather?.current?.description?.toLowerCase() || "";

    // if (description.includes("snow")) {
    //   return "/videos/SNOWFALL_WEBM/SNOW_ONLY_ALPHA_TRANSPARENCY.webm";
    // } else if (description.includes("rain")) {
    //   return "/videos/RAINFALL_WEBM/Rainfall_Alpha_Trasnparency.webm";
    // }
    if (bannerData?.enable_weather_condition == 1) {
      return todayWeather?.current?.background;
    } else if (bannerData?.video_url) {
      return bannerData?.video_url;
    }
  };

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
        todayWeather,
        setTodayWeather,
        screens,
        setScreens: setScreensPersist,
        selectedScreen,
        setSelectedScreen: setSelectedScreenPersist,
      }}
    >
      <div className="relative h-screen overflow-auto bg-background w-[731px] mx-auto">
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
        ) : !loading && screens && screens.length > 1 && !screen_number ? (
          <ScreenSelection
            screens={screens}
            onSelect={setSelectedScreenPersist}
          />
        ) : (
          <>
            {/* 🧱 Content */}
            <div className="relative flex flex-col justify-center">
              <HeaderKaos />
              {children}
            </div>

            {/* 🌧 Weather Overlay (ALWAYS ON TOP) */}
            {getWeatherVideo() && (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="fixed inset-0 w-full h-full object-cover pointer-events-none mix-blend-plus-lighter"
              >
                <source src={getWeatherVideo() ?? ""} type="video/webm" />
              </video>
            )}
            {/* 🔹 Screensaver Overlay */}
            {inactive && bannerData?.splashVideo && (
              <div
                className="absolute  inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700"
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
                    className="w-full bg-black/90 shadow-md aspect-video "
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
          </>
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
