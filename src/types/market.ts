export type SubmarketCategory =
  | 'us-stocks'
  | 'world-stocks'
  | 'crypto'
  | 'futures'
  | 'forex'
  | 'govt-bonds'
  | 'corp-bonds'
  | 'etfs'
  | 'economy';

export type MoverFilter = 'most-active' | 'top-gainers' | 'top-losers' | 'high-volume';

export interface IndexCardData {
  id: string;
  name: string;
  symbol: string;
  badgeText: string;
  badgeBg: string;
  price: string;
  numericPrice: number;
  changePercent: string;
  numericChangePercent: number;
  isPositive: boolean;
  sparklineD: string;
  gradientId: string;
  gradientColor: string;
}

export interface StockCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface StockItem {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  price: number;
  changePercent: number;
  changeAmount: number;
  volume: string;
  numericVolume: number;
  logoLetter: string;
  logoBg: string;
  sparklineD?: string;
  trendPoints: number[];
  category: SubmarketCategory;
  // Deep dive metrics
  marketCap?: string;
  peRatio?: string;
  dayHigh?: number;
  dayLow?: number;
  openPrice?: number;
  prevClose?: number;
  week52High?: number;
  week52Low?: number;
  avgVolume?: string;
  dividendYield?: string;
  description?: string;
  sector?: string;
  chartHistory?: {
    '1D': number[];
    '5D': number[];
    '1M': number[];
    '6M': number[];
    '1Y': number[];
  };
  candles?: StockCandle[];
}

export interface MarketRegion {
  id: string;
  name: string;
  subTitle: string;
}
