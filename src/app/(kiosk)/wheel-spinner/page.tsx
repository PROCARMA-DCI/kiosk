"use client";

import { fetchPostObj } from "@/action/function";
import BackButton from "@/common/BackButton";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { showConfetti } from "@/components/showConfetti";
import { SpinnerWheelGame } from "@/components/SpinnerWheelGame";
import { playWheelSound } from "@/utils/helpers";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import { KaosContext } from "../layout";

function InnerWheelSpinnerPage() {
  const searhParams = useSearchParams();
  const { selectedCard } = useContext(KaosContext);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [lastWinner, setLastWinner] = useState("No User");
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
      router.back();
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

    playWheelSound("/sound/AFTER-SPIN-WHEEL.mp3");
    const apiData = {
      ContractID: data?.ContractID,
      IsGuest: data?.IsGuest,
      code: data?.code,
      option_id: segment?.id,
    };
    const response = await fetchPostObj({
      api: "spinroulette/savespinresult",
      setLoading,
      isValue: true,
      showErrorToast: true,
      data: apiData,
    });

    if (response?.success == 1) {
      handleWinningSegment(segment);
    }
    // setTimeout(() => {
    //   router.push("/spin_code");
    // }, 5000);
  };

  if (data?.length === 0) return null;

  const handleWinningClose = () => {
    setAlertShow(false);
    router.push("/");
  };

  // const win_image =
  //   "https://mypcp.us/wheel_icon/9d5b40987a726c1b2b456c33036e13e3.jpg";
  // const popup_banner_image =
  //   "https://mypcp.us/wheel_icon/4197ef6310edb99f4eb16fca951dd10a.jpg";
  // const color = "#19b324";
  return (
    <>
      <div className="overflow-hidden">
        {loading && <ScreenLoader />}
        {!isSpinning && <BackButton backRoute="/spin_code" />}
        <main className="relative  min-h-[731px] h-[calc(100vh-131px)] flex flex-col gap-4 ">
          {/* Demo Section */}
          <div className="mt-16">
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
                  spinDuration={9}
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
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0">
            <div className="relative flex items-center justify-center overflow-hidden w-[2200px] h-[60vh]">
              <div className="ellipse-bottom"></div>
            </div>
          </div>

          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-end pointer-events-none  overflow-hidden">
            {/* Wrapper: handles size + scaling */}
            <div
              className="relative flex items-center justify-center overflow-hidden   tall-screen origin-center "
              style={{
                // width: "150vw", // responsive width
                // height: "150vh", // keep it square
                transform: "translateY(55%)", // vertical adjust
              }}
            >
              {/* Rotating Image */}
              <Image
                src="/images/kaos/maskgroup.png"
                alt="maskgroup"
                fill
                style={{
                  objectFit: "contain",
                  transformOrigin: "center center",
                  animation: "spin 25s linear infinite",
                }}
                className="will-change-transform"
              />
            </div>

            {/* Spin keyframes */}
            <style jsx>{`
              @keyframes spin {
                to {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        </main>
      </div>
      {/* popup winner start################################################################################3
      #####################################################################33
      ############################3 */}
      {alertShow && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
          {/* Alert Card Container */}

          <div className="bg-white rounded-2xl  shadow-2xl w-full max-w-[630px]  ">
            {/* Banner Section - No padding, full width image */}
            {winningSegment?.popup_banner_image && (
              <div className="relative w-full rounded-t-2xl h-[588.73px] overflow-hidden">
                {/* Content Section - Children content passed by user */}
                <div
                  className={`relative  ${
                    winningSegment.popup_banner_image
                      ? "pt-6 pb-6 px-6"
                      : "pt-8 pb-6 px-6"
                  }`}
                >
                  {/* Close Button */}
                  <button
                    onClick={handleWinningClose}
                    className="absolute top-0 right-4 mt-2 bg-white p-2 rounded-full z-50 hover:text-gray-600 transition-colors"
                    aria-label="Close alert"
                  >
                    <X
                      size={20}
                      className="text-gray-400 hover:text-gray-600"
                    />
                  </button>
                </div>
                <Image
                  src={winningSegment.popup_banner_image}
                  alt="Alert banner"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            {/* Icon Circle - Positioned to overlap banner and content */}
            <div
              className="relative flex justify-center"
              style={{
                marginTop: winningSegment?.popup_banner_image
                  ? "-100px"
                  : "-100px",
              }}
            >
              <div
                className={` rounded-full w-[170px] h-[170px]  shadow-lg flex items-center justify-center   relative z-50`}
                // style={{
                //   backgroundImage: `linear-gradient(90deg, ${winningSegment?.color}, #fff)`,
                // }}
              >
                {winningSegment?.win_image ? (
                  <div className="relative w-[170px] h-[170px] rounded-full overflow-hidden border border-border">
                    <Image
                      src={winningSegment.win_image}
                      alt="Alert icon"
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24" />
                )}
              </div>
            </div>
            {/* Close Button */}
            {!winningSegment?.popup_banner_image && (
              <div className="relative w-full">
                <button
                  onClick={handleWinningClose}
                  className="absolute top-0 cursor-pointer right-4 -mt-[50px] bg-white rounded-full p-2 transition-colors"
                  aria-label="Close alert"
                >
                  <X size={30} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            )}
            <div className=" flex flex-col justify-center items-center gap-4 max-w-lg mx-auto mt-6 pb-5">
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
                Congratulations! You won free {lastWinner} of your selection.
                This will be added to your rewards in the loyalty section of
                your Dealer&apos;s app.
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
          </div>
        </div>
      )}
      {/* end################################################################################3
      #####################################################################33
      ############################3 */}

      {/* {alertShow && (
        <AlertPopup
          open={alertShow}
          onClose={() => setAlertShow(false)}

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
      )} */}
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
