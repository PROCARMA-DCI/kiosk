"use client";
import { cn } from "@/lib/utils";
import { playWheelSound } from "@/utils/helpers";
import { ChevronLeft, Home } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const BackButton = () => {
  const [showHome, setShowHome] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isKioskPage = pathname === "/kiosk";
  return (
    !isKioskPage &&
    pathname !== "/" && (
      <div className="absolute left-2 top-1/2 translate-y-1/2 z-50 ">
        {/* Back Button */}
        <button
          onMouseEnter={() => setShowHome(true)}
          onMouseLeave={() => setShowHome(false)}
          onClick={() => {
            playWheelSound("/sound/BUTTON-NAVAGATION.wav");
            if (!showHome) setShowHome(true);
            else router.back();
          }}
          className={cn(
            " bg-[#00244C99] hover:bg-[#03295599] text-white hover:text-white shadow-lg transition-all duration-300 w-[77.31px] h-[21.19px] rounded-tl-[33.86px] rounded-tr-[33.86px] flex items-center justify-center cursor-pointer"
          )}
          style={{
            transformOrigin: "left center",
            transform: "rotate(90deg)",
          }}
        >
          <ChevronLeft
            className="h-6 w-6"
            style={{ transform: "rotate(-90deg)" }}
          />
        </button>

        {/* Home Button (appears on hover) */}
        {pathname !== "/" && (
          <button
            onClick={() => {
              playWheelSound("/sound/BUTTON-NAVAGATION.wav");
              router.push("/");
            }}
            className={cn(
              "mt-2 cursor-pointer bg-[#00244C99] hover:bg-[#03295599] text-white hover:text-white p-2 w-[30px] h-[40px] flex items-center justify-center rounded-full shadow-lg transition-all duration-500 ml-4",
              showHome
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10 pointer-events-none"
            )}
          >
            <Home className="h-4 w-4 " />
          </button>
        )}
      </div>
    )
  );
};

export default BackButton;
