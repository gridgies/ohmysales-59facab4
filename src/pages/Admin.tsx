import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Edit, X, Clock, RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import BulkUpload from "@/components/BulkUpload";
import RetailerManagement from "@/components/RetailerManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";

// Define available categories - add new ones here
const AVAILABLE_CATEGORIES = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'beauty', label: 'Beauty' },
  // Add more categories as needed:
  // { value: 'kids', label: 'Kids' },
  // { value: 'home', label: 'Home' },
];

const saleSchema = z.object({
  retailer: z.string().trim().min(1, "Retailer is required").max(100, "Retailer max 100 characters"),
  logo: z.string().url("Invalid logo URL").max(500, "Logo URL max 500 characters"),
  image: z.string().url("Invalid image URL").max(500, "Image URL max 500 characters").optional().or(z.literal("")),
  title: z.string().trim().min(1, "Title is required").max(200, "Title max 200 characters"),
  discount: z.string().trim().min(1, "Discount is required").max(50, "Discount max 50 characters"),
  code: z.string().trim().max(50, "Code max 50 characters").optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "End date must be today or in the future"
  }),
  url: z.string().url("Invalid sale URL").max(1000, "Sale URL max 1000 characters"),
  categories: z.array(z.string()).min(1, "At least one category is required"),
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
  start_date: string;
  end_date: string;
  url: string;
  featured: boolean;
  categories: string[];
  is_manually_expired: boolean | null;
}

interface Retailer {
  id: string;
  name: string;
  logo: string;
  website: string | null;
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
    start_date: new Date().toISOString().split('T')[0], // Default to today
    end_date: "",
    url: "",
    featured: false,
    categories: [] as string[],
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
      toast.error("Error loading sales");
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
      start_date: new Date().toISOString().split('T')[0], // Reset to today
      end_date: "",
      url: "",
      featured: false,
      categories: [],
    });
    setValidationErrors({});
    setIsEditing(false);
    setEditingSale(null);
  };

  const handleCategoryToggle = (categoryValue: string) => {
    setFormData(prev => {
      const categories = prev.categories.includes(categoryValue)
        ? prev.categories.filter(c => c !== categoryValue)
        : [...prev.categories, categoryValue];
      return { ...prev, categories };
    });
  };

  const handleRetailerSelect = (retailer: Retailer) => {
    setFormData(prev => ({
      ...prev,
      retailer: retailer.name,
      logo: retailer.logo,
    }));
    toast.success(`Retailer "${retailer.name}" selected`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate form data
    try {
      saleSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setValidationErrors(errors);
        toast.error("Please check your inputs");
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
        toast.error("Error updating sale");
        return;
      }
      toast.success("Sale updated");
    } else {
      const { error } = await supabase.from("sales").insert([saleData]);

      if (error) {
        toast.error("Error creating sale");
        return;
      }
      toast.success("Sale created");
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
      start_date: sale.start_date,
      end_date: sale.end_date,
      url: sale.url,
      featured: sale.featured,
      categories: sale.categories || [],
    });
    setEditingSale(sale);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sale?")) return;

    const { error } = await supabase.from("sales").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting sale");
      return;
    }

    toast.success("Sale deleted");
    fetchSales();
  };

  const handleExpire = async (id: string) => {
    if (!confirm("Mark this sale as expired?")) return;

    const { error } = await supabase
      .from("sales")
      .update({ is_manually_expired: true })
      .eq("id", id);

    if (error) {
      toast.error("Error expiring sale");
      return;
    }

    toast.success("Sale marked as expired");
    fetchSales();
  };

  const handleReactivate = async (id: string) => {
    if (!confirm("Reactivate this sale?")) return;

    const { error } = await supabase
      .from("sales")
      .update({ is_manually_expired: false })
      .eq("id", id);

    if (error) {
      toast.error("Error reactivating sale");
      return;
    }

    toast.success("Sale reactivated");
    fetchSales();
  };

  const getCategoryLabel = (value: string) => {
    const category = AVAILABLE_CATEGORIES.find(c => c.value === value);
    return category ? category.label : value;
  };

  const isExpired = (sale: Sale): boolean => {
    // Check if manually expired OR past end date
    if (sale.is_manually_expired) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(sale.end_date);
    return endDate < today;
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
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
            Back to Website
          </Button>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="single" className="font-light">Single Sale</TabsTrigger>
            <TabsTrigger value="bulk" className="font-light">Bulk Upload</TabsTrigger>
            <TabsTrigger value="retailers" className="font-light">Retailers</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center font-light">
                    {isEditing ? "Edit Sale" : "New Sale"}
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
                      <Label className="font-light">Retailer</Label>
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
                      {formData.logo && (
                        <div className="mt-2 p-2 border border-border rounded-md">
                          <img
                            src={formData.logo}
                            alt="Logo preview"
                            className="h-12 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="font-light">Image URL (optional)</Label>
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
                      <Label className="font-light">Title</Label>
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
                      <Label className="font-light">Discount (e.g. 30%)</Label>
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
                      <Label className="font-light">Start Date</Label>
                      <Input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                        className="font-light"
                      />
                      {validationErrors.start_date && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.start_date}</p>
                      )}
                    </div>

                    <div>
                      <Label className="font-light">End Date</Label>
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
                      <Label className="font-light mb-3 block">Categories (select at least one)</Label>
                      <div className="space-y-2 border border-border p-4 rounded-md">
                        {AVAILABLE_CATEGORIES.map((category) => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.value}
                              checked={formData.categories.includes(category.value)}
                              onCheckedChange={() => handleCategoryToggle(category.value)}
                            />
                            <label
                              htmlFor={category.value}
                              className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {category.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {validationErrors.categories && (
                        <p className="text-sm text-destructive mt-1">{validationErrors.categories}</p>
                      )}
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
                      {isEditing ? "Update" : "Create"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Sales List */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-light">All Sales ({sales.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {sales.map((sale) => {
                      const expired = isExpired(sale);
                      return (
                        <div 
                          key={sale.id} 
                          className={`border border-border p-4 space-y-2 ${expired ? 'opacity-60 bg-muted/20' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-light text-foreground">{sale.retailer}</h3>
                                {expired && (
                                  <span className="px-2 py-0.5 text-xs bg-destructive/20 text-destructive border border-destructive/30 rounded uppercase">
                                    Abgelaufen
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground font-light">{sale.title}</p>
                            </div>
                            <div className="flex gap-2">
                              {expired ? (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleReactivate(sale.id)}
                                  title="Reactivate sale"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleExpire(sale.id)}
                                  title="Expire sale"
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="outline" onClick={() => handleEdit(sale)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(sale.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground font-light">
                            {sale.discount} • {sale.categories.map(getCategoryLabel).join(', ')} • {sale.start_date} - {sale.end_date}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bulk">
            <BulkUpload onSuccess={fetchSales} />
          </TabsContent>

          <TabsContent value="retailers">
            <RetailerManagement onRetailerSelect={handleRetailerSelect} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;