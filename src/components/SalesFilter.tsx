import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SalesFilterProps {
  selectedCategory: string;
  selectedDiscount: string;
  selectedRetailer: string;
  sortBy: string;
  onCategoryChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
  onRetailerChange: (value: string) => void;
  onSortChange: (value: string) => void;
  retailers: string[];
  showExpired: boolean;
  onShowExpiredChange: (value: boolean) => void;
  filteredCount: number;
}

// Define categories here for easy management
// To add new categories, simply add them to this array
const CATEGORIES = [
  { value: 'women', label: 'Damen' },
  { value: 'men', label: 'Herren' },
  { value: 'accessories', label: 'Accessoires' },
  { value: 'beauty', label: 'Beauty' },
  // Add more categories here as needed:
  // { value: 'kids', label: 'Kinder' },
  // { value: 'home', label: 'Home' },
];

const SalesFilter = ({
  selectedCategory,
  selectedDiscount,
  selectedRetailer,
  sortBy,
  onCategoryChange,
  onDiscountChange,
  onRetailerChange,
  onSortChange,
  retailers,
  showExpired,
  onShowExpiredChange,
  filteredCount,
}: SalesFilterProps) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Stats Bar */}
      {filteredCount > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredCount}</span> aktive Fashion Deals{" "}
          {selectedCategory !== "all" && `in ${CATEGORIES.find(c => c.value === selectedCategory)?.label || selectedCategory}`}
          {selectedRetailer !== "all" && ` bei ${selectedRetailer}`}
        </p>
      )}

      {/* Filters & Toggle */}
      <div className="flex flex-wrap items-center gap-2">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-8 w-[120px] text-xs font-light border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedDiscount} onValueChange={onDiscountChange}>
        <SelectTrigger className="h-8 w-[100px] text-xs font-light border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle</SelectItem>
          <SelectItem value="20-30">20-30%</SelectItem>
          <SelectItem value="30-40">30-40%</SelectItem>
          <SelectItem value="40-50">40-50%</SelectItem>
          <SelectItem value="50+">50%+</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedRetailer} onValueChange={onRetailerChange}>
        <SelectTrigger className="h-8 w-[130px] text-xs font-light border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Händler</SelectItem>
          {retailers.map((retailer) => (
            <SelectItem key={retailer} value={retailer}>
              {retailer}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Aktuelle/Abgelaufen Toggle */}
      <div className="inline-flex border border-border/50 rounded overflow-hidden">
        <button
          onClick={() => onShowExpiredChange(false)}
          className={`px-4 py-1.5 text-xs font-light uppercase tracking-wider transition-colors ${
            !showExpired
              ? 'bg-foreground text-background'
              : 'bg-background text-foreground hover:bg-muted'
          }`}
        >
          Aktuelle
        </button>
        <button
          onClick={() => onShowExpiredChange(true)}
          className={`px-4 py-1.5 text-xs font-light uppercase tracking-wider transition-colors ${
            showExpired
              ? 'bg-foreground text-background'
              : 'bg-background text-foreground hover:bg-muted'
          }`}
        >
          Abgelaufen
        </button>
      </div>

      <div className="flex-1"></div>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="h-8 w-[140px] text-xs font-light border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Neueste</SelectItem>
          <SelectItem value="discount-high">Höchster Rabatt</SelectItem>
          <SelectItem value="discount-low">Niedrigster Rabatt</SelectItem>
          <SelectItem value="ending-soon">Bald endend</SelectItem>
        </SelectContent>
      </Select>
      </div>
    </div>
  );
};

export default SalesFilter;
