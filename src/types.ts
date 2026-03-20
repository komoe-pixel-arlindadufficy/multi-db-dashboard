export interface DBHealth {
  connected: boolean;
  error: string | null;
}

export interface HealthStatus {
  mssql: DBHealth;
  mysql: DBHealth;
  pg: DBHealth;
}

export interface ReportItem {
  id: number;
  source: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}
