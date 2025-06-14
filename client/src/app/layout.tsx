import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RandomCirclesOverlay, { RandomCirclesOverlay2 } from "@/components/Dots";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "META CV",
  description: "Final thesis project by Hristina Milkic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${montserrat.variable} relative min-h-screen font-sans text-white`}
      >
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(200deg,_hsl(var(--mc-primary))_0%,_hsl(var(--mc-secondary))_30%,_hsl(var(--mc-warm))_95%)]" />
        <RandomCirclesOverlay />
        <RandomCirclesOverlay2 />
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
