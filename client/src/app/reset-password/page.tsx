import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[hsl(var(--mc-primary))] via-[hsl(var(--mc-secondary))] to-[hsl(var(--mc-warm))] px-2 sm:px-4 w-full">
      <div className="flex flex-col md:flex-row w-full max-w-2xl md:max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-transparent">
        {/* Left: Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-10 py-8 sm:py-12 md:py-16">
          <span className="text-xs text-gray-300 mb-8">© 2025 All rights reserved</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">RESET PASSWORD</h1>
          <div className="text-base sm:text-lg text-white mb-8">META CV application</div>
          <form className="flex flex-col gap-4 sm:gap-6">
            <input type="email" placeholder="Email" className="bg-transparent border border-[hsl(var(--mc-accent))] rounded-xl px-4 sm:px-6 py-2 sm:py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--mc-accent))]" />
            <button type="submit" className="bg-[hsl(var(--mc-accent))] text-white text-base sm:text-lg font-semibold rounded-xl py-2 sm:py-3 mt-2 shadow-lg hover:bg-[hsl(var(--mc-warm))] transition">SEND RESET LINK</button>
          </form>
        </div>
        {/* Right: Image */}
        <div className="flex-1 bg-black/20 flex items-center justify-center p-4 sm:p-8">
          <img src="/resume-placeholder.jpg" alt="Resume" className="rounded-2xl w-full h-48 sm:h-72 md:h-96 object-cover" />
        </div>
      </div>
    </div>
  );
} 