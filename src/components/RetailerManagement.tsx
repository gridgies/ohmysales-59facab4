import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Edit, X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Retailer {
  id: string;
  name: string;
  logo: string;
  website: string | null;
  created_at: string;
}

interface RetailerManagementProps {
  onRetailerSelect?: (retailer: Retailer) => void;
  onRetailerAdded?: () => void;
}

const RetailerManagement = ({ onRetailerSelect, onRetailerAdded }: RetailerManagementProps) => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
  });

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    const { data, error } = await supabase
      .from("retailers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Error loading retailers");
      return;
    }

    setRetailers(data || []);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      website: "",
    });
    setIsEditing(false);
    setEditingRetailer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const retailerData = {
      name: formData.name.trim(),
      logo: formData.logo.trim(),
      website: formData.website.trim() || null,
    };

    if (editingRetailer) {
      const { error } = await supabase
        .from("retailers")
        .update(retailerData)
        .eq("id", editingRetailer.id);

      if (error) {
        toast.error("Error updating retailer");
        return;
      }
      toast.success("Retailer updated");
    } else {
      const { error } = await supabase.from("retailers").insert([retailerData]);

      if (error) {
        toast.error("Error creating retailer");
        return;
      }
      toast.success("Retailer created");
    }

    resetForm();
    setIsDialogOpen(false);
    fetchRetailers();
    if (onRetailerAdded) {
      onRetailerAdded();
    }
  };

  const handleEdit = (retailer: Retailer) => {
    setFormData({
      name: retailer.name,
      logo: retailer.logo,
      website: retailer.website || "",
    });
    setEditingRetailer(retailer);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this retailer? This won't affect existing sales.")) return;

    const { error } = await supabase.from("retailers").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting retailer");
      return;
    }

    toast.success("Retailer deleted");
    fetchRetailers();
  };

  const handleSelectRetailer = (retailer: Retailer) => {
    if (onRetailerSelect) {
      onRetailerSelect(retailer);
      toast.success(`Selected ${retailer.name}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-light flex items-center justify-between">
          <span>Retailer Management ({retailers.length})</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="font-light"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Retailer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-light">
                  {isEditing ? "Edit Retailer" : "New Retailer"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="font-light">Retailer Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., H&M"
                    className="font-light"
                  />
                </div>

                <div>
                  <Label className="font-light">Logo URL</Label>
                  <Input
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    required
                    placeholder="https://..."
                    className="font-light"
                  />
                  {formData.logo && (
                    <div className="mt-2 p-2 border border-border rounded-md bg-muted">
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
                  <Label className="font-light">Website (optional)</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                    className="font-light"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                    className="flex-1 font-light"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-light"
                  >
                    {isEditing ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {retailers.map((retailer) => (
            <div
              key={retailer.id}
              className="border border-border p-3 rounded-md flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <img
                  src={retailer.logo}
                  alt={retailer.name}
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1">
                  <p className="font-light text-foreground">{retailer.name}</p>
                  {retailer.website && (
                    <a
                      href={retailer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      {retailer.website}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {onRetailerSelect && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSelectRetailer(retailer)}
                    className="font-light text-xs"
                  >
                    Use
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handleEdit(retailer)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(retailer.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {retailers.length === 0 && (
            <p className="text-center text-muted-foreground font-light py-8">
              No retailers yet. Add your first retailer above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RetailerManagement;