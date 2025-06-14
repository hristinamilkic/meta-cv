import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-[hsl(var(--mc-primary))] via-[hsl(var(--mc-secondary))] to-[hsl(var(--mc-warm))] overflow-hidden">
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="opacity-30">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="3" fill="#fff" fillOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>
      <main className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32 gap-8 w-full">
        {/* Left: Text */}
        <div className="max-w-xl w-full text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg leading-tight">
            Build your
            <br />
            perfect resume
            <br />
            in minutes!
          </h1>
          <p className="text-base sm:text-lg text-white/90 mb-8">
            Welcome to the Meta CV app, where crafting a standout CV is made
            easy and efficient. Transform your career prospects with our
            user-friendly tools and templates.
          </p>
          <Button className="bg-[hsl(var(--mc-accent))] text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:bg-[hsl(var(--mc-warm))] transition font-semibold w-full sm:w-auto">
            BUILD YOUR CV
          </Button>
        </div>
        {/* Right: Illustration */}
        <div className="relative flex-1 flex justify-center items-center mt-12 md:mt-0 w-full">
          <div className="w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-black/80 flex items-center justify-center shadow-2xl relative overflow-visible">
            {/* Floating icons/images */}
            <span className="absolute -top-6 sm:-top-8 left-6 sm:left-12 bg-white rounded-xl p-2 sm:p-3 shadow-lg text-2xl sm:text-3xl">
              📝
            </span>
            <span className="absolute -bottom-6 sm:-bottom-8 right-6 sm:right-12 bg-white rounded-xl p-2 sm:p-3 shadow-lg text-2xl sm:text-3xl">
              📋
            </span>
            <span className="absolute top-1/2 -left-6 sm:-left-8 -translate-y-1/2 bg-white rounded-xl p-2 sm:p-3 shadow-lg text-2xl sm:text-3xl">
              ✅
            </span>
            <span className="absolute top-1/2 -right-6 sm:-right-8 -translate-y-1/2 bg-white rounded-xl p-2 sm:p-3 shadow-lg text-2xl sm:text-3xl">
              💡
            </span>
            <span className="text-white text-5xl sm:text-7xl">🧑‍💼</span>
          </div>
        </div>
      </main>
    </div>
  );
}
