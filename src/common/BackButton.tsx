"use client";
import useClickOutside from "@/@core/hooks/useClickOutside";
import { KaosContext } from "@/app/(kiosk)/layout";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Home, Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";

const BackButton = ({ backRoute }: { backRoute?: string }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useClickOutside(() => setExpanded(false));

  const { setInactive } = useContext(KaosContext);

  const handleToggle = () => setExpanded((prev) => !prev);

  const handleBack = () => {
    if (backRoute) router.push(backRoute);
    else router.back();
  };

  return (
    <div
      ref={ref}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-50 -ml-4"
    >
      <div
        className={cn(
          "flex items-center justify-between bg-[#00244C99] h-[100px] duration-500 transition-all rounded-tr-[30px] rounded-br-[30px] shadow-lg overflow-hidden ",
          expanded ? "max-w-max" : "w-[40px]"
        )}
      >
        {/* Chevron toggle */}
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-[52px] h-[52px] text-white transition-all ml-2"
        >
          {expanded ? (
            <ChevronRight className="h-6 w-6 ml-2" />
          ) : (
            <ChevronLeft className="h-6 w-6 ml-2" />
          )}
        </button>

        {/* Animated icon group */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="flex items-center justify-center gap-4 pr-4 ="
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Back Button */}
              {pathname !== "/" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={handleBack}
                  className="text-white hover:text-blue-200 transition"
                >
                  <ArrowLeft className="h-6 w-6" />
                </motion.button>
              )}
              {/* Home Button */}
              {pathname !== "/" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => router.push("/")}
                  className="text-white hover:text-blue-200 transition"
                >
                  <Home className="h-6 w-6" />
                </motion.button>
              )}

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setInactive(true)}
                className="text-white hover:text-blue-200 transition"
              >
                <Play className="h-6 w-6" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BackButton;
