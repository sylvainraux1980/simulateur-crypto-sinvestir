export interface Crypto {
  id: string;
  symbol: string;
  name: string;
}

export type Frequency = 'one-shot' | 'monthly' | 'weekly' | 'daily';

export interface ChartPoint {
  date: string;
  portfolioValue: number;
  totalInvested: number;
}

export interface SimulationResult {
  totalInvested: number;
  finalValue: number;
  gainLoss: number;
  gainLossPercent: number;
  chartData: ChartPoint[];
  totalPurchases: number;
  avgPrice: number;
  totalQuantity: number;
}
