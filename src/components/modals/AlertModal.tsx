"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export function AlertPopup({
  open,
  onClose,
  title,
  description,
  imageUrl,
  imageAlt = "Alert image",
  className,
  children,
  imageBackground,
}: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="alert-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose} // click outside closes popup
        >
          <motion.div
            key="alert-card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={twMerge(
              "relative bg-card text-card-foreground rounded-3xl shadow-2xl border border-border max-w-xl w-full mx-4 p-6 pt-16 overflow-visible",
              className
            )}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside card
          >
            {/* Floating Image */}
            {imageUrl && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -top-24 inset-x-0 flex justify-center z-30 overflow-visible"
              >
                <div
                  className="
                    relative w-[150px] h-[150px] rounded-full
                    border-4 border-card
                    shadow-xl flex items-center justify-center
                  "
                  style={{
                    background: imageBackground
                      ? `linear-gradient(135deg, #ffffff 0%, ${imageBackground} 100%)`
                      : "white",
                  }}
                >
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    width={96}
                    height={96}
                    className="object-contain drop-shadow-md w-[90px]"
                    priority
                  />
                </div>
              </motion.div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition focus:outline-none z-40"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title */}
            {title && (
              <h2 className="text-xl font-bold text-center mt-2">{title}</h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {description}
              </p>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
