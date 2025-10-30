"use client";
import useClickOutside from "@/@core/hooks/useClickOutside";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { twMerge } from "tailwind-merge";

interface SimpleModalProps {
  open: boolean;
  close: () => void;
  closeOutside?: boolean;
  children?: ReactNode;
  className?: string;
  headerClass?: string;
  title?: string;
  headerCustom?: () => ReactNode;
}

const SimpleModal = ({
  open,
  close,
  closeOutside = true,
  children,
  className,
  headerClass = "",
  title,
  headerCustom,
}: SimpleModalProps) => {
  const wrapperRef = useClickOutside(close); // adapt if your hook signature differs
  if (!open || typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root") ?? document.body;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay (z lower) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* content (z higher) */}
      <div
        ref={closeOutside ? wrapperRef : null}
        className={twMerge(
          "relative z-50 bg-card shadow-xl rounded-lg max-h-[calc(100vh-120px)] overflow-auto w-full max-w-md mx-4 animate-modalIn",
          className
        )}
      >
        {(title || headerCustom) && (
          <div
            className={twMerge(
              "sticky top-0 left-0 right-0 z-50 border-b px-4 py-3 flex items-center justify-between bg-card",
              headerClass
            )}
          >
            {headerCustom ? (
              headerCustom()
            ) : (
              <>
                <h2 className="text-lg font-semibold">{title}</h2>
                <Avatar
                  onClick={close}
                  className="w-6 h-6 cursor-pointer border"
                >
                  <AvatarFallback className="text-sm font-bold">
                    X
                  </AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        )}

        <div className="p-4 overflow-auto">
          {children ?? <p>Coming Soon</p>}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default SimpleModal;
