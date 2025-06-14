import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Meta CV",
  description: "Final thesis project by Hristina Milkic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen overflow-hidden">
      <body
        className={`${montserrat.variable} h-screen overflow-hidden font-sans`}
      >
        <section className="min-h-screen h-screen w-full flex flex-col justify-between bg-gradient-to-br from-[hsl(var(--mc-primary))] via-[hsl(var(--mc-secondary))] to-[hsl(var(--mc-warm))]">
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </section>
      </body>
    </html>
  );
}
