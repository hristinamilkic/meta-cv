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
  imageSrc = "/cv2.jpg",
  bottomLinks,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col justify-between relative">
      <div className="flex flex-1 items-center justify-center w-full max-w-6xl mx-auto py-8">
        <div className="flex-1 flex flex-col justify-center items-center px-8 max-w-md w-full">
          <div className="w-full flex flex-col items-center sm:items-start">
            <h1 className="text-5xl font-extrabold tracking-wider text-[hsl(var(--mc-background))] mb-2 text-center sm:text-left">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-[hsl(var(--mc-background))] mb-8 text-center sm:text-left">
                {subtitle}
              </p>
            )}
            <div className="w-full flex flex-col items-center sm:items-start">
              {children}
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-1 items-center justify-center p-8">
          <div className="rounded-3xl overflow-hidden shadow-2xl w-full max-w-xl aspect-video bg-[hsl(var(--mc-warm))] flex items-center justify-center">
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
    </div>
  );
}
