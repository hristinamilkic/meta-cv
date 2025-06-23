import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  imageSrc?: string;
  bottomLinks?: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
  imageSrc = "/cv2.png",
  bottomLinks,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#6e256d] to-[#e7a18e] relative">
      <div className="flex flex-1 items-center justify-center w-full max-w-6xl mx-auto py-8">
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 max-w-md">
          <div className="w-full">
            <h1 className="text-5xl font-extrabold text-[#fff3e6] mb-2 text-left">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-[#fff3e6] mb-8 text-left">
                {subtitle}
              </p>
            )}
            <div className="w-full">{children}</div>
          </div>
        </div>
        {/* Right: Image */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl w-full max-w-xl aspect-video bg-[#fff3e6]/30 flex items-center justify-center">
            <Image
              src={imageSrc}
              alt="CV Preview"
              width={600}
              height={400}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
      </div>
      {/* Top left copyright & top right credit */}
    </div>
  );
}
