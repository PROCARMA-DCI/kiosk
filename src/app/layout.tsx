import localFont from "next/font/local";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${avenir.variable} ${uniSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
