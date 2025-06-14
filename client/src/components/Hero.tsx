import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] px-8 pt-12 pb-32 relative">
      <div className="max-w-xl z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">Build your<br/>perfect resume<br/>in minutes!</h1>
        <p className="text-lg text-white/90 mb-8">Welcome to the Meta CV app, where crafting a standout CV is made easy and efficient. Transform your career prospects with our user-friendly tools and templates.</p>
        <Button className="bg-[#f49b8d] text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-[#e07b6b] transition font-semibold">BUILD YOUR CV</Button>
      </div>
      <div className="relative flex-1 flex justify-center items-center mt-12 md:mt-0">
        {/* Illustration placeholder */}
        <div className="w-[420px] h-[420px] rounded-full bg-black/80 flex items-center justify-center shadow-2xl relative">
          {/* Add floating icons/images here */}
          <span className="absolute -top-8 left-12 bg-white rounded-xl p-2 shadow-lg">✍️</span>
          <span className="absolute -bottom-8 right-12 bg-white rounded-xl p-2 shadow-lg">📋</span>
          <span className="text-white text-7xl">🧑‍💼</span>
        </div>
      </div>
    </section>
  );
} 