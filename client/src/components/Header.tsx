import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full bg-transparent shadow-none border-none flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-2 sm:py-4 gap-2 sm:gap-0">
      <span className="text-gray-300 font-thin text-sm">
        © 2025 All rights reserved
      </span>
      <div className="flex gap-2 sm:gap-4">
        <Link href="/login">
          <Button className="uppercase border border-white rounded-lg px-4 sm:px-6 py-2 text-white text-base sm:text-lg font-medium hover:bg-white/10 bg-transparent transition">
            login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="uppercase border border-white rounded-lg px-4 sm:px-6 py-2 text-white text-base sm:text-lg font-medium hover:bg-white/10 bg-transparent transition">
            register
          </Button>
        </Link>
      </div>
      <div className="text-right text-xs text-gray-300">
        <div className="font-thin text-sm">
          Designed & Developed by
          <br />
          Hristina Milkić
        </div>
      </div>
    </header>
  );
}
