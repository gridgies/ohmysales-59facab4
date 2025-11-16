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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-lg font-light tracking-tight text-foreground hover:text-primary transition-colors">
            ohmysales
          </Link>
          
          {onSearch && <SearchBar onSearch={onSearch} />}
          
          <div className="flex items-center gap-3">            
            {user && isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="font-light h-8">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
            
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="font-light h-8"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="font-light h-8 text-xs">
                  Login
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
