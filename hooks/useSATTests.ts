import { useState, useEffect } from 'react';
import { SATTest } from '@/types/sat';

export function useSATTests() {
  const [tests, setTests] = useState<SATTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sat-tests');
      if (!response.ok) {
        throw new Error('Failed to fetch SAT tests');
      }
      const data = await response.json();
      setTests(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SAT tests');
    } finally {
      setLoading(false);
    }
  };

  const createTest = async (test: Omit<SATTest, 'id' | 'created_at' | 'share_id'>) => {
    try {
      const response = await fetch('/api/sat-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test),
      });

      if (!response.ok) {
        throw new Error('Failed to create SAT test');
      }

      const newTest = await response.json();
      setTests(prev => [...prev, newTest]);
      return newTest;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create SAT test');
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return {
    tests,
    loading,
    error,
    fetchTests,
    createTest,
  };
} 