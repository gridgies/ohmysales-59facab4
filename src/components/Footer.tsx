const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Über ohmysales</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Deine Plattform für Premium Fashion Sales und exklusive Rabattcodes.
              Spare täglich bei H&M, Zara, Zalando, About You, ASOS, Mango und über 100 weiteren Top-Marken.
              Black Friday 2025 und das ganze Jahr.
            </p>
          </div>

          {/* Benefits Section */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Deine Vorteile</h3>
            <ul className="text-sm text-muted-foreground font-light space-y-2">
              <li>✓ Täglich aktualisierte Fashion Sales</li>
              <li>✓ Exklusive Rabattcodes & Gutscheine</li>
              <li>✓ Bis zu 70% Rabatt sparen</li>
              <li>✓ Geprüfte Premium Brands</li>
              <li>✓ Black Friday & Cyber Monday</li>
            </ul>
          </div>

          {/* Categories Section */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Kategorien</h3>
            <ul className="text-sm text-muted-foreground font-light space-y-2">
              <li>Damen Mode Sale</li>
              <li>Herren Mode Sale</li>
              <li>Accessoires Sale</li>
              <li>Schuhe Sale</li>
              <li>Beauty & Kosmetik Sale</li>
              <li>Designer Mode Sale</li>
            </ul>
          </div>

          {/* Popular Brands Section */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Beliebte Marken</h3>
            <ul className="text-sm text-muted-foreground font-light space-y-2">
              <li>H&M Sale</li>
              <li>Zara Sale</li>
              <li>Zalando Sale</li>
              <li>About You Sale</li>
              <li>ASOS Sale</li>
              <li>Mango Sale</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-6 border-t border-border">
          <nav className="flex gap-8 text-sm font-light">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Kontakt
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Impressum
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Datenschutz
            </a>
          </nav>
          <p className="text-sm text-muted-foreground font-light text-center">
            © {currentYear} ohmysales. Alle Rechte vorbehalten.<br />
            <span className="text-xs">Premium Fashion Sales, Black Friday Deals & Rabattcodes für Deutschland · Mode Sale · Fashion Outlet · Designer Sale</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
