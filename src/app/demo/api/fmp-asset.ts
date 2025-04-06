export interface FmpAsset {
    symbol: string;           // Market symbol (e.g., BTCUSD, ^GSPC)
    name: string;             // Asset name (e.g., Bitcoin, S&P 500)
    price: number;            // Current price in USD
    change: number;           // Absolute price change
    changesPercentage: number; // Percentage change over the last 24 hours
}
