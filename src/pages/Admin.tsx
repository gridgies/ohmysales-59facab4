import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Edit, Plus, X } from "lucide-react";
import Header from "@/components/Header";
import { z } from "zod";

const saleSchema = z.object({
  retailer: z.string().trim().min(1, "Händler ist erforderlich").max(100, "Händler darf maximal 100 Zeichen lang sein"),
  logo: z.string().url("Ungültige Logo-URL").max(500, "Logo-URL darf maximal 500 Zeichen lang sein"),
  image: z.string().url("Ungültige Bild-URL").max(500, "Bild-URL darf maximal 500 Zeichen lang sein").optional().or(z.literal("")),
  title: z.string().trim().min(1, "Titel ist erforderlich").max(200, "Titel darf maximal 200 Zeichen lang sein"),
  discount: z.string().trim().min(1, "Rabatt ist erforderlich").max(50, "Rabatt darf maximal 50 Zeichen lang sein"),
  code: z.string().trim().max(50, "Code darf maximal 50 Zeichen lang sein").optional().or(z.literal("")),
  end_date: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Enddatum muss heute oder in der Zukunft liegen"
  }),
  url: z.string().url("Ungültige Sale-URL").max(1000, "Sale-URL darf maximal 1000 Zeichen lang sein"),
  category: z.enum(["women", "men", "accessories", "unisex"]),
  featured: z.boolean()
});

interface Sale {
  id: string;
  retailer: string;
  logo: string;
  image: string | null;
  title: string;
  discount: string;
  code: string | null;
  end_date: string;
  url: string;
  featured: boolean;
  category: string;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  const [formData, setFormData] = useState({
    retailer: "",
    logo: "",
    image: "",
    title: "",
    discount: "",
    code: "",
    end_date: "",
    url: "",
    featured: false,
    category: "women" as const,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSales();
    }
  }, [user, isAdmin]);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Fehler beim Laden der Sales");
      return;
    }

    setSales(data || []);
  };

  const resetForm = () => {
    setFormData({
      retailer: "",
      logo: "",
      image: "",
      title: "",
      discount: "",
      code: "",
      end_date: "",
      url: "",
      featured: false,
      category: "women",
    });
    setValidationErrors({});
    setIsEditing(false);
    setEditingSale(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form data
    try {
      saleSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setValidationErrors(errors);
        toast.error("Bitte überprüfen Sie die Eingaben");
        return;
      }
    }

    const saleData = {
      ...formData,
      image: formData.image || null,
      code: formData.code || null,
    };

    if (editingSale) {
      const { error } = await supabase
        .from("sales")
        .update(saleData)
        .eq("id", editingSale.id);

      if (error) {
        toast.error("Fehler beim Aktualisieren");
        return;
      }
      toast.success("Sale aktualisiert");
    } else {
      const { error } = await supabase.from("sales").insert([saleData]);

      if (error) {
        toast.error("Fehler beim Erstellen");
        return;
      }
      toast.success("Sale erstellt");
    }

    resetForm();
    fetchSales();
  };

  const handleEdit = (sale: Sale) => {
    setFormData({
      retailer: sale.retailer,
      logo: sale.logo,
      image: sale.image || "",
      title: sale.title,
      discount: sale.discount,
      code: sale.code || "",
      end_date: sale.end_date,
      url: sale.url,
      featured: sale.featured,
      category: sale.category as any,
    });
    setEditingSale(sale);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie diesen Sale wirklich löschen?")) return;

    const { error } = await supabase.from("sales").delete().eq("id", id);

    if (error) {
      toast.error("Fehler beim Löschen");
      return;
    }

    toast.success("Sale gelöscht");
    fetchSales();
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Laden...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-light text-foreground">Admin Dashboard</h1>
          <Button onClick={() => navigate("/")} variant="outline" className="font-light">
            Zurück zur Startseite
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center font-light">
                {isEditing ? "Sale bearbeiten" : "Neuer Sale"}
                {isEditing && (
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-light">Händler</Label>
                  <Input
                    value={formData.retailer}
                    onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
                    required
                    className="font-light"
                  />
                  {validationErrors.retailer && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.retailer}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Logo URL</Label>
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    required
                    className="font-light"
                  />
                  {validationErrors.logo && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.logo}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Bild URL (optional)</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="font-light"
                  />
                  {validationErrors.image && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.image}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Titel</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="font-light"
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.title}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Rabatt (z.B. 30%)</Label>
                  <Input
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    required
                    className="font-light"
                  />
                  {validationErrors.discount && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.discount}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Promo Code (optional)</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="font-light"
                  />
                  {validationErrors.code && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.code}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Enddatum</Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="font-light"
                  />
                  {validationErrors.end_date && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.end_date}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Sale URL</Label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    className="font-light"
                  />
                  {validationErrors.url && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.url}</p>
                  )}
                </div>

                <div>
                  <Label className="font-light">Kategorie</Label>
                  <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="font-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Damen</SelectItem>
                      <SelectItem value="men">Herren</SelectItem>
                      <SelectItem value="accessories">Accessoires</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="featured" className="font-light cursor-pointer">
                    Featured
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-light uppercase tracking-wider">
                  {isEditing ? "Aktualisieren" : "Erstellen"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Sales List */}
          <Card>
            <CardHeader>
              <CardTitle className="font-light">Alle Sales ({sales.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {sales.map((sale) => (
                  <div key={sale.id} className="border border-border p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-light text-foreground">{sale.retailer}</h3>
                        <p className="text-sm text-muted-foreground font-light">{sale.title}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(sale)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(sale.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-light">
                      {sale.discount} • {sale.category} • Endet: {sale.end_date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
