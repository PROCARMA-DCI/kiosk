"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Suspense, useContext, useState } from "react";

import BackButton from "@/common/BackButton";
import { Button } from "@/components/ui/button";
import { LoaderFive } from "@/components/ui/loader";
import { MovingBorder } from "@/components/ui/moving-border";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { KaosContext } from "../layout";

function LoyaltySpinInner() {
  const router = useRouter();
  const { selectedCard } = useContext(KaosContext);
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);

  const isReady = code.length === 5;

  // const fetchCardDetail = async () => {
  //   const response = await fetchPostObj({
  //     api: "spinroulette/checkspinweelcode",
  //     method: "POST",
  //     setLoading,
  //     isValue: true,
  //     showErrorToast: true,
  //     data: { code },
  //   });

  //   if (response.success == 1) {
  //     setSpinData(response?.wheel);
  //     router.push("/wheel-spinner");
  //     // setShowSpin(true);
  //     setCode("");
  //   } else {
  //     toast.error(response.message);
  //     setCode("");
  //   }
  // };
  const handleSubmit = () => {
    router.push(`/wheel-spinner?code=${code}`);
  };

  const steps = [
    {
      id: 1,
      title: "Download the Spitzer Vip App",
      text: "Download the app from either the Apple App Store or Google Play Store. If you already have an account, make sure you are signed in. If you are new, please scan the QR code to become a Spitzer VIP member!",
      img: "/images/kaos/qrcode.png",
      class: "w-[90.14px] h-[90.14px] bg-white rounded-lg p-2",
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
      <div className="mt-10 w-full flex flex-col items-center ">
        <h4
          className="text-[50px] font-bold  mb-8 tracking-wider bg-clip-text text-transparent"
          style={{
            fontWeight: 400,
            backgroundImage: `linear-gradient(90deg, ${selectedCard?.gradient_start_color}, ${selectedCard?.gradient_end_color})`,
          }}
        >
          LOYALTY SPIN
        </h4>
        <BackButton backRoute="/" />

        <div className="spin-code-gradient  w-[523px] min-h-[504px]  rounded-[85px] shadow-2xl flex justify-center items-center ">
          <Card className=" w-[463.71px] h-[455.85px] overflow-hidden rounded-[60px] flex items-center justify-center bg-white dark:bg-gray-900 border-none">
            <CardContent className="flex w-[321.51px]  flex-col items-center justify-center p-8 space-y-8">
              <div
                className="  font-semibold  bg-clip-text text-transparent flex flex-col items-center justify-center"
                style={{
                  color: "#00BCFF",
                }}
              >
                <h4 style={{ fontSize: "20px" }}>ENTER CODE HERE</h4>
                <ChevronDown className="animate-bounce" />
              </div>

              {/* OTP Input */}
              <InputOTP
                maxLength={5}
                value={code}
                onChange={(val) => setCode(val)}
              >
                <InputOTPGroup className={"flex gap-2"}>
                  <InputOTPSlot
                    index={0}
                    className="text-3xl font-semibold h-16 w-10 border-0 rounded-xl bg-gray-100 first:rounded-xl first:border-0 "
                  />
                  <InputOTPSlot
                    index={1}
                    className="text-3xl font-semibold h-16 w-10 border-0 rounded-xl bg-gray-100 "
                  />
                  <InputOTPSlot
                    index={2}
                    className="text-3xl font-semibold h-16 w-10 border-0 rounded-xl bg-gray-100 "
                  />
                  <InputOTPSlot
                    index={3}
                    className="text-3xl font-semibold h-16 w-10 border-0 rounded-xl bg-gray-100 "
                  />
                  <InputOTPSlot
                    index={4}
                    className="text-3xl font-semibold h-16 w-10 border-0 rounded-xl bg-gray-100 last:border-0 last:rounded-xl "
                  />
                </InputOTPGroup>
              </InputOTP>

              {/* Button */}
              <MovingBorder
                className="bg-white p-0 rounded-xl"
                containerClassName="w-full"
                borderClassName="h-1"
                animate={loading}
              >
                <Button
                  disabled={!isReady}
                  onClick={handleSubmit}
                  className={`w-full h-[60px] rounded-[18.6px]  cursor-pointer py-5 text-lg font-semibold  shadow-md transition-all ${
                    isReady
                      ? " hover:scale-105 text-white"
                      : "bg-gray-300  cursor-not-allowed"
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
                  <h1 className="text-[27.78px]" style={{ lineHeight: 0 }}>
                    {loading ? <LoaderFive text="SPIN + WIN" /> : "SPIN + WIN"}
                  </h1>
                </Button>
              </MovingBorder>
            </CardContent>
          </Card>
        </div>
        <div className="relative flex flex-col gap-8 w-full  min-h-96 mx-auto mt-20 ">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              className="flex items-center gap-4 w-[600px] mx-auto"
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="flex gap-4 ">
                <h1 className=" text-[25px] uppercase leading-[100%] text-[#001931]">
                  {step.id}.
                </h1>
                <div className="">
                  <h2 className="w-[380px] text-[25px]  uppercase leading-[100%] text-[#001931]">
                    {step.title}
                  </h2>
                  <p
                    className="w-[370px] text-[#55778B] mt-1 "
                    style={{
                      fontFamily: "var(--font-roboto)",
                      fontSize: "10.83px",
                      lineHeight: "15.57px",
                      fontWeight: "700",
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
              <div className="flex justify-center  items-center w-[200px]">
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
                    width={200}
                    height={200}
                    className={`rounded-xl border border-gray-200 ${step.class}`}
                  />
                )}
              </div>
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
