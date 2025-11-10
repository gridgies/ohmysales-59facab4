import { useState } from "react";
import { toast } from "sonner";

interface SaleCardProps {
  retailer: string;
  logo: string;
  image?: string;
  title: string;
  discount: string;
  code?: string;
  endDate: string;
  url: string;
  featured?: boolean;
  categories?: string[]; // Add categories prop
}

// Category labels for display
const CATEGORY_LABELS: Record<string, string> = {
  women: 'Damen',
  men: 'Herren',
  accessories: 'Accessoires',
  beauty: 'Beauty',
  // Add more as needed
};

const SaleCard = ({
  retailer,
  logo,
  image,
  title,
  discount,
  code,
  endDate,
  url,
  featured = false,
  categories = [],
}: SaleCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code kopiert!");
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <article 
      className={`bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg group ${
        featured ? 'border-t-2 border-t-primary' : ''
      }`}
    >
      {image && (
        <div className="h-60 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt={retailer}
            className="h-12 w-12 object-contain"
          />
          <div className="flex-1">
            <h3 className="font-light text-foreground text-sm">{retailer}</h3>
          </div>
        </div>

        {/* Category Tags */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border font-light"
              >
                {CATEGORY_LABELS[category] || category}
              </span>
            ))}
          </div>
        )}

        <h4 className="text-xl font-light text-foreground leading-tight">
          {title}
        </h4>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-light text-primary">{discount}</span>
          <span className="text-muted-foreground font-light">Rabatt</span>
        </div>

        {code && (
          <button
            onClick={handleCopyCode}
            className="w-full bg-muted/50 px-4 py-2 border border-border hover:border-foreground transition-colors text-left"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Code {copied && '· Kopiert ✓'}
            </p>
            <p className="font-mono text-sm text-foreground">{code}</p>
          </button>
        )}

        <p className="text-sm text-muted-foreground font-light">
          Endet am {endDate}
        </p>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1 font-medium"
        >
          ZUM SALE
        </a>
      </div>
    </article>
  );
};

export default SaleCard;
