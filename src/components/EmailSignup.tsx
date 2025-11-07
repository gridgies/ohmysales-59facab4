import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EmailSignup = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Vielen Dank! Sie wurden erfolgreich angemeldet.");
      setEmail("");
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
            className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors font-light uppercase tracking-wider text-sm px-8"
          >
            Anmelden
          </Button>
        </form>
      </div>
    </section>
  );
};

export default EmailSignup;
