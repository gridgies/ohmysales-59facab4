'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Copy, Check, ChevronUp, ChevronDown, Flame, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRating } from "@/hooks/useRating";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Sale {
  id: string;
  retailer: string;
  logo: string;
  image: string | null;
  title: string;
  discount: string;
  code: string | null;
  start_date: string;
  end_date: string;
  url: string;
  featured: boolean;
  categories: string[];
  created_at: string;
}

interface Comment {
  id: string;
  sale_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    email: string;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  women: 'Damen',
  men: 'Herren',
  accessories: 'Accessoires',
  beauty: 'Beauty',
};

interface SaleDetailClientProps {
  initialSale: Sale;
}

export default function SaleDetailClient({ initialSale }: SaleDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { rating, hasVoted, isLoading, voteHot, voteCold } = useRating(initialSale.id);

  useEffect(() => {
    fetchComments();
  }, [initialSale.id]);

  const fetchComments = async () => {
    // @ts-ignore - sale_comments table not in generated types
    const response: any = await (supabase as any)
      .from("sale_comments")
      .select(`
        *,
        profiles (
          email
        )
      `)
      .eq("sale_id", initialSale.id)
      .order("created_at", { ascending: false });

    const { data, error } = response;

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    setComments(data || []);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Bitte melde dich an, um zu kommentieren");
      router.push("/auth");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Kommentar darf nicht leer sein");
      return;
    }

    setIsSubmitting(true);

    // @ts-ignore - sale_comments table not in generated types
    const { error } = await (supabase as any)
      .from("sale_comments")
      .insert({
        sale_id: initialSale.id,
        user_id: user.id,
        content: newComment.trim(),
      });

    if (error) {
      toast.error("Fehler beim Posten des Kommentars");
      setIsSubmitting(false);
      return;
    }

    toast.success("Kommentar gepostet!");
    setNewComment("");
    setIsSubmitting(false);
    fetchComments();
  };

  const handleCopyCode = () => {
    if (initialSale.code) {
      navigator.clipboard.writeText(initialSale.code);
      setCopied(true);
      toast.success("Code kopiert!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getUserDisplayName = (email: string) => {
    return email.split("@")[0];
  };

  const isExpired = new Date(initialSale.end_date) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => {}} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Übersicht
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Image */}
          <div>
            {initialSale.image && (
              <div className="border border-border overflow-hidden bg-muted/20">
                <img
                  src={initialSale.image}
                  alt={initialSale.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Retailer */}
            <div className="flex items-center gap-3">
              <img
                src={initialSale.logo}
                alt={initialSale.retailer}
                className="h-16 w-16 object-contain"
              />
              <h2 className="text-xl font-medium">{initialSale.retailer}</h2>
            </div>

            {/* Categories */}
            {initialSale.categories && initialSale.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {initialSale.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 text-xs uppercase tracking-wider bg-muted/50 text-muted-foreground border border-border"
                  >
                    {CATEGORY_LABELS[cat] || cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold">{initialSale.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full shadow-md flex items-center">
                <button
                  onClick={voteHot}
                  disabled={isLoading || isExpired}
                  className={`w-10 h-10 flex items-center justify-center rounded-l-full transition-colors ${
                    hasVoted === 'hot'
                      ? 'bg-green-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Hot"
                >
                  <ChevronUp className="h-5 w-5" strokeWidth={3} />
                </button>

                <div className="px-3 min-w-[60px] flex items-center justify-center">
                  {rating.is_hot && <Flame className="h-4 w-4 text-green-500 mr-1" />}
                  <span className={`text-sm font-bold ${
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
                  <span className="text-xs text-gray-400 ml-1">°</span>
                </div>

                <button
                  onClick={voteCold}
                  disabled={isLoading || isExpired}
                  className={`w-10 h-10 flex items-center justify-center rounded-r-full transition-colors ${
                    hasVoted === 'cold'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Cold"
                >
                  <ChevronDown className="h-5 w-5" strokeWidth={3} />
                </button>
              </div>

              {rating.is_hot && !isExpired && (
                <span className="bg-green-500 text-white px-3 py-1 text-sm font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  Hot Deal
                </span>
              )}
            </div>

            {/* Discount */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light text-primary">{initialSale.discount}</span>
              <span className="text-muted-foreground font-light">Rabatt</span>
            </div>

            {/* Code */}
            {initialSale.code && (
              <div className="border border-border p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Rabattcode {copied && '· Kopiert ✓'}
                </p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 font-mono text-lg font-semibold bg-muted/50 px-3 py-2">
                    {initialSale.code}
                  </code>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    size="icon"
                    disabled={isExpired}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Gültig bis: <span className="font-medium text-foreground">{formatDate(initialSale.end_date)}</span></p>
              {isExpired && (
                <p className="text-destructive font-medium">Dieser Sale ist abgelaufen</p>
              )}
            </div>

            {/* CTA Button */}
            <a
              href={initialSale.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block w-full text-center py-3 px-6 font-medium uppercase tracking-wider transition-colors ${
                isExpired
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-foreground text-background hover:bg-foreground/90'
              }`}
            >
              {isExpired ? 'Sale Abgelaufen' : 'Zum Sale →'}
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Kommentare ({comments.length})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Schreibe einen Kommentar..."
                className="mb-3"
                rows={4}
              />
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Wird gepostet...' : 'Kommentar posten'}
              </Button>
            </form>
          ) : (
            <div className="mb-8 p-4 border border-border bg-muted/20">
              <p className="text-sm text-muted-foreground">
                <Link href="/auth" className="text-primary hover:underline">
                  Melde dich an
                </Link>
                {' '}um einen Kommentar zu schreiben.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Noch keine Kommentare. Sei der Erste!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border border-border p-4 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm">
                      {getUserDisplayName(comment.profiles.email)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
