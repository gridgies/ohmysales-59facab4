const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
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
          <p className="text-sm text-muted-foreground font-light">
            © {currentYear} ohmysales. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
