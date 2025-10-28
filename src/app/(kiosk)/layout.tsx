"use client";

import { HeaderKaos } from "@/component/HeaderKaos";
import MenuKaos from "@/component/MenuKaos";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, Suspense, useEffect, useRef, useState } from "react";

interface KaosContextType {
  dealer_id: string | undefined | null;
  setDealerID: React.Dispatch<React.SetStateAction<string | undefined | null>>;
  bannerData: any;
  setBannerData: React.Dispatch<React.SetStateAction<any>>;
  dealerModel: boolean;
  setDealerModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KaosContext = createContext<KaosContextType | undefined>(
  undefined
);
const LayoutInner = ({ children }: any) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [dealer_id, setDealerID] = useState<string | undefined | null>(
    searchParams.get("dealer_id")
  );
  const [bannerData, setBannerData] = useState<any>(null);
  const [showHome, setShowHome] = useState(false);
  const [dealerModel, setDealerModel] = useState<boolean>(false);
  const [inactive, setInactive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Reset inactivity timer on user action
  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setInactive(false);
      timerRef.current = setTimeout(() => setInactive(true), 30000); // 30s inactivity
    };

    // const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const events = ["click", "keydown"];

    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isKioskPage = pathname === "/kiosk";

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
      }}
    >
      <div className="min-h-screen flex  justify-center bg-background">
        <div className="relative w-full max-w-[731px] min-h-[1300px] shadow-2xl overflow-hidden flex flex-col">
          <MenuKaos
            dealer_id={dealer_id}
            setDealerId={setDealerID}
            dealerModel={dealerModel}
            setDealerModel={setDealerModel}
          />

          {/* Back & Home Buttons */}
          {!isKioskPage && pathname !== "/" && (
            <div
              className="fixed left-2  top-1/2 -translate-y-1/2 z-50"
              onMouseEnter={() => setShowHome(true)}
              onMouseLeave={() => setShowHome(false)}
            >
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className={cn(
                  "relative bg-[#00244C99]  hover:bg-[#03295599] text-white hover:text-white shadow-lg transition-all duration-300 w-[77.31px] h-[21.19px] rounded-tl-[33.86px] rounded-tr-[33.86px]  flex items-center justify-center cursor-pointer"
                )}
                style={{
                  transformOrigin: "left center",
                  transform: "rotate(90deg)",
                }}
              >
                <ChevronLeft className="h-6 w-6 -rotate-90" />
              </button>

              {/* Home Button (appears on hover) */}
              {/* {pathname !== "/" && (
                <button
                  onClick={() => router.push("/")}
                  className={`ml-1 cursor-pointer bg-[#00244C99] hover:bg-[#03295599] text-white hover:text-white p-2 h-10 rounded-full shadow-lg transition-all duration-500 ${
                    showHome
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10 pointer-events-none"
                  }`}
                >
                  <Home className="h-4 w-4 " />
                </button>
              )} */}
            </div>
          )}
          <HeaderKaos />

          {children}
        </div>
        {/* 🔹 Screensaver Overlay */}
        {/* {inactive && bannerData?.splashVideo && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700"
            onClick={() => setInactive(false)} // click to close video
          >
            <video
              src={bannerData?.splashVideo}
              autoPlay
              muted
              loop
              playsInline
              className="max-w-[731px] min-h-[1300px] object-cover"
            />
          </div>
        )} */}
      </div>
    </KaosContext.Provider>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  );
}
