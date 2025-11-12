"use client";

import { fetchPostObj } from "@/action/function";
import BackButton from "@/common/BackButton";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { AlertPopup } from "@/components/modals/AlertModal";
import { showConfetti } from "@/components/showConfetti";
import { SpinnerWheelGame } from "@/components/SpinnerWheelGame";
import { playWheelSound } from "@/utils/helpers";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { KaosContext } from "../layout";

function InnerWheelSpinnerPage() {
  const searhParams = useSearchParams();
  const { selectedCard } = useContext(KaosContext);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [lastWinner, setLastWinner] = useState("");
  const [lastPoints, setLastPoints] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [winningSegment, setWinningSegment] = useState<any>(null);

  const code = searhParams.get("code");
  const hasFetched = useRef(false);
  const fetchCardDetail = async (code: any) => {
    const response = await fetchPostObj({
      api: "spinroulette/checkspinweelcode",
      method: "POST",
      setLoading,
      isValue: true,
      showErrorToast: true,
      data: { code },
    });

    if (response.success == 1) {
      setData(response?.wheel);
    } else {
      router.push("/spin_code");
    }
  };
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchCardDetail(code);
  }, []);

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
    playWheelSound("/sound/AFTER-SPIN-WHEEL.mp3");
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
  if (loading) {
    return <ScreenLoader />;
  }
  return (
    <>
      {!alertShow && data && (
        <div>
          <BackButton backRoute="/spin_code" />
          <main className=" flex flex-col gap-4 h-[calc(100vh-100px]">
            {/* Demo Section */}
            <div className=" mt-16  relative ">
              <h1
                className=" font-bold  text-[50px] text-center mb-10 uppercase bg-clip-text text-transparent"
                style={{
                  fontWeight: 400,
                  backgroundImage: `linear-gradient(90deg, ${selectedCard?.gradient_start_color}, ${selectedCard?.gradient_end_color})`,
                }}
              >
                Loyalty Spin
              </h1>

              <div className="relative ">
                <div className="relative z-10 mt-20">
                  <SpinnerWheelGame
                    segments={segments}
                    size={600}
                    spinDuration={5}
                    spinPower={5}
                    onSpinComplete={(s: any) => submitPinResult(s)}
                    pointerColor="#FFD700"
                    borderColor="#f5f5f5"
                    borderWidth={0.005}
                    textColor="#fff"
                    showLabels={true}
                    isSpinning={isSpinning}
                    setIsSpinning={setIsSpinning}
                  />
                </div>
                {/* Spinner Support Base */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    bottom: "-90px",
                    zIndex: 0,
                  }}
                >
                  <Image
                    src="/images/kaos/spinner-support.png"
                    alt="spinner-support"
                    width={200}
                    height={200}
                    className="w-[157px] h-[150px]"
                  />
                </div>
              </div>
              {/* Selected segment display */}
              {/* {lastWinner && !isSpinning && (
                <div
                  className="absolute left-1/2 z-20 -translate-x-1/2 w-[400px] mt-4 p-6 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 rounded-xl border-2 border-cyan-300/50 shadow-md text-center"
                  style={{ position: "absolute" }}
                >
                  <button
                    onClick={() => setIsSpinning(true)}
                    className="absolute z-[9999]  top-2 cursor-pointer right-2 text-cyan-600 hover:text-cyan-800  transition-colors"
                  >
                    ✕
                  </button>

                  <p className="text-xl font-semibold text-cyan-600 uppercase tracking-wide">
                    🎉 You Won!
                  </p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {lastWinner}
                  </p>

                  {lastPoints && (
                    <p className="text-2xl font-bold text-yellow-500 mt-2">
                      +{lastPoints} Points ✨
                    </p>
                  )}
                </div>
              )} */}
            </div>
            <div
              className="absolute bottom-0 -mb-[135%] rotate-180  w-[210%] -ml-[55%]  h-full border-4 border-gra rounded-full"
              style={{ clipPath: "circle(97.6% at 49% 100%)" }}
            ></div>
            <div className="absolute bottom-0  -mb-[380px] h-auto flex justify-center items-center overflow-hidden pt-10 selection:none">
              {/* ↑ adds space so it doesn't touch the spinner */}

              <div className="animate-spinClockwise origin-center relative ">
                <div className="absolute inset-0  rounded-full bg-white/20 blur-2xl"></div>

                <Image
                  src="/images/kaos/maskgroup.png"
                  alt="maskgroup"
                  width={1000}
                  height={1000}
                  className="rounded-full object-contain relative "
                />
              </div>
            </div>
          </main>
        </div>
      )}
      {alertShow && (
        <AlertPopup
          open={alertShow}
          onClose={() => setAlertShow(false)}
          // @ts-ignore
          imageUrl={winningSegment?.win_image ?? winningSegment?.image}
          imageBackground={winningSegment?.color}
        >
          <div className="flex flex-col justify-center items-center gap-4 max-w-sm mx-auto mt-2">
            <h1 className="text-5xl font-extrabold text-center">
              {lastWinner}
            </h1>
            <p
              className="text-center text-[#55778B] mt-2"
              style={{
                fontFamily: "var(--font-roboto)",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "26px",
                letterSpacing: "0em",
              }}
            >
              Congratulations! You won free {lastWinner} of your selection. This
              will be added to your rewards in the loyalty section of your
              Dealer&apos;s app.
            </p>
            <div className="flex flex-col items-center text-center mt-2">
              <p
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "26px",
                  letterSpacing: "0em",
                }}
              >
                Please see a store representative to redeem.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-roboto)",
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: "26px",
                  letterSpacing: "0em",
                }}
              >
                Your next spin will be available in 24 hrs.
              </p>
            </div>
          </div>
        </AlertPopup>
      )}
    </>
  );
}
export default function WheelSpinnerPage() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <InnerWheelSpinnerPage />
    </Suspense>
  );
}
