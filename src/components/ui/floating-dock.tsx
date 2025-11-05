/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";

import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

export const FloatingDock = ({
  items,
  mobileClassName,
  Icon,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  Icon: React.ReactNode;
}) => {
  return (
    <>
      <FloatingDockMobile
        items={items}
        className={mobileClassName}
        Icon={Icon}
      />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  Icon,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  Icon: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute left-full top-1/2 -translate-y-1/2 ml-2 flex flex-row gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: -10,
                  transition: { delay: idx * 0.05 },
                }}
                transition={{
                  delay: (items.length - 1 - idx) * 0.05,
                  type: "spring",
                  stiffness: 200,
                  damping: 18,
                }}
              >
                <a
                  href={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 shadow-md hover:scale-110 transition-transform"
                >
                  <div className="h-4 w-4 text-gray-700 dark:text-gray-200">
                    {item.icon}
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800"
      >
        {Icon}
      </button>
    </div>
  );
};
