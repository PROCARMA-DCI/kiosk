"use client";

import { ShadDialog } from "@/components/dialog/ShadDialog";
import { AlertPopup } from "@/components/modals/AlertModal";
import { showConfetti } from "@/components/showConfetti";
import { SpinnerWheelGame } from "@/components/SpinnerWheelGame";
import Image from "next/image";
import { useState } from "react";
export default function ShowSpinGame({ data, open, close }: any) {
  const [lastWinner, setLastWinner] = useState("");
  const [lastPoints, setLastPoints] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [winningSegment, setWinningSegment] = useState(null);

  const segments = data?.wheel_options?.map((item: any) => ({
    id: item?.id,
    // label: item?.label,
    // points: Number(item.points),
    color: item?.color,
    content: {
      type: "image",
      value: item?.image,
    },
  }));

  const handleWinningSegment = (winningSegment: any) => {
    setLastWinner(winningSegment.label || winningSegment.id);
    setLastPoints(winningSegment.points || 0);

    // Confetti explosion effect
    showConfetti();
    setWinningSegment(winningSegment);
    setAlertShow(true);
  };

  const submitPinResult = async (seg: any) => {
    const segment = data?.wheel_options?.find((s: any) => s.id === seg.id);
    handleWinningSegment(segment);

    // const apiData = {
    //   ContractID: data?.ContractID,
    //   IsGuest: data?.IsGuest,
    //   code: data?.code,
    //   option_id: segment?.id,
    // };
    // const response = await fetchPostObj({
    //   api: "spinroulette/savespinresult",
    //   setLoading,
    //   isValue: true,
    //   showErrorToast: true,
    //   data: apiData,
    // });

    // if (response?.success == 1) {
    //   handleWinningSegment(segment);
    // }
  };
  console.log(alertShow, "alert");
  if (data?.length === 0) return null;

  return (
    <>
      {!alertShow && (
        <ShadDialog
          open={open}
          onOpenChange={close}
          headerClass={"bg-gradient-to-r from-[#30dab2] to-[#0c5ebf] h-16"}
          title={"Spin the Wheel"}
          className={
            "w-[700px]  min-h-screen flex flex-col overflow-hidden p-0 m-0"
          }
        >
          <main className=" flex flex-col gap-4 ">
            {/* Demo Section */}
            <div className=" mt-10  relative">
              <h1
                className=" font-bold text-[#00BCFF] text-[50px] text-center mb-32 uppercase"
                style={{ fontWeight: "400" }}
              >
                Loyalty Spin
              </h1>

              <div className="relative ">
                <div className="relative z-10">
                  <SpinnerWheelGame
                    segments={segments}
                    size={500}
                    spinDuration={5}
                    spinPower={5}
                    onSpinComplete={(s: any) => submitPinResult(s)}
                    pointerColor="#FFD700"
                    borderColor="#f5f5f5"
                    borderWidth={0.01}
                    textColor="#fff"
                    showLabels={true}
                    isSpinning={isSpinning}
                    setIsSpinning={setIsSpinning}
                  />
                </div>
                {/* Spinner Support Base */}
                <div className="absolute left-1/2 bottom-[-20%] -translate-x-1/2 z-0">
                  <Image
                    src="/images/kaos/spinner-support.png"
                    alt="spinner-support"
                    width={200}
                    height={200}
                    className="w-20 h-32"
                  />
                </div>
              </div>
              {/* Selected segment display */}
              {lastWinner && !isSpinning && (
                <div className="absolute left-1/2 z-20 -translate-x-1/2 w-[400px] mt-4 p-6 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 rounded-xl border-2 border-cyan-300/50 shadow-md text-center">
                  {/* Close (X) Button */}
                  <button
                    onClick={() => setIsSpinning(true)}
                    className="absolute z-[9999]  top-2 cursor-pointer right-2 text-cyan-600 hover:text-cyan-800  transition-colors"
                  >
                    ✕
                  </button>

                  <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide">
                    🎉 You Won!
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    {lastWinner}
                  </p>

                  {lastPoints && (
                    <p className="text-xl font-bold text-yellow-500 mt-2">
                      +{lastPoints} Points ✨
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="absolute bottom-[-25%]  h-auto flex justify-center items-center overflow-hidden pt-10 selection:none">
              {/* ↑ adds space so it doesn't touch the spinner */}
              <div className="animate-spinClockwise origin-center relative">
                <div className="absolute inset-0  rounded-full bg-white/20 blur-2xl"></div>
                <Image
                  src="/images/kaos/maskgroup.png"
                  alt="maskgroup"
                  width={1000}
                  height={1000}
                  className="rounded-full object-contain relative"
                />
              </div>
            </div>
          </main>
        </ShadDialog>
      )}
      {alertShow && (
        <AlertPopup
          open={alertShow}
          onClose={() => setAlertShow(false)}
          // @ts-ignore
          imageUrl={winningSegment?.image}
        >
          <div className="flex flex-col justify-center items-center gap-4 max-w-sm mx-auto">
            <h1 className="text-5xl font-extrabold text-center">
              {lastWinner}
            </h1>
            <p className="text-center text-light text-xl text-muted-foreground mt-2 ">
              Congratulations! You won free {lastWinner} of your selection. This
              will be added to your rewards in the loyalty section of your
              Dealer&apos;s app.
            </p>
            <div className="flex flex-col">
              <p>Please see a store representative to redeem.</p>
              <p>You next spin will be available in 24hrs.</p>
            </div>
          </div>
        </AlertPopup>
      )}
    </>
  );
}
