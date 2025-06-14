export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--mc-primary))] via-[hsl(var(--mc-secondary))] to-[hsl(var(--mc-warm))] px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16 w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">Templates</h1>
      <div className="text-base sm:text-lg text-white/80 mb-8">Choose a template to start building your CV.</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <div className="bg-white/10 rounded-2xl h-40 sm:h-56 md:h-64 flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-dashed border-[hsl(var(--mc-accent))]">Template 1</div>
        <div className="bg-white/10 rounded-2xl h-40 sm:h-56 md:h-64 flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-dashed border-[hsl(var(--mc-accent))]">Template 2</div>
        <div className="bg-white/10 rounded-2xl h-40 sm:h-56 md:h-64 flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-dashed border-[hsl(var(--mc-accent))]">Template 3</div>
        <div className="bg-white/10 rounded-2xl h-40 sm:h-56 md:h-64 flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-dashed border-[hsl(var(--mc-accent))]">Template 4</div>
      </div>
    </div>
  );
} 