import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Download, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SaleCategory = "women" | "men" | "accessories" | "unisex";

interface SaleData {
  retailer: string;
  logo: string;
  image?: string;
  title: string;
  discount: string;
  code?: string;
  endDate: string;
  url: string;
  featured?: boolean;
  categories: SaleCategory[];
}

interface BulkUploadProps {
  onSuccess: () => void;
}

const BulkUpload = ({ onSuccess }: BulkUploadProps) => {
  const [jsonInput, setJsonInput] = useState("");
  const [previewData, setPreviewData] = useState<SaleData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const exampleData = [
    {
      retailer: "H&M",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",
      image: "",
      title: "Singles Day Sale",
      discount: "30%",
      code: "SINGLE30",
      endDate: "2025-11-11",
      url: "https://www2.hm.com/de_de/sale.html",
      featured: true,
      categories: ["women", "accessories"]
    },
    {
      retailer: "Zalando",
      logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Zalando_logo.svg",
      image: "",
      title: "Fashion Week Special",
      discount: "25%",
      code: "FASHION25",
      endDate: "2025-11-15",
      url: "https://www.zalando.de",
      featured: false,
      categories: ["unisex"]
    }
  ];

  const validateSale = (sale: any, index: number): string[] => {
    const errors: string[] = [];
    const prefix = `Sale #${index + 1}:`;

    if (!sale.retailer || typeof sale.retailer !== 'string') {
      errors.push(`${prefix} Retailer is required`);
    }
    if (!sale.logo || typeof sale.logo !== 'string' || !sale.logo.startsWith('http')) {
      errors.push(`${prefix} Valid logo URL is required`);
    }
    if (sale.image && (!sale.image.startsWith('http') || sale.image.trim() === '')) {
      errors.push(`${prefix} Image must be a valid URL or empty`);
    }
    if (!sale.title || typeof sale.title !== 'string') {
      errors.push(`${prefix} Title is required`);
    }
    if (!sale.discount || typeof sale.discount !== 'string') {
      errors.push(`${prefix} Discount is required`);
    }
    if (!sale.endDate) {
      errors.push(`${prefix} End date is required`);
    } else {
      const date = new Date(sale.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        errors.push(`${prefix} End date must be today or in the future`);
      }
    }
    if (!sale.url || typeof sale.url !== 'string' || !sale.url.startsWith('http')) {
      errors.push(`${prefix} Valid URL is required`);
    }
    if (!sale.categories || !Array.isArray(sale.categories)) {
      errors.push(`${prefix} Categories must be an array`);
    } else if (sale.categories.length === 0) {
      errors.push(`${prefix} At least one category is required`);
    } else {
      const validCategories = ['women', 'men', 'accessories', 'unisex'];
      const invalidCats = sale.categories.filter((cat: any) => !validCategories.includes(cat));
      if (invalidCats.length > 0) {
        errors.push(`${prefix} Invalid categories: ${invalidCats.join(', ')}. Must be one of: women, men, accessories, unisex`);
      }
    }

    return errors;
  };

  const handlePreview = () => {
    setErrors([]);
    setPreviewData([]);

    try {
      const parsed = JSON.parse(jsonInput);
      const salesArray = Array.isArray(parsed) ? parsed : [parsed];
      
      const allErrors: string[] = [];
      salesArray.forEach((sale, index) => {
        const saleErrors = validateSale(sale, index);
        allErrors.push(...saleErrors);
      });

      if (allErrors.length > 0) {
        setErrors(allErrors);
        return;
      }

      setPreviewData(salesArray);
      toast.success(`${salesArray.length} sales validated successfully`);
    } catch (error) {
      setErrors(['Invalid JSON format. Please check your input.']);
      toast.error('Invalid JSON format');
    }
  };

  const handleUpload = async () => {
    if (previewData.length === 0) {
      toast.error('Please preview data first');
      return;
    }

    setIsUploading(true);

    try {
      // Transform data to match database schema
      const salesData = previewData.map(sale => ({
        retailer: sale.retailer.trim(),
        logo: sale.logo.trim(),
        image: sale.image?.trim() || null,
        title: sale.title.trim(),
        discount: sale.discount.trim(),
        code: sale.code?.trim() || null,
        end_date: sale.endDate,
        url: sale.url.trim(),
        featured: sale.featured || false,
        categories: sale.categories
      }));

      const { error } = await supabase.from("sales").insert(salesData);

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Error uploading: ${error.message}`);
        return;
      }

      toast.success(`Successfully uploaded ${salesData.length} sales!`);
      setJsonInput("");
      setPreviewData([]);
      onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading sales');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const downloadExample = () => {
    const dataStr = JSON.stringify(exampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sales-example.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-light flex items-center justify-between">
          <span>Bulk Upload Sales</span>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadExample}
            className="font-light"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Example
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-light">Upload JSON File</Label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-light file:bg-foreground file:text-background hover:file:bg-primary mt-2"
          />
        </div>

        <div>
          <Label className="font-light">Or Paste JSON Data</Label>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste your JSON data here...'
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {previewData.length > 0 && (
          <Alert>
            <AlertDescription>
              <strong>Preview:</strong> {previewData.length} sales ready to upload
              <ul className="mt-2 space-y-1 text-sm">
                {previewData.slice(0, 3).map((sale, index) => (
                  <li key={index}>
                    • {sale.retailer} - {sale.title} ({sale.discount})
                  </li>
                ))}
                {previewData.length > 3 && (
                  <li>... and {previewData.length - 3} more</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="flex-1 font-light"
            disabled={!jsonInput.trim()}
          >
            Preview
          </Button>
          <Button
            onClick={handleUpload}
            className="flex-1 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-light"
            disabled={previewData.length === 0 || isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : `Upload ${previewData.length} Sales`}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 font-light">
          <p><strong>Supported fields:</strong></p>
          <ul className="list-disc list-inside ml-2">
            <li><strong>retailer</strong> (required): Store name</li>
            <li><strong>logo</strong> (required): Logo URL</li>
            <li><strong>image</strong> (optional): Product image URL</li>
            <li><strong>title</strong> (required): Sale title</li>
            <li><strong>discount</strong> (required): e.g., "30%" or "Bis zu 50%"</li>
            <li><strong>code</strong> (optional): Promo code</li>
            <li><strong>endDate</strong> (required): Format: YYYY-MM-DD</li>
            <li><strong>url</strong> (required): Sale page URL</li>
            <li><strong>featured</strong> (optional): true/false (default: false)</li>
            <li><strong>categories</strong> (required): Array of: "women", "men", "accessories", "unisex" (e.g., ["women", "accessories"])</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkUpload;