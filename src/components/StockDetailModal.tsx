import React, { useState } from 'react';
import {
  X,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart2,
  LineChart,
  ArrowUpRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { StockItem } from '../types/market';

interface StockDetailModalProps {
  stock: StockItem | null;
  isOpen: boolean;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  userBalance: number;
  onTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  isOpen,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  userBalance,
  onTrade,
}) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Paper trading form state
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesInput, setSharesInput] = useState<string>('10');
  const [tradeMessage, setTradeMessage] = useState<string | null>(null);

  if (!isOpen || !stock) return null;

  const isPositive = stock.changePercent >= 0;

  // Chart data based on timeframe
  const historyData =
    (stock.chartHistory && stock.chartHistory[timeframe]) || [
      stock.price * 0.96,
      stock.price * 0.98,
      stock.price * 0.97,
      stock.price * 0.99,
      stock.price * 1.01,
      stock.price,
    ];

  const minVal = Math.min(...historyData);
  const maxVal = Math.max(...historyData);
  const range = maxVal - minVal || 1;

  // Chart dimensions
  const width = 600;
  const height = 220;
  const paddingX = 20;
  const paddingY = 25;

  const points = historyData.map((val, idx) => {
    const x = paddingX + (idx / (historyData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((val - minVal) / range) * (height - 2 * paddingY);
    return { x, y, val };
  });

  const linePathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M${p.x},${p.y}` : `${acc} L${p.x},${p.y}`;
  }, '');

  const areaPathD = `${linePathD} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`;

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const displayedPrice = hoveredPoint ? hoveredPoint.val : stock.price;

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseFloat(sharesInput);
    if (isNaN(count) || count <= 0) {
      setTradeMessage('Please enter a valid number of shares.');
      return;
    }
    const cost = count * stock.price;
    if (tradeAction === 'BUY' && cost > userBalance) {
      setTradeMessage(`Insufficient paper funds. Required: $${cost.toFixed(2)}`);
      return;
    }

    onTrade(stock.symbol, tradeAction, count, stock.price);
    setTradeMessage(
      `Successfully executed ${tradeAction} order for ${count} shares of ${stock.symbol} at $${stock.price.toFixed(2)}!`
    );
    setTimeout(() => setTradeMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-xs overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#e0e3eb] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#f0f3fa] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <span
              className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold text-sm shadow-xs"
              style={{ backgroundColor: stock.logoBg }}
            >
              {stock.logoLetter}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722]">{stock.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
                  {stock.exchange}
                </span>
                {stock.sector && (
                  <span className="hidden sm:inline-block text-xs text-[#787B86]">
                    {stock.sector}
                  </span>
                )}
              </div>
              <div className="text-xs sm:text-sm text-[#787B86]">{stock.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatchlist}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-50 text-amber-500 border-amber-200'
                  : 'text-[#787B86] border-[#e0e3eb] hover:bg-gray-50'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star
                className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-500' : ''}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#787B86] hover:text-[#131722] hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Real-time Price Header */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#131722] tabular-nums tracking-tight">
                ${displayedPrice.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-sm font-bold inline-flex items-center gap-1 ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>
                    {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                  </span>
                  <span>({isPositive ? `+$${stock.changeAmount.toFixed(2)}` : `-$${Math.abs(stock.changeAmount).toFixed(2)}`})</span>
                </span>
                <span className="text-xs text-[#787B86]">· Today</span>
              </div>
            </div>

            {/* Timeframe & Chart Style Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#f0f3fa] p-1 rounded-xl">
                {(['1D', '5D', '1M', '6M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      setHoverIndex(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                      timeframe === tf
                        ? 'bg-white text-[#131722] shadow-xs'
                        : 'text-[#787B86] hover:text-[#131722]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-[#f0f3fa] p-1 rounded-xl">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    chartType === 'line'
                      ? 'bg-white text-[#2962FF] shadow-xs'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                  title="Line Area Chart"
                >
                  <LineChart className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('candle')}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    chartType === 'candle'
                      ? 'bg-white text-[#2962FF] shadow-xs'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                  title="Candlestick Chart"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive SVG Chart */}
          <div className="w-full bg-[#fafbfd] border border-[#e0e3eb] rounded-2xl p-4 relative select-none">
            <svg
              className="w-full h-56 overflow-visible cursor-crosshair"
              viewBox={`0 0 ${width} ${height}`}
              onMouseLeave={() => setHoverIndex(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * width;
                let closestIdx = 0;
                let minDiff = Infinity;
                points.forEach((p, idx) => {
                  const diff = Math.abs(p.x - x);
                  if (diff < minDiff) {
                    minDiff = diff;
                    closestIdx = idx;
                  }
                });
                setHoverIndex(closestIdx);
              }}
            >
              <defs>
                <linearGradient id="chart-area-grad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1={0} y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#e0e3eb" strokeDasharray="3 3" opacity={0.7} />
              <line x1={0} y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#e0e3eb" strokeDasharray="3 3" opacity={0.7} />
              <line x1={0} y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#e0e3eb" strokeDasharray="3 3" opacity={0.7} />

              {chartType === 'line' ? (
                <>
                  <path d={areaPathD} fill="url(#chart-area-grad)" />
                  <path
                    d={linePathD}
                    fill="none"
                    stroke={isPositive ? '#089981' : '#F23645'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                /* Candlestick simulation */
                points.map((p, i) => {
                  const candleUp = i % 2 === 0;
                  const candleH = 14 + (i * 3) % 20;
                  const wickTop = p.y - 12;
                  const wickBottom = p.y + candleH + 10;
                  return (
                    <g key={i}>
                      <line
                        x1={p.x}
                        y1={wickTop}
                        x2={p.x}
                        y2={wickBottom}
                        stroke={candleUp ? '#089981' : '#F23645'}
                        strokeWidth="1.5"
                      />
                      <rect
                        x={p.x - 7}
                        y={p.y}
                        width={14}
                        height={candleH}
                        rx={1}
                        fill={candleUp ? '#089981' : '#F23645'}
                      />
                    </g>
                  );
                })
              )}

              {/* Crosshair indicator on hover */}
              {hoveredPoint && (
                <g>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={height}
                    stroke="#787B86"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="4.5"
                    fill={isPositive ? '#089981' : '#F23645'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>

            {hoveredPoint && (
              <div
                className="absolute top-2 left-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#e0e3eb] text-xs font-semibold text-[#131722] shadow-xs"
              >
                Pointer: ${hoveredPoint.val.toFixed(2)}
              </div>
            )}
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#131722] mb-3">Key Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">Market Cap</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  {stock.marketCap || '$2.1T'}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">P/E Ratio</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  {stock.peRatio || '34.5'}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">Day Range</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  ${(stock.dayLow || stock.price * 0.98).toFixed(2)} - $
                  {(stock.dayHigh || stock.price * 1.02).toFixed(2)}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">52 Week Range</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  ${(stock.week52Low || stock.price * 0.7).toFixed(2)} - $
                  {(stock.week52High || stock.price * 1.15).toFixed(2)}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">Volume</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  {stock.volume}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">Avg Volume</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  {stock.avgVolume || '45.2M'}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">Div Yield</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  {stock.dividendYield || '0.52%'}
                </span>
              </div>
              <div className="bg-[#fafbfd] border border-[#f0f3fa] p-3 rounded-xl">
                <span className="text-[11px] text-[#787B86] block">Prev Close</span>
                <span className="text-sm font-bold text-[#131722] tabular-nums">
                  ${(stock.prevClose || stock.price - stock.changeAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Paper Trading Panel */}
          <div className="bg-gradient-to-br from-[#f8f9fd] to-[#f0f3fa] border border-[#e0e3eb] rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#2962FF]" />
                <span className="text-sm font-bold text-[#131722]">
                  Simulated Trading Sandbox
                </span>
              </div>
              <span className="text-xs font-semibold text-[#787B86] tabular-nums">
                Paper Balance: ${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <form onSubmit={handleExecuteTrade} className="flex flex-wrap items-center gap-3">
              <div className="flex bg-white p-1 rounded-xl border border-[#e0e3eb]">
                <button
                  type="button"
                  onClick={() => setTradeAction('BUY')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    tradeAction === 'BUY'
                      ? 'bg-[#089981] text-white shadow-xs'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setTradeAction('SELL')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    tradeAction === 'SELL'
                      ? 'bg-[#F23645] text-white shadow-xs'
                      : 'text-[#787B86] hover:text-[#131722]'
                  }`}
                >
                  Sell
                </button>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#e0e3eb]">
                <span className="text-xs text-[#787B86]">Shares:</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={sharesInput}
                  onChange={(e) => setSharesInput(e.target.value)}
                  className="w-16 text-xs font-bold text-[#131722] focus:outline-none"
                />
              </div>

              <div className="text-xs font-bold text-[#131722] tabular-nums">
                Est: ${(parseFloat(sharesInput || '0') * stock.price).toFixed(2)}
              </div>

              <button
                type="submit"
                className={`ml-auto px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition cursor-pointer ${
                  tradeAction === 'BUY' ? 'bg-[#089981]' : 'bg-[#F23645]'
                }`}
              >
                Place {tradeAction} Order
              </button>
            </form>

            {tradeMessage && (
              <div className="mt-3 p-2.5 bg-white border border-[#e0e3eb] rounded-xl text-xs font-medium text-[#131722] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#089981]" />
                <span>{tradeMessage}</span>
              </div>
            )}
          </div>

          {/* Company Description */}
          {stock.description && (
            <div>
              <h3 className="text-sm font-bold text-[#131722] mb-1.5">About {stock.name}</h3>
              <p className="text-xs text-[#787B86] leading-relaxed">{stock.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
