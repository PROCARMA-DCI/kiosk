"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext, useState } from "react";

import { fetchPostObj } from "@/action/function";
import ShowSpinGame from "@/component/ShowSpinGame";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KaosContext } from "../layout";

function LoyaltySpinInner() {
  const [code, setCode] = useState("");
  const { dealer_id }: any = useContext(KaosContext);
  const [spinData, setSpinData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSpin, setShowSpin] = useState(false);
  const params = useSearchParams();
  const id = params.get("id");

  const isReady = code.length === 5;

  const fetchCardDetail = async () => {
    const response = await fetchPostObj({
      api: "spinroulette/checkspinweelcode",
      method: "POST",
      setLoading,
      isValue: true,
      showErrorToast: true,
      data: { code },
    });

    if (response.success == 1) {
      setSpinData(response?.wheel);
      setShowSpin(true);
    } else {
      toast.error(response.message);
    }
  };
  const handleSubmit = () => {
    fetchCardDetail();
  };
  return (
    <>
      <ShowSpinGame
        data={spinData}
        open={showSpin}
        close={() => setShowSpin(false)}
      />
      <div className="mt-10 w-full flex flex-col items-center ">
        <h1 className="text-4xl font-bold text-primary mb-8 tracking-wider">
          LOYALTY SPIN
        </h1>

        <div
          className="w-[523px] h-[514px]  rounded-[85px] p-[20px]  shadow-2xl flex justify-center items-center "
          style={{
            backgroundImage:
              "linear-gradient(to bottom right, #30dab2, #0c5ebf)",
            backgroundColor: "#30dab2", // solid fallback if gradient fails
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Card className="  w-[463.71px] h-[455.85px] rounded-[60px] flex items-center justify-center bg-white dark:bg-gray-900 border-none">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-8">
              <div
                className="text-2xl font-semibold  bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom right, #30dab2, #0c5ebf)",
                  backgroundColor: "#30dab2", // solid fallback if gradient fails
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                ENTER CODE HERE
              </div>

              {/* OTP Input */}
              <InputOTP
                maxLength={5}
                value={code}
                onChange={(val) => setCode(val)}
              >
                <InputOTPGroup className={""}>
                  <InputOTPSlot
                    index={0}
                    className="text-3xl font-semibold h-12 w-12"
                  />
                  <InputOTPSlot
                    index={1}
                    className="text-3xl font-semibold h-12 w-12"
                  />
                  <InputOTPSlot
                    index={2}
                    className="text-3xl font-semibold h-12 w-12"
                  />
                  <InputOTPSlot
                    index={3}
                    className="text-3xl font-semibold h-12 w-12"
                  />
                  <InputOTPSlot
                    index={4}
                    className="text-3xl font-semibold h-12 w-12"
                  />
                </InputOTPGroup>
              </InputOTP>

              {/* Button */}
              <Button
                disabled={!isReady}
                onClick={handleSubmit}
                className={`w-full cursor-pointer py-5 text-lg font-semibold rounded-xl shadow-md transition-all ${
                  isReady
                    ? " hover:scale-105 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                style={
                  isReady
                    ? {
                        backgroundImage:
                          "linear-gradient(to bottom right, #30dab2, #0c5ebf)",
                      }
                    : {}
                }
              >
                SPIN + WIN
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="relative flex flex-col gap-8 w-full  mx-auto mt-20">
          {!isReady && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(247,247,247,0.95) 100%)",
              }}
            />
          )}
          {/* Step 1 */}
          <div className="flex items-start justify-between gap-4 max-w-[600px] mx-auto">
            <div>
              <div className="flex  gap-4">
                <h1
                  className=" uppercase leading-[100%] text-[#001931]"
                  style={{
                    fontFamily: "Uni Sans",
                    fontSize: "25px",
                    lineHeight: "100%",
                    fontWeight: "900",
                  }}
                >
                  1.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                    Download the Spitzer Via App
                  </h2>
                  <p
                    className="text-[#55778B] mt-1 w-[421.25px]"
                    style={{
                      fontSize: "10.83px",
                      lineHeight: "15.57px",
                      fontWeight: "700",
                    }}
                  >
                    Download the app from either the Apple App Store or Google
                    Play Store. If you already have an account, make sure you
                    are signed in. If you are new, please scan the QR code to
                    become a Spitzer VIP member!
                  </p>
                </div>
              </div>
            </div>
            <Image
              src="/images/kaos/qrcode.png"
              alt="QR Code"
              width={180}
              height={180}
              className="rounded-xl border border-gray-200 w-[87.14px] h-[87.14px]"
            />
          </div>

          {/* Step 2 */}
          <div className="flex items-start justify-between max-w-[600px] mx-auto">
            <div>
              <div className="flex  gap-4 ">
                <h1 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                  2.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                    Navigate to Loyalty Spin
                  </h2>

                  <p
                    className="text-[#55778B] mt-1 w-[421.25px]"
                    style={{
                      fontSize: "10.83px",
                      lineHeight: "15.57px",
                      fontWeight: "700",
                    }}
                  >
                    Once logged in, navigate to (Loyalty Spin) from the sliding
                    side menu.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center  ">
              <Image
                src="/images/kaos/code1.png"
                alt="Navigate to Loyalty Spin"
                width={500}
                height={500}
                className="rounded-xl   w-[97.96px] h-[70.66px]"
              />
              <Image
                src="/images/kaos/code2.png"
                alt="Navigate to Loyalty Spin"
                width={500}
                height={500}
                className="rounded-xl -ml-3  w-[97.96px] h-[70.66px]"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start justify-between gap-4 max-w-[600px] mx-auto">
            <div>
              <div className="flex  gap-4">
                <h1 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                  3.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                    Generate Code + Spin to Win!
                  </h2>
                  <p
                    className="text-[#55778B] mt-1 w-[421.25px]"
                    style={{
                      fontSize: "10.83px",
                      lineHeight: "15.57px",
                      fontWeight: "700",
                    }}
                  >
                    After generating a code from the loyalty spin screen, enter
                    your code in the kiosk to spin.
                  </p>
                </div>
              </div>
            </div>

            <Image
              src="/images/kaos/code1.png"
              alt="Navigate to Loyalty Spin"
              width={180}
              height={180}
              className="rounded-xl border border-gray-200 w-[97.96px] h-[70.66px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default function LoyaltySpin() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <LoyaltySpinInner />
    </Suspense>
  );
}
