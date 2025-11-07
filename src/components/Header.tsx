const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-light tracking-tight text-foreground">
          ohmysales
        </h1>
        <div className="flex items-center gap-6 text-sm text-muted-foreground font-light">
          <span>24 Aktive Sales</span>
          <span>18 Händler</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
