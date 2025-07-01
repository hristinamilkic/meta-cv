import Link from "next/link";
export default function Home() {
  return (
    <main className="relative z-10 flex flex-col md:flex-row items-center justify-center px-2 sm:px-4 gap-8 sm:gap-12 md:gap-20 lg:gap-28 w-full min-h-screen py-8 md:py-0 min-w-0">
      <div className="w-full max-w-xl text-center md:text-left flex flex-col items-center md:items-start min-w-0">
        <h1 className="tracking-wide text-3xl sm:text-6xl text-[hsl(var(--mc-background))] font-bold mb-4 drop-shadow-xl leading-normal">
          Build your perfect resume in minutes!
        </h1>
        <p className="text-sm sm:text-md lg:text-xl text-[hsl(var(--mc-background))] mb-8 font-thin max-w-lg">
          Welcome to the Meta CV app, where crafting a standout CV is made easy
          and efficient. Transform your career prospects with our user-friendly
          tools and templates.
        </p>

        <Link
          href="/templates"
          className="bg-[hsl(var(--mc-warm))] text-white text-xs sm:text-md lg:text-lg px-4 sm:px-6 py-3 sm:py-3 rounded-2xl shadow-xl hover:bg-[hsl(var(--mc-background))] hover:text-[hsl(var(--mc-primary))] transition duration-200  font-medium w-full sm:w-auto"
        >
          {" "}
          BUILD YOUR CV
        </Link>
      </div>

      <div className="relative flex justify-center items-center w-full max-w-xs sm:max-w-md md:max-w-lg min-w-0">
        <div
          className="w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-cover bg-center flex items-center justify-center shadow-2xl relative"
          style={{ backgroundImage: "url('/cv.jpg')" }}
        >
          <img
            src="/cv1.png"
            className="w-20 sm:w-32 md:w-44 absolute top-1/4 right-0 sm:-right-6 md:-right-12 -translate-y-1/2 rounded-xl"
            alt="CV"
          />
          <img
            src="/cv2.png"
            className="w-20 sm:w-32 md:w-44 absolute bottom-1/4 left-0 sm:-left-6 md:-left-12 translate-y-1/2 rounded-xl"
            alt="CV"
          />
        </div>
      </div>
    </main>
  );
}
