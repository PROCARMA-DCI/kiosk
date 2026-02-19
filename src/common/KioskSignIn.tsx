"use client";

import { fetchPostObj } from "@/action/function";
import { setLocalStorageDealerID } from "@/action/localStorage";
import { KaosContext } from "@/app/(kiosk)/layout";
import { ScreenLoader } from "@/components/loader/ScreenLoader";
import { Button } from "@/components/ui/button";
import React, { useContext, useState } from "react";
import { toast } from "sonner";

export default function KioskSignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setDealerID, setGlobalLoading } = useContext(KaosContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: username,
      password: password,
    };
    const res = await fetchPostObj({
      data,
      api: "StandingScreenCenter/kioskLogin",
      setLoading: setLoading,
    });
    if (res.success) {
      setDealerID(res.message);
      const encodedDealerId = btoa(res.message);
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
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 37 37"
                        fill="none"
                      >
                        <path
                          d="M5.5625 31.625C5.5625 31.625 3 31.625 3 29.0625C3 26.5 5.5625 19.375 18.5 19.375C31.4375 19.375 34 26.5 34 29.0625C34 31.625 31.4375 31.625 31.4375 31.625H5.5625ZM18.5 16.8125C20.1793 16.8125 21.7897 16.1458 22.9775 14.958C24.1653 13.7702 24.8125 12.1598 24.8125 10.5C24.8125 8.84022 24.1653 7.22984 22.9775 6.04203C21.7897 4.85422 20.1793 4.1875 18.5 4.1875C16.8207 4.1875 15.2103 4.85422 14.0225 6.04203C12.8347 7.22984 12.1875 8.84022 12.1875 10.5C12.1875 12.1598 12.8347 13.7702 14.0225 14.958C15.2103 16.1458 16.8207 16.8125 18.5 16.8125Z"
                          fill="white"
                          fillOpacity="0.7"
                        />
                      </svg>
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
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 37 37"
                        fill="none"
                      >
                        <path
                          d="M27.625 13.25H25.5V10C25.5 7.74566 24.6045 5.58365 23.0104 3.98959C21.4163 2.39553 19.2543 1.5 17 1.5C14.7457 1.5 12.5837 2.39553 10.9896 3.98959C9.39553 5.58365 8.5 7.74566 8.5 10V13.25H6.375C5.51359 13.25 4.68773 13.5924 4.07814 14.2019C3.46855 14.8115 3.12598 15.6374 3.12598 16.4988V31.0012C3.12598 31.8626 3.46855 32.6885 4.07814 33.2981C4.68773 33.9076 5.51359 34.25 6.375 34.25H27.625C28.4864 34.25 29.3123 33.9076 29.9219 33.2981C30.5315 32.6885 30.874 31.8626 30.874 31.0012V16.4988C30.874 15.6374 30.5315 14.8115 29.9219 14.2019C29.3123 13.5924 28.4864 13.25 27.625 13.25ZM12 10C12 8.67392 12.5268 7.40215 13.4645 6.46447C14.4021 5.52678 15.6739 5 17 5C18.3261 5 19.5979 5.52678 20.5355 6.46447C21.4732 7.40215 22 8.67392 22 10V13.25H12V10Z"
                          fill="white"
                          fillOpacity="0.7"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-white  bg-white/10  focus:outline-none focus:ring-2  transition-all p-4 rounded-lg ps-20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                    >
                      <svg
                        width="37"
                        height="37"
                        viewBox="0 0 37 37"
                        fill="none"
                      >
                        <path
                          d="M18.5 7.75C10.25 7.75 3.24875 12.65 0.5 19.375C3.24875 26.1 10.25 31 18.5 31C26.75 31 33.7513 26.1 36.5 19.375C33.7513 12.65 26.75 7.75 18.5 7.75ZM18.5 26.8125C13.7938 26.8125 10 23.0188 10 18.3125C10 13.6062 13.7938 9.8125 18.5 9.8125C23.2062 9.8125 27 13.6062 27 18.3125C27 23.0188 23.2062 26.8125 18.5 26.8125ZM18.5 13.25C15.6925 13.25 13.4375 15.505 13.4375 18.3125C13.4375 21.12 15.6925 23.375 18.5 23.375C21.3075 23.375 23.5625 21.12 23.5625 18.3125C23.5625 15.505 21.3075 13.25 18.5 13.25Z"
                          fill="white"
                          fillOpacity="0.7"
                        />
                      </svg>
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
                  className="w-full font-semibold hover:opacity-90 active:scale-[0.99] transition-all bg-[#00D1FF] text-[#000000] p-6 text-lg"
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
