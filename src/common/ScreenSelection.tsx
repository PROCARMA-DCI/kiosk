"use client";

import { Button } from "@/components/ui/button";

interface ScreenType {
  screen_number: number;
  name: string;
}

interface ScreenSelectionProps {
  screens: ScreenType[];
  onSelect: (screen: ScreenType) => void;
}

export default function ScreenSelection({
  screens,
  onSelect,
}: ScreenSelectionProps) {
  return (
    <div className="relative flex max-w-[731px] w-full min-h-screen flex-col items-center justify-center overflow-hidden m-auto bg-[#021620]">
      <div className="flex flex-col items-center gap-8 w-9/12">
        <h1 className="font-semibold text-3xl text-white text-center">
          Select a Screen
        </h1>
        <div className="flex flex-col gap-4 w-full">
          {screens.map((screen) => (
            <Button
              key={screen.screen_number}
              type="button"
              onClick={() => onSelect(screen)}
              className="w-full cursor-pointer font-semibold hover:opacity-90 active:scale-[0.99] transition-all bg-[#00D1FF] text-[#000000] p-6 text-lg"
            >
              {screen.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
