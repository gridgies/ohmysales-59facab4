'use client';

import { useState } from "react";
import Link from "next/link";
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
    <Link href={`/sale/${id}`}>
      <article
        className={`bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 relative shadow-sm ${
          isExpired
            ? 'opacity-60'
            : 'hover:border-primary/40 hover:shadow-xl hover:-translate-y-1'
        } group ${featured ? 'border-t-4 border-t-primary' : ''}`}
      >
      {/* Hot Badge - Top Left */}
      {!isExpired && rating.is_hot && (
        <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1">
          <Flame className="h-3 w-3" />
          Hot
        </div>
      )}

      {/* Smaller mydealz-style Rating Display - Top Right */}
      {!isExpired && (
        <div className="absolute top-2 right-2 z-10 bg-white rounded-full shadow-md flex items-center text-xs">
          <button
            onClick={(e) => {
              e.preventDefault();
              voteHot();
            }}
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
            onClick={(e) => {
              e.preventDefault();
              voteCold();
            }}
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
            loading="lazy"
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
      <div className={`p-5 space-y-3 ${isExpired ? 'grayscale' : ''}`}>
        {/* Retailer Logo */}
        <div className="flex items-center justify-center">
          <img
            src={logo}
            alt={retailer}
            loading="lazy"
            className="h-8 object-contain"
          />
        </div>

        {/* Title */}
        <h4 className="text-base font-medium text-foreground leading-tight line-clamp-2 min-h-[3rem] text-center">
          {title}
        </h4>

        {/* Discount */}
        <div className="text-center">
          <span className="text-3xl font-bold text-primary">{discount}</span>
          <span className="text-muted-foreground font-light text-sm ml-2">Rabatt</span>
        </div>

        {/* Code - Always visible */}
        <div className="bg-muted/30 px-3 py-2.5 border border-border/50 min-h-[60px] flex items-center justify-center">
          {code ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCopyCode();
              }}
              className="w-full text-center hover:bg-muted/20 transition-colors rounded px-2 py-1"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Code {copied && '· Kopiert ✓'}
                </p>
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              <p className="font-mono text-sm font-semibold text-foreground">{code}</p>
            </button>
          ) : (
            <p className="text-xs text-muted-foreground">Kein Code benötigt</p>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{commentCount}</span>
          </div>
          <span>Bis {endDate}</span>
        </div>
      </div>
    </article>
    </Link>
  );
};

export default SaleCard;
