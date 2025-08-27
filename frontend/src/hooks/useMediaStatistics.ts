import { useState, useEffect } from 'react';
import { MediaStatisticsService, MediaStatisticsItem } from '../services/end-user/mediaStatisticsService';

interface UseMediaStatisticsResult {
  statistics: MediaStatisticsItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMediaStatistics = (): UseMediaStatisticsResult => {
  const [statistics, setStatistics] = useState<MediaStatisticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MediaStatisticsService.getContentStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      console.error('Error fetching media statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchStatistics();
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refetch,
  };
};
