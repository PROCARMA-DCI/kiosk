"use client";
import useClickOutside from "@/@core/hooks/useClickOutside";
import { XIcon } from "lucide-react";
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
  closeOutside = false,
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
      className="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay (z lower) */}
      <div className="absolute  inset-0 bg-black/50 backdrop-blur-sm" />

      {/* content (z higher) */}
      <div
        ref={closeOutside ? wrapperRef : null}
        className={twMerge(
          "relative isolate z-[1000] bg-card max-h-[calc(100vh-200px)] shadow-xl rounded-lg h-max overflow-auto w-full  mx-4  animate-modalIn",
          className
        )}
      >
        {(title || headerCustom) && (
          <div
            className={twMerge(
              "sticky top-0 left-0 right-0 z-[1001] border-b px-4 py-3 flex items-center justify-between bg-card",
              headerClass
            )}
          >
            {headerCustom ? (
              headerCustom()
            ) : (
              <>
                <h2 className="text-lg font-semibold">{title}</h2>
                <div
                  onClick={close}
                  className="w-6 h-6 cursor-pointer border border-border/20 rounded flex items-center justify-center "
                >
                  <XIcon />
                </div>
              </>
            )}
          </div>
        )}

        <div className=" overflow-auto">{children ?? <p>Coming Soon</p>}</div>
      </div>
    </div>,
    modalRoot
  );
};

export default SimpleModal;
