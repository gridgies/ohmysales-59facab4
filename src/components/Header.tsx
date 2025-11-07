import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Settings } from "lucide-react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  salesCount?: number;
  retailersCount?: number;
}

const Header = ({ onSearch, salesCount = 24, retailersCount = 18 }: HeaderProps) => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-light tracking-tight text-foreground hover:text-primary transition-colors">
            ohmysales
          </Link>
          
          {onSearch && <SearchBar onSearch={onSearch} />}
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-light">
              <span>{salesCount} Aktive Sales</span>
              <span>{retailersCount} Händler</span>
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
