import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: email.toLowerCase().trim() }]);

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          toast.error("Diese E-Mail ist bereits registriert.");
        } else {
          toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
      } else {
        toast.success("Vielen Dank! Sie wurden erfolgreich angemeldet.");
        setEmail("");
      }
    } catch (error) {
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <div className="bg-card border border-border p-12 text-center">
        <h3 className="text-3xl font-light text-foreground mb-4">
          Nie wieder einen Sale verpassen
        </h3>
        <p className="text-muted-foreground font-light mb-8">
          Erhalten Sie wöchentlich die besten Fashion Sales direkt in Ihr Postfach
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Ihre E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-background border-border font-light"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors font-light uppercase tracking-wider text-sm px-8"
          >
            {isSubmitting ? "Wird geladen..." : "Anmelden"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default EmailSignup;
