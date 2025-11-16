import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Settings } from "lucide-react";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const [activeSalesCount, setActiveSalesCount] = useState<number>(0);

  useEffect(() => {
    fetchActiveSalesCount();
  }, []);

  const fetchActiveSalesCount = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { count, error } = await supabase
      .from("sales")
      .select("*", { count: 'exact', head: true })
      .gte('end_date', today)
      .eq('is_manually_expired', false);

    if (!error && count !== null) {
      setActiveSalesCount(count);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-light tracking-tight text-foreground hover:text-primary transition-colors">
            ohmysales
          </Link>
          
          {onSearch && <SearchBar onSearch={onSearch} />}
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center text-sm text-muted-foreground font-light">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {activeSalesCount} Aktive Sales
              </span>
            </div>
            
            {user && isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="font-light">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="font-light"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Abmelden
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="font-light">
                  Anmelden
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
