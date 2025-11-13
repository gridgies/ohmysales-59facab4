import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
  isExpired?: boolean; // Add expired state
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
  isExpired = false,
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
      className={`bg-card border border-border overflow-hidden transition-all duration-300 ${
        isExpired 
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:border-primary/40 hover:shadow-lg'
      } group ${featured ? 'border-t-2 border-t-primary' : ''}`}
    >
      {image && (
        <div className="h-48 overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isExpired ? 'grayscale' : 'group-hover:scale-105'
            }`}
          />
          {isExpired && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground px-4 py-1.5 text-sm font-medium uppercase tracking-wider">
                Abgelaufen
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className={`p-4 space-y-3 ${isExpired ? 'grayscale' : ''}`}>
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt={retailer}
            className="h-10 w-10 object-contain"
          />
          <div className="flex-1">
            <h3 className="font-light text-foreground text-xs">{retailer}</h3>
          </div>
        </div>

        {/* Category Tags */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <span
                key={category}
                className="px-1.5 py-0.5 text-xs uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border font-light"
              >
                {CATEGORY_LABELS[category] || category}
              </span>
            ))}
          </div>
        )}

        <h4 className="text-lg font-light text-foreground leading-tight">
          {title}
        </h4>

        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-light text-primary">{discount}</span>
          <span className="text-muted-foreground font-light text-sm">Rabatt</span>
        </div>

        {code && (
          <button
            onClick={handleCopyCode}
            disabled={isExpired}
            className={`w-full bg-muted/50 px-3 py-1.5 border border-border transition-colors text-left group/code ${
              isExpired ? 'cursor-not-allowed opacity-60' : 'hover:border-foreground'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Code {copied && '· Kopiert ✓'}
                </p>
                <p className="font-mono text-xs text-foreground">{code}</p>
              </div>
              <div className="pt-0.5">
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-50 group-hover/code:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </button>
        )}

        <p className="text-xs text-muted-foreground font-light">
          Endet am {endDate}
        </p>

        {isExpired ? (
          <div className="inline-block text-xs uppercase tracking-widest text-muted-foreground cursor-not-allowed pb-1 font-medium">
            ZUM SALE
          </div>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1 font-medium"
          >
            ZUM SALE
          </a>
        )}
      </div>
    </article>
  );
};

export default SaleCard;
