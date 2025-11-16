import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SaleRating {
  hot_votes: number;
  cold_votes: number;
  total_votes: number;
  hot_percentage: number;
  is_hot: boolean;
}

const VOTE_STORAGE_KEY = 'ohmysales_votes';

export const useRating = (saleId: string) => {
  const [rating, setRating] = useState<SaleRating>({
    hot_votes: 0,
    cold_votes: 0,
    total_votes: 0,
    hot_percentage: 0,
    is_hot: false,
  });
  const [hasVoted, setHasVoted] = useState<'hot' | 'cold' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has already voted
  useEffect(() => {
    const votes = getStoredVotes();
    setHasVoted(votes[saleId] || null);
  }, [saleId]);

  // Fetch current rating
  useEffect(() => {
    fetchRating();
  }, [saleId]);

  const fetchRating = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_ratings')
        .select('hot_votes, cold_votes')
        .eq('sale_id', saleId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        updateRatingState(data.hot_votes, data.cold_votes);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const updateRatingState = (hot: number, cold: number) => {
    const total = hot + cold;
    const percentage = total > 0 ? (hot / total) * 100 : 0;
    const isHot = hot >= 5 && percentage >= 70;

    setRating({
      hot_votes: hot,
      cold_votes: cold,
      total_votes: total,
      hot_percentage: percentage,
      is_hot: isHot,
    });
  };

  const voteHot = async () => {
    if (hasVoted === 'hot') {
      toast.error('Du hast bereits hot gevotet!');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('vote_hot', {
        sale_uuid: saleId,
      });

      if (error) throw error;

      if (data) {
        updateRatingState(data.hot_votes, data.cold_votes);
        storeVote(saleId, 'hot');
        setHasVoted('hot');
        
        if (hasVoted === 'cold') {
          toast.success('🌿 Vote zu Hot geändert!');
        } else {
          toast.success('🌿 Hot vote abgegeben!');
        }
      }
    } catch (error) {
      console.error('Error voting hot:', error);
      toast.error('Fehler beim Abstimmen');
    } finally {
      setIsLoading(false);
    }
  };

  const voteCold = async () => {
    if (hasVoted === 'cold') {
      toast.error('Du hast bereits cold gevotet!');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('vote_cold', {
        sale_uuid: saleId,
      });

      if (error) throw error;

      if (data) {
        updateRatingState(data.hot_votes, data.cold_votes);
        storeVote(saleId, 'cold');
        setHasVoted('cold');
        
        if (hasVoted === 'hot') {
          toast.success('❄️ Vote zu Cold geändert!');
        } else {
          toast.success('❄️ Cold vote abgegeben!');
        }
      }
    } catch (error) {
      console.error('Error voting cold:', error);
      toast.error('Fehler beim Abstimmen');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rating,
    hasVoted,
    isLoading,
    voteHot,
    voteCold,
  };
};

// Helper functions for localStorage
const getStoredVotes = (): Record<string, 'hot' | 'cold'> => {
  try {
    const stored = localStorage.getItem(VOTE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storeVote = (saleId: string, voteType: 'hot' | 'cold') => {
  try {
    const votes = getStoredVotes();
    votes[saleId] = voteType;
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Error storing vote:', error);
  }
};
