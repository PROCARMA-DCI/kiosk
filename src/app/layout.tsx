import { Toaster } from "@/components/ui/sonner";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import AppLayout from "./AppLayout";
import "./globals.css";
const avenir = localFont({
  src: [
    { path: "../fonts/AvenirLTProLight.otf", weight: "300" },
    { path: "../fonts/AvenirLTProBook.otf", weight: "400" },
    { path: "../fonts/AvenirLTProMedium.otf", weight: "500" },
    { path: "../fonts/AvenirLTProHeavy.otf", weight: "700" },
    { path: "../fonts/AvenirLTProBlack.otf", weight: "800" },
  ],
  variable: "--font-avenir",
  display: "swap",
});

const uniSans = localFont({
  src: [
    { path: "../fonts/UniSansHeavy.otf", weight: "900" },
    { path: "../fonts/UniSansRegular.ttf", weight: "400" },
    { path: "../fonts/UniSansThin.otf", weight: "200" },
  ],
  variable: "--font-uni-sans",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${avenir.variable} ${uniSans.variable} ${roboto.variable} antialiased`}
      >
        <AppLayout>
          <div id="modal-root" />
          {children}
          <Toaster />
        </AppLayout>
      </body>
    </html>
  );
}
