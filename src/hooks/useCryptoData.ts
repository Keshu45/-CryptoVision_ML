import { useState, useEffect } from 'react';
import axios from 'axios';
import { MarketData } from '../types';

export function useCryptoData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/market-data');
        if (response.data.success && mounted) {
          setData(response.data.data);
          setError(null);
        } else {
          throw new Error('Failed to fetch data payload');
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to fetch crypto data");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    // Setup polling every 60 seconds
    const interval = setInterval(fetchData, 60000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error };
}
