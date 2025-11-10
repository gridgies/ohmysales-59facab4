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
}: SalesFilterProps) => {
  return (
    <div className="bg-card border border-border p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-sm font-light text-muted-foreground mb-2 block">
            Kategorie
          </Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="font-light">
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
        </div>

        <div>
          <Label className="text-sm font-light text-muted-foreground mb-2 block">
            Rabatt
          </Label>
          <Select value={selectedDiscount} onValueChange={onDiscountChange}>
            <SelectTrigger className="font-light">
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
        </div>

        <div>
          <Label className="text-sm font-light text-muted-foreground mb-2 block">
            Händler
          </Label>
          <Select value={selectedRetailer} onValueChange={onRetailerChange}>
            <SelectTrigger className="font-light">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              {retailers.map((retailer) => (
                <SelectItem key={retailer} value={retailer}>
                  {retailer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-light text-muted-foreground mb-2 block">
            Sortieren
          </Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="font-light">
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
    </div>
  );
};

export default SalesFilter;
