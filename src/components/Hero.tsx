const Hero = () => {
  return (
    <section className="bg-neutral-50/50 border-b border-border/30">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            💻 CYBER MONDAY Fashion Sales 2025
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
            Die besten Mode Angebote und Rabattcodes für Deutschland.
            Spare bis zu <span className="font-semibold text-foreground">70%</span> bei H&M, Zara, Zalando, About You und über 100 Premium-Marken.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              ✓ Täglich neue Deals
            </span>
            <span className="flex items-center gap-1.5">
              ✓ Bis zu 70% Rabatt
            </span>
            <span className="flex items-center gap-1.5">
              ✓ 100+ Premium-Marken
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
