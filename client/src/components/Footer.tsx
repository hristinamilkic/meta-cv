import Link from "next/link";
import { Icon } from "./Icon";

export default function Footer() {
  return (
    <div
      className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-[hsl(var(--mc-background))]
 rounded-3xl shadow-xl flex flex-row justify-between items-center px-3 sm:px-7 py-2 sm:py-2 gap-4 sm:gap-8 z-10 w-[100vw] max-w-3xl"
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
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain hover:scale-110 transition-all duration-300"
          />
          <span className="hidden sm:inline text-black">Home</span>
        </Link>
        <div className="w-px bg-slate-300"></div>
        <Link href="/templates" className="flex flex-col items-center">
          <Icon
            name="template"
            className="h-8 w-8 sm:h-9 sm:w-9 hover:scale-110 transition-all duration-300"
          />
          <span className="hidden sm:inline text-black">Templates</span>
        </Link>
        <div className="w-px bg-slate-300"></div>
        <Link href="/build" className="flex flex-col items-center">
          <Icon
            name="cv"
            className="h-8 w-8 sm:h-9 sm:w-9 hover:scale-110 transition-all duration-300"
          />
          <span className="hidden sm:inline text-black">Build CV</span>
        </Link>
      </div>
    </div>
  );
}
