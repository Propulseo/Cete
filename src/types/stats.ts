export interface Stat {
  id: string;
  label: string;
  value: number | string;
  trend: string;
  icon: string;
}

export interface AdminStats {
  timestamp: string;
  stats: Stat[];
}
