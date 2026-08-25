"use client";

import { fetchPostObj } from "@/action/function";
import { setLocalStorageDealerID } from "@/action/localStorage";
import { KaosContext } from "@/app/(kiosk)/layout";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

export default function KioskSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setDealerID, setGlobalLoading, setScreens, setSelectedScreen } =
    useContext(KaosContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: username,
      password: password,
    };
    const res = await fetchPostObj({
      data,
      api: "/kioskLogin",
      setLoading: setLoading,
    });
    if (res.success) {
      setDealerID(res?.dealer_id);
      setScreens(res?.screens);
      if (res?.screens?.length === 1) {
        setSelectedScreen(res.screens[0]);
      }
      const encodedDealerId = btoa(res.dealer_id);
      // ✅ save to localStorage
      setLocalStorageDealerID(encodedDealerId);
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div
      className="relative  m-auto max-w-[731px] min-h-screen  overflow-hidden bg-cover bg-center bg-no-repeat "
      // style={{ backgroundImage: `url(/images/signinbackground.png)` }}
    >
      {/* Background Image with Rotation and Overlay */}
      {/* <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center center",
            width: "100vh",
            height: "100vw",
            left: "50%",
            top: "50%",
            marginLeft: "-50vh",
            marginTop: "-50vw",
          }}
        >
          <img
            src="/images/signinbackground.png"
            alt="Background"
            className="w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div> */}
      {/* Dark overlay */}
      {/* <div
        className="absolute inset-0"
        style={{
          background: "#021620",
          opacity: 0.55,
        }}
      /> */}

      {/* Gradient overlay - Color */}
      {/* <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90.9deg, #00BCFF 0%, #EFA800 100%)",
          opacity: 0.55,
          mixBlendMode: "color",
        }}
      /> */}

      {/* Gradient overlay - Soft light */}
      {/* <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90.9deg, #00BCFF 0%, #6BB38D 44.71%, #81B176 53.85%, #EFA800 100%)",
          opacity: 0.55,
          mixBlendMode: "soft-light",
        }}
      /> */}
      <ScreenLoader loading={loading} />
      {/* Sign In Container */}
      <div className="relative flex items-center justify-center h-full w-full mt-40">
        <div
          className="backdrop-blur-lg p-14 w-9/12"
          style={{
            // width: "400px",
            // height: "623px",
            background: "rgba(0, 37, 54, 0.12)",
            borderRadius: "49.99px",
            border: "3.12px solid rgba(255, 255, 255, 0.2)",
            borderTop: "3.12px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0px 78.11px 156.22px -37.49px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex flex-col items-center gap-10">
            {/* Header */}
            <div className="text-center">
              <h1 className="font-semibold mb-4 text-3xl text-white">
                Kiosk Sign in
              </h1>
              <p className="font-normal text-lg text-[#FFFFFFB2]">
                Sign in to your personalized kiosk portal.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full "
              style={{ maxWidth: "1193.77px" }}
            >
              <div className="flex flex-col gap-10">
                {/* Username Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="font-medium text-white text-lg"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <UserRound />
                    </div>
                    <input
                      id="username"
                      // type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full text-white  bg-white/10  focus:outline-none focus:ring-2  transition-all p-4 rounded-lg ps-20"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="font-medium text-white text-lg"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <Lock />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-white bg-white/10 focus:outline-none focus:ring-2 transition-all p-4 rounded-lg ps-20"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer duration-300 right-6 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity "
                    >
                      {showPassword ? <EyeOff size={28} /> : <Eye size={28} />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                {/* <div className="-mt-4">
                  <a
                    href="#"
                    className="font-medium hover:underline transition-all"
                    style={{
                      fontSize: "34.37px",
                      lineHeight: "41.93px",
                      color: "#00D1FF",
                    }}
                  >
                    Forgot password?
                  </a>
                </div> */}

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full cursor-pointer font-semibold hover:opacity-90 active:scale-[0.99] transition-all bg-[#00D1FF] text-[#000000] p-6 text-lg"
                >
                  Sign In
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
