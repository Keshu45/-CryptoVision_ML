export interface HistoricalDataPoint {
  time: number;
  price: number;
  rsi: number | null;
  sma: number | null;
  lowerBB: number | null;
  upperBB: number | null;
}

export interface PredictionDataPoint {
  time: number;
  predictedPrice: number;
}

export interface MarketData {
  historicalData: HistoricalDataPoint[];
  predictedData: PredictionDataPoint[];
  currentPrice: number;
  change24h: number;
  volume24h: number;
  exchangeRateINR: number;
  aiSignal: string;
  aiConfidence: number;
  indicators: {
    currentRSI: number;
    currentSMA: number;
  };
}
