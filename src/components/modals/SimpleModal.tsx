"use client";

import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { twMerge } from "tailwind-merge";
// import useClickOutside from "@/utils/hooks/useClickOutside";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  // const divRef = useClickOutside<HTMLDivElement>(close);

  if (!open || typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-modal"
      id="simpleModal"
    >
      {/* Overlay */}
      <div className="absolute inset-0 shadow-lg shadow-border bg-gray-800 text-card-foreground opacity-70" />

      {/* Modal content */}
      <div
        // ref={closeOutside ? divRef : null}
        className={twMerge(
          "z-[99] animate-modalIn max-h-[calc(100vh-200px)] overflow-auto bg-card shadow-border shadow m-auto w-10/12 mt-10 rounded-lg",
          className
        )}
      >
        {/* Sticky Header */}
        {(title || headerCustom) && (
          <div
            className={twMerge(
              "sticky bg-card top-0 left-0 right-0 z-[121]",
              headerClass
            )}
          >
            {headerCustom ? (
              headerCustom()
            ) : (
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Avatar
                  onClick={close}
                  className="w-6 h-6 cursor-pointer border hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  <AvatarFallback className="text-center text-sm font-bold">
                    X
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="overflow-auto">
          {children ? children : <p>Coming Soon</p>}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default SimpleModal;
