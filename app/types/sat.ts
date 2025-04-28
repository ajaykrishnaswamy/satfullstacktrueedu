export interface SATTest {
  id: string;
  name: string;
  description?: string;
  status: 'published' | 'unpublished';
  total_time?: number;
  created_at: string;
} 