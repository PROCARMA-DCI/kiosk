"use client";

import { HeaderKaos } from "@/component/HeaderKaos";
import MenuKaos from "@/component/MenuKaos";
import { cn } from "@/lib/utils";
import { ChevronLeft, Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useRef, useState } from "react";

interface KaosContextType {
  dealer_id: string | null;
  setDealerID: React.Dispatch<React.SetStateAction<string | null>>;
  bannerData: any;
  setBannerData: React.Dispatch<React.SetStateAction<any>>;
}

export const KaosContext = createContext<KaosContextType | undefined>(
  undefined
);
const Layout = ({ children }: any) => {
  const [dealer_id, setDealerID] = useState<string | null>("515");
  const [bannerData, setBannerData] = useState<any>(null);
  const [showHome, setShowHome] = useState(false);
  const [inactive, setInactive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔹 Reset inactivity timer on user action
  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setInactive(false);
      timerRef.current = setTimeout(() => setInactive(true), 10000); // 10s inactivity
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const isKioskPage = pathname === "/kiosk";

  return (
    <KaosContext.Provider
      value={{
        dealer_id,
        setDealerID,
        bannerData,
        setBannerData,
      }}
    >
      <div className="min-h-screen flex  justify-center bg-background">
        <div className="relative w-full max-w-[731px] min-h-[1300px] rounded-lg shadow-2xl overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 ">
            <MenuKaos dealer_id={dealer_id} setDealerId={setDealerID} />
          </div>
          {/* Back & Home Buttons */}
          {!isKioskPage && (
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 flex items-center"
              onMouseEnter={() => setShowHome(true)}
              onMouseLeave={() => setShowHome(false)}
            >
              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className={cn(
                  "relative bg-[#00244C99] hover:bg-[#03295599] text-white hover:text-white p-1 h-20 rounded-r-full shadow-lg transition-all duration-300 w-4 flex items-center justify-center cursor-pointer"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Home Button (appears on hover) */}
              <button
                onClick={() => router.push("/kiosk")}
                className={`ml-1 cursor-pointer bg-[#00244C99] hover:bg-[#03295599] text-white hover:text-white p-2 h-10 rounded-full shadow-lg transition-all duration-500 ${
                  showHome
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10 pointer-events-none"
                }`}
              >
                <Home className="h-4 w-4 " />
              </button>
            </div>
          )}
          <HeaderKaos />

          {children}
        </div>
        {/* 🔹 Screensaver Overlay */}
        {inactive && bannerData?.splashVideo && (
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
        )}
      </div>
    </KaosContext.Provider>
  );
};

export default Layout;
