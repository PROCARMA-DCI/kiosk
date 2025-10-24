"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";

import { fetchPostObj } from "@/action/function";
import ShowSpinGame from "@/component/ShowSpinGame";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KaosContext } from "../layout";

export default function LoyaltySpin() {
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

        <div className=" rounded-[100px] p-[20px] bg-gradient-to-br from-[#30dab2] to-[#0c5ebf] shadow-2xl">
          <Card className="w-[400px] h-[400px] flex items-center justify-center rounded-[100px] bg-white dark:bg-gray-900 border-none">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-8">
              <div className="text-2xl font-semibold bg-gradient-to-br from-[#30dab2] to-[#0c5ebf] bg-clip-text text-transparent">
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
                className={`w-full py-5 text-lg font-semibold rounded-xl shadow-md transition-all ${
                  isReady
                    ? "bg-gradient-to-r from-[#00b2ff] to-[#0077cc] hover:scale-105 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                SPIN + WIN
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-8 w-full max-w-[600px] mx-auto mt-20">
          {/* Step 1 */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex  gap-4">
                <h1 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#023553]">
                  1.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#023553]">
                    Download the Spitzer Via App
                  </h2>
                  <p className="text-gray-600 mt-1">
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
              width={80}
              height={80}
              className="rounded-xl border border-gray-200"
            />
          </div>

          {/* Step 2 */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex  gap-4 ">
                <h1 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#023553]">
                  2.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#023553]">
                    Navigate to Loyalty Spin
                  </h2>

                  <p className="text-gray-600 mt-1">
                    Once logged in, navigate to (Loyalty Spin) from the sliding
                    side menu.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/kaos/code1.png"
                alt="Navigate to Loyalty Spin"
                width={80}
                height={80}
                className="rounded-xl border border-gray-200"
              />
              <Image
                src="/images/kaos/code2.png"
                alt="Navigate to Loyalty Spin"
                width={80}
                height={80}
                className="rounded-xl border border-gray-200"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex  gap-4">
                <h1 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#023553]">
                  3.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#023553]">
                    Generate Code + Spin to Win!
                  </h2>
                  <p className="text-gray-600 mt-1">
                    After generating a code from the loyalty spin screen, enter
                    your code in the kiosk to spin.
                  </p>
                </div>
              </div>
            </div>

            <Image
              src="/images/kaos/code1.png"
              alt="Navigate to Loyalty Spin"
              width={80}
              height={80}
              className="rounded-xl border border-gray-200"
            />
          </div>
        </div>
      </div>
    </>
  );
}
