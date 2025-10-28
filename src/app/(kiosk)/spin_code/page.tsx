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
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
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
      setCode("");
    } else {
      toast.error(response.message);
      setCode("");
    }
  };
  const handleSubmit = () => {
    fetchCardDetail();
  };

  const steps = [
    {
      id: 1,
      title: "Download the Spitzer Via App",
      text: "Download the app from either the Apple App Store or Google Play Store...",
      img: "/images/kaos/qrcode.png",
      class: "w-[87.14px] h-[87.14px]",
    },
    {
      id: 2,
      title: "Navigate to Loyalty Spin",
      text: "Once logged in, navigate to (Loyalty Spin) from the sliding side menu.",
      img: "/images/kaos/code1.png",
      img2: "/images/kaos/code2.png",
      class: "w-[97.96px] h-[70.66px]",
    },
    {
      id: 3,
      title: "Generate Code + Spin to Win!",
      text: "After generating a code from the loyalty spin screen, enter your code in the kiosk to spin.",
      img: "/images/kaos/code1.png",
      class: "w-[97.96px] h-[70.66px]",
    },
  ];
  const variants: any = {
    hidden: { opacity: 0, y: 80, filter: "blur(12px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };
  return (
    <>
      <ShowSpinGame
        data={spinData}
        open={showSpin}
        close={() => setShowSpin(false)}
      />
      <div className="mt-10 w-full h-screen flex flex-col items-center ">
        <h1 className="text-4xl font-bold text-primary mb-8 tracking-wider">
          LOYALTY SPIN
        </h1>

        <div
          className="kiosk-gradient w-[523px] h-[514px]  rounded-[85px] p-[20px]  shadow-2xl flex justify-center items-center "
          // style={{
          //   backgroundImage:
          //     "linear-gradient(to bottom right, #30dab2, #0c5ebf)",
          //   backgroundColor: "#30dab2", // solid fallback if gradient fails
          //   backgroundRepeat: "no-repeat",
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          // }}
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
        <div className="relative flex flex-col gap-8 w-full mx-auto mt-20">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              className="flex items-start justify-between gap-4 w-[600px] mx-auto"
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="flex gap-4">
                <h1 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                  {step.id}.
                </h1>
                <div>
                  <h2 className="font-uni text-[25px] font-[900] uppercase leading-[100%] text-[#001931]">
                    {step.title}
                  </h2>
                  <p
                    className="text-[#55778B] mt-1 w-[421.25px]"
                    style={{
                      fontSize: "10.83px",
                      lineHeight: "15.57px",
                      fontWeight: "700",
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>

              {step.img2 ? (
                <div className="flex items-center">
                  <Image
                    src={step.img}
                    alt={step.title}
                    width={500}
                    height={500}
                    className={`rounded-xl ${step.class}`}
                  />
                  <Image
                    src={step.img2}
                    alt={step.title}
                    width={500}
                    height={500}
                    className={`rounded-xl -ml-3 ${step.class}`}
                  />
                </div>
              ) : (
                <Image
                  src={step.img}
                  alt={step.title}
                  width={180}
                  height={180}
                  className={`rounded-xl border border-gray-200 ${step.class}`}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
export default function LoyaltySpin() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <Skeleton className="h-[500px] " />
        </div>
      }
    >
      <LoyaltySpinInner />
    </Suspense>
  );
}
