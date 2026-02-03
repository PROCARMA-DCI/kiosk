"use client";
import useClickOutside from "@/@core/hooks/useClickOutside";
import { getActivity } from "@/action/activity";
import { KaosContext } from "@/app/(kiosk)/layout";
import { cn } from "@/lib/utils";
import { playWheelSound } from "@/utils/helpers";
import { getSessionId } from "@/utils/session";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, Home, Play } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const BackButton = ({
  backRoute,
  fn,
}: {
  backRoute?: string;
  fn?: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const ref = useClickOutside(() => setExpanded(false));
  const { setInactive, dealer_id } = useContext(KaosContext);
  const session_id = getSessionId();
  useEffect(() => {}, []);

  const handleToggle = () => {
    playWheelSound("/sound/BUTTON-NAVAGATION.wav");
    setExpanded((prev) => !prev);
  };

  const handleBack = () => {
    if (fn) {
      fn();
    }
    playWheelSound("/sound/BUTTON-NAVAGATION.wav");
    if (backRoute) {
      if (dealer_id && session_id) {
        getActivity({
          session_id: session_id,
          activity: `Back Button Click: ${backRoute}`,
          type: `internal`,
          dealer_id: dealer_id,
        });
      }
      router.push(backRoute);
    } else router.back();
  };

  // Dock items
  const items = [
    pathname !== "/" && {
      icon: <ArrowLeft className="h-5 w-5" />,
      action: handleBack,
      label: "Back",
    },
    pathname !== "/" && {
      icon: <Home className="h-5 w-5" />,
      action: () => {
        if (fn) {
          fn();
        }
        playWheelSound("/sound/BUTTON-NAVAGATION.wav");
        if (dealer_id && session_id) {
          getActivity({
            session_id: session_id,
            activity: "Back to Home",
            type: "internal",
            dealer_id: dealer_id,
          });
        }
        router.push("/");
      },
      label: "Home",
    },
    {
      icon: <Play className="h-5 w-5" />,
      action: () => {
        if (fn) {
          fn();
        }
        playWheelSound("/sound/BUTTON-NAVAGATION.wav");
        setInactive(true);
      },
      label: "Play",
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    action: () => void;
    label: string;
  }[];

  const radius = 50;
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.04,
        staggerDirection: -1,
      },
    },
  };

  const iconVariants = (index: number, total: number) => {
    // Spread in a 60-degree arc
    const angleStep = 100 / (total - 1 || 1);
    const startAngle = -50;
    const angle = (startAngle + index * angleStep) * (Math.PI / 180);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      hidden: {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.5,
      },
      visible: {
        opacity: 1,
        x,
        y,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 0.8,
        },
      },
      exit: {
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.5,
        transition: {
          type: "spring",
          stiffness: 500,
          damping: 35,
          duration: 0.15,
        },
      },
    };
  };

  return (
    dealer_id && (
      <div
        ref={ref}
        className="fixed md:absolute left-0 top-1/2 -translate-y-1/2 z-50"
      >
        <div className="relative flex items-center">
          <motion.button
            onClick={handleToggle}
            className={cn(
              "flex items-center justify-center rounded-r-full bg-[#00244C99]",
              " text-primary-foreground shadow-lg",
              "hover:shadow-xl hover:scale-105",
              "transition-all duration-200 ease-out",
              "p-2 h-20 w-6",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 ml-2"
              >
                {items.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      delay: index * 0.05,
                    }}
                    onClick={() => {
                      item.action();
                      setExpanded(false);
                    }}
                    className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-full",
                      "bg-[#00244C99] text-white shadow-md",
                      "hover:shadow-lg hover:bg-accent hover:text-accent-foreground",
                      "transition-colors duration-200 ease-out",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.92 }}
                    title={item.label}
                  >
                    {item.icon}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 -z-10 bg-black/0"
              onClick={() => setExpanded(false)}
            />
          )}
        </AnimatePresence>
      </div>
    )
  );
};

export default BackButton;
