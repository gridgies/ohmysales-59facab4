import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Retailer {
  id: string;
  name: string;
  logo_url: string;
}

const ScrollingBanner = () => {
  const [retailers, setRetailers] = useState<Retailer[]>([]);

  useEffect(() => {
    const fetchRetailers = async () => {
      const { data, error } = await supabase
        .from("retailers")
        .select("id, name, logo_url")
        .order("name");
      
      if (data && !error) {
        setRetailers(data);
      }
    };

    fetchRetailers();
  }, []);

  // Create the scrolling sequence: logos + text mixed in
  const createScrollItems = () => {
    const items = [];
    retailers.forEach((retailer, index) => {
      items.push({ type: "logo", data: retailer });
      // Add text after every 3 retailers
      if ((index + 1) % 3 === 0) {
        items.push({ type: "text", data: null });
      }
    });
    return items;
  };

  const scrollItems = createScrollItems();

  return (
    <div className="w-full bg-gradient-to-r from-[#ea384c] via-[#e91e63] to-[#ea384c] py-6 overflow-hidden relative">
      <div className="flex">
        {/* First set */}
        <div className="flex items-center gap-16 animate-scroll-banner whitespace-nowrap">
          {scrollItems.map((item, index) => (
            <div key={`first-${index}`} className="flex-shrink-0">
              {item.type === "logo" && item.data ? (
                <img
                  src={item.data.logo_url}
                  alt={item.data.name}
                  className="h-10 w-auto object-contain filter brightness-0 invert opacity-90"
                />
              ) : (
                <div className="text-white font-bold text-xl md:text-2xl px-8">
                  ohmysales · Die besten Fashion Sales · Täglich aktualisiert
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-16 animate-scroll-banner whitespace-nowrap">
          {scrollItems.map((item, index) => (
            <div key={`second-${index}`} className="flex-shrink-0">
              {item.type === "logo" && item.data ? (
                <img
                  src={item.data.logo_url}
                  alt={item.data.name}
                  className="h-10 w-auto object-contain filter brightness-0 invert opacity-90"
                />
              ) : (
                <div className="text-white font-bold text-xl md:text-2xl px-8">
                  ohmysales · Die besten Fashion Sales · Täglich aktualisiert
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingBanner;
