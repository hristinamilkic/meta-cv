export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--mc-primary))] via-[hsl(var(--mc-secondary))] to-[hsl(var(--mc-warm))] px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16 w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">Dashboard</h1>
      <div className="text-base sm:text-lg text-white/80 mb-8">My CV's</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 md:mb-12">
        {[1,2,3,4].map((i) => (
          <div key={i} className="bg-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center border-2 border-[hsl(var(--mc-accent))]">
            <img src="/resume-placeholder.jpg" alt="CV" className="rounded-xl w-full h-40 sm:h-48 object-cover mb-4" />
            <div className="flex gap-3 sm:gap-4">
              <button className="text-white hover:text-[hsl(var(--mc-accent))]">✏️</button>
              <button className="text-white hover:text-[hsl(var(--mc-accent))]">🗑️</button>
              <button className="text-white hover:text-[hsl(var(--mc-accent))]">⬇️</button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="bg-white/10 rounded-2xl p-4 sm:p-6 text-white">Stats 1</div>
        <div className="bg-white/10 rounded-2xl p-4 sm:p-6 text-white">Stats 2</div>
        <div className="bg-white/10 rounded-2xl p-4 sm:p-6 text-white">Stats 3</div>
      </div>
    </div>
  );
} 