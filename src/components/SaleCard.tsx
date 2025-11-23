import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ChevronUp, ChevronDown, Flame, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useRating } from "@/hooks/useRating";

interface SaleCardProps {
  id: string;
  retailer: string;
  logo: string;
  image?: string;
  title: string;
  discount: string;
  code?: string;
  endDate: string;
  url: string;
  featured?: boolean;
  categories?: string[];
  isExpired?: boolean;
  commentCount?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  women: 'Damen',
  men: 'Herren',
  accessories: 'Accessoires',
  beauty: 'Beauty',
  unisex: 'Unisex',
};

const SaleCard = ({
  id,
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
  commentCount = 0,
}: SaleCardProps) => {
  const [copied, setCopied] = useState(false);
  const { rating, hasVoted, isLoading, voteHot, voteCold } = useRating(id);

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code kopiert!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Link to={`/sale/${id}`}>
      <article
        className={`bg-card border border-border overflow-hidden transition-all duration-300 relative ${
          isExpired
            ? 'opacity-60 cursor-not-allowed'
            : 'hover:border-primary/40 hover:shadow-lg'
        } group ${featured ? 'border-t-4 border-t-primary' : ''}`}
      >
      {/* Hot Badge - Top Left */}
      {!isExpired && rating.is_hot && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1">
          <Flame className="h-3 w-3" />
          <span>Hot</span>
        </div>
      )}

      {/* Smaller mydealz-style Rating Display - Top Right */}
      {!isExpired && (
        <div className="absolute top-2 right-2 z-10 bg-white rounded-full shadow-md flex items-center text-xs">
          <button
            onClick={voteHot}
            disabled={isLoading}
            className={`w-7 h-7 flex items-center justify-center rounded-l-full transition-colors ${
              hasVoted === 'hot'
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Hot"
          >
            <ChevronUp className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
          
          <div className="px-1.5 min-w-[40px] flex items-center justify-center">
            {rating.is_hot && <Flame className="h-3 w-3 text-green-500 mr-0.5" />}
            <span className={`text-xs font-bold ${
              rating.hot_votes > rating.cold_votes 
                ? 'text-green-600' 
                : rating.cold_votes > rating.hot_votes 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}>
              {rating.hot_votes === 0 && rating.cold_votes === 0 ? (
                <span className="text-gray-400">—</span>
              ) : (
                <>
                  {rating.hot_votes > rating.cold_votes && '+'}
                  {rating.hot_votes - rating.cold_votes}
                </>
              )}
            </span>
            <span className="text-[9px] text-gray-400 ml-0.5">°</span>
          </div>
          
          <button
            onClick={voteCold}
            disabled={isLoading}
            className={`w-7 h-7 flex items-center justify-center rounded-r-full transition-colors ${
              hasVoted === 'cold'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Cold"
          >
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="h-40 overflow-hidden relative bg-muted/20">
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-contain transition-transform duration-500 ${
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
      
      {/* Content */}
      <div className={`p-3 space-y-2.5 ${isExpired ? 'grayscale' : ''}`}>
        {/* Retailer & Logo */}
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt={retailer}
            className="h-12 w-12 object-contain"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-light text-foreground text-xs truncate">{retailer}</h3>
          </div>
        </div>

        {/* Category Tags */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <span
                key={category}
                className="px-1.5 py-0.5 text-[10px] uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border font-light"
              >
                {CATEGORY_LABELS[category] || category}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h4 className="text-base font-light text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
          {title}
        </h4>

        {/* Discount */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-light text-primary">{discount}</span>
          <span className="text-muted-foreground font-light text-xs">Rabatt</span>
        </div>

        {/* Code */}
        {code && (
          <button
            onClick={handleCopyCode}
            disabled={isExpired}
            className={`w-full bg-muted/50 px-2.5 py-1.5 border border-border transition-colors text-left group/code ${
              isExpired ? 'cursor-not-allowed opacity-60' : 'hover:border-foreground'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                  Code {copied && '· Kopiert ✓'}
                </p>
                <p className="font-mono text-xs text-foreground truncate">{code}</p>
              </div>
              <div className="pt-0.5 flex-shrink-0">
                {copied ? (
                  <Check className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground opacity-50 group-hover/code:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </button>
        )}

        {/* End Date */}
        <p className="text-xs text-muted-foreground font-light">
          Endet am {endDate}
        </p>

        {/* Comments Count */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{commentCount} {commentCount === 1 ? 'Kommentar' : 'Kommentare'}</span>
        </div>

        {/* CTA */}
        {isExpired ? (
          <div className="inline-block text-xs uppercase tracking-widest text-muted-foreground cursor-not-allowed pb-1 font-medium">
            ZUM SALE
          </div>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block text-xs uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1 font-medium"
          >
            ZUM SALE →
          </a>
        )}
      </div>
    </article>
    </Link>
  );
};

export default SaleCard;
