import SaleCard from "./SaleCard";

const salesData = [
  {
    id: 1,
    retailer: "NET-A-PORTER",
    logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop",
    title: "Singles' Day Special Sale",
    discount: "30%",
    code: "SINGLES30",
    endDate: "11. November 2025",
    url: "#",
    featured: true,
  },
  {
    id: 2,
    retailer: "MYTHERESA",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop",
    title: "Designer Fashion Sale",
    discount: "40%",
    endDate: "15. November 2025",
    url: "#",
    featured: true,
  },
  {
    id: 3,
    retailer: "ZALANDO",
    logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop",
    title: "Herbst Sale Aktion",
    discount: "25%",
    code: "HERBST25",
    endDate: "20. November 2025",
    url: "#",
  },
  {
    id: 4,
    retailer: "ABOUT YOU",
    logo: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
    title: "Weekend Special",
    discount: "20%",
    endDate: "13. November 2025",
    url: "#",
  },
  {
    id: 5,
    retailer: "BREUNINGER",
    logo: "https://images.unsplash.com/photo-1441986380878-c4248f5b8b5b?w=100&h=100&fit=crop",
    title: "Luxury Designer Sale",
    discount: "35%",
    code: "LUXURY35",
    endDate: "18. November 2025",
    url: "#",
  },
  {
    id: 6,
    retailer: "FARFETCH",
    logo: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&h=600&fit=crop",
    title: "International Designers",
    discount: "45%",
    endDate: "25. November 2025",
    url: "#",
  },
];

const SalesGrid = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesData.map((sale) => (
          <SaleCard key={sale.id} {...sale} />
        ))}
      </div>
    </section>
  );
};

export default SalesGrid;
