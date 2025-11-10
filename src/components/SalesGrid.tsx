import { useEffect, useState } from "react";
import SaleCard from "./SaleCard";
import SalesFilter from "./SalesFilter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  categories: string[]; // Changed from category: string to categories: string[]
  created_at?: string;
}

interface SalesGridProps {
  searchQuery?: string;
}

const SalesGrid = ({ searchQuery }: SalesGridProps) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [selectedRetailer, setSelectedRetailer] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [retailers, setRetailers] = useState<string[]>([]);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [sales, selectedCategory, selectedDiscount, selectedRetailer, sortBy, searchQuery]);

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
    
    // Extract unique retailers
    const uniqueRetailers = Array.from(
      new Set(data?.map((sale) => sale.retailer) || [])
    ).sort();
    setRetailers(uniqueRetailers);
  };

  const extractDiscountNumber = (discount: string): number => {
    const match = discount.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const applyFiltersAndSort = () => {
    let filtered = [...sales];

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sale) =>
          sale.retailer.toLowerCase().includes(query) ||
          sale.title.toLowerCase().includes(query) ||
          // Search in all categories
          sale.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Apply category filter - now checks if category exists in array
    if (selectedCategory !== "all") {
      filtered = filtered.filter((sale) => 
        sale.categories && sale.categories.includes(selectedCategory)
      );
    }

    // Apply discount filter
    if (selectedDiscount !== "all") {
      filtered = filtered.filter((sale) => {
        const discountNum = extractDiscountNumber(sale.discount);
        if (selectedDiscount === "20-30") return discountNum >= 20 && discountNum < 30;
        if (selectedDiscount === "30-40") return discountNum >= 30 && discountNum < 40;
        if (selectedDiscount === "40-50") return discountNum >= 40 && discountNum < 50;
        if (selectedDiscount === "50+") return discountNum >= 50;
        return true;
      });
    }

    // Apply retailer filter
    if (selectedRetailer !== "all") {
      filtered = filtered.filter((sale) => sale.retailer === selectedRetailer);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "discount-high":
          return extractDiscountNumber(b.discount) - extractDiscountNumber(a.discount);
        case "discount-low":
          return extractDiscountNumber(a.discount) - extractDiscountNumber(b.discount);
        case "ending-soon":
          return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
        case "newest":
        default:
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

    setFilteredSales(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <SalesFilter
        selectedCategory={selectedCategory}
        selectedDiscount={selectedDiscount}
        selectedRetailer={selectedRetailer}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategory}
        onDiscountChange={setSelectedDiscount}
        onRetailerChange={setSelectedRetailer}
        onSortChange={setSortBy}
        retailers={retailers}
      />

      {filteredSales.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground font-light">
            Keine Sales gefunden
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSales.map((sale) => (
            <SaleCard
              key={sale.id}
              retailer={sale.retailer}
              logo={sale.logo}
              image={sale.image || undefined}
              title={sale.title}
              discount={sale.discount}
              code={sale.code || undefined}
              endDate={formatDate(sale.end_date)}
              url={sale.url}
              featured={sale.featured}
              categories={sale.categories} // Pass categories to card
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SalesGrid;
