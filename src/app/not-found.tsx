import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-light text-foreground">404</h1>
        <p className="text-xl text-muted-foreground font-light">
          Seite nicht gefunden
        </p>
        <Link
          href="/"
          className="inline-block bg-foreground text-background px-6 py-3 font-light uppercase tracking-wider hover:bg-foreground/90 transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
