export interface SearchResult {
  id: string;
  source: string;
  type?: string;
  title: string;
  description?: string;
  url: string;
  authors?: string[];
  year?: string;
  license?: string;
  tags?: string[];
  meta?: {
    pipeline?: string;
    cert_id?: string;
    duration?: string;
    channel?: string;
  };
  score?: number;
}