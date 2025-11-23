const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8 border-b border-border/30">
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          🖤 BLACK FRIDAY Fashion Sales 2025
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Die besten Mode Angebote und Rabattcodes für Deutschland.
          Spare bis zu <span className="font-semibold text-foreground">70%</span> bei H&M, Zara, Zalando, About You und über 100 Premium-Marken.
          Täglich aktualisiert · Geprüfte Deals · Exklusive Rabattcodes
        </p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            ✓ Täglich neue Deals
          </span>
          <span className="flex items-center gap-1">
            ✓ Bis zu 70% Rabatt
          </span>
          <span className="flex items-center gap-1">
            ✓ 100+ Premium-Marken
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
