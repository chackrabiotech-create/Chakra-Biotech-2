import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);

        if (options.errorMessage) {
          toast.error(options.errorMessage);
        } else {
          toast.error(error.message);
        }

        if (options.onError) {
          options.onError(error);
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { data, loading, error, execute };
}
