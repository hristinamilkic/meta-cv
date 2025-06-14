import Link from "next/link";
import { Icon } from "./Icon";

export default function Footer() {
  return (
    <div
      className="fixed bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 bg-[hsl(var(--mc-background))]
 rounded-3xl shadow-xl flex flex-row justify-between items-center px-4 sm:px-8 py-2 sm:py-3 gap-4 sm:gap-8 z-10 w-[95vw] max-w-3xl"
    >
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-lg sm:text-xl"
      >
        <img
          src="/logo-metacv.png"
          alt="Meta CV Logo"
          className="h-12 sm:h-16 object-contain"
        />
      </Link>

      <div className="flex flex-row gap-3 sm:gap-6 text-sm sm:text-base font-light">
        <Link href="/" className="flex flex-col items-center">
          <Icon
            name="home"
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <div className="w-px bg-slate-300"></div>
        <Link href="/templates" className="flex flex-col items-center">
          <Icon name="template" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="hidden sm:inline">Templates</span>
        </Link>
        <div className="w-px bg-slate-300"></div>
        <Link href="/build" className="flex flex-col items-center">
          <Icon name="cv" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="hidden sm:inline">Build CV</span>
        </Link>
      </div>
    </div>
  );
}
