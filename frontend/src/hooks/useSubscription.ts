import { useState, useCallback } from "react";
import { subscriptionService, CreateSubscriptionDto, SubscriptionResponse } from "@/services/end-user/subscriptionService";

interface UseSubscriptionReturn {
  loading: boolean;
  error: string | null;
  createSubscription: (data: CreateSubscriptionDto) => Promise<SubscriptionResponse | null>;
  clearError: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = useCallback(async (data: CreateSubscriptionDto): Promise<SubscriptionResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await subscriptionService.createSubscription(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi đăng ký nhận tin.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createSubscription,
    clearError,
  };
}
