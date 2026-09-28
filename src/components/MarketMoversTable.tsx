import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Star } from 'lucide-react';
import { StockItem, MoverFilter, SubmarketCategory } from '../types/market';

interface MarketMoversTableProps {
  category: SubmarketCategory;
  stocks: StockItem[];
  activeFilter: MoverFilter;
  onSelectFilter: (filter: MoverFilter) => void;
  onSelectStock: (stock: StockItem) => void;
  watchlistSymbols: Set<string>;
  onToggleWatchlist: (stock: StockItem, e: React.MouseEvent) => void;
  flashSymbols?: Record<string, 'up' | 'down'>;
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  category,
  stocks,
  activeFilter,
  onSelectFilter,
  onSelectStock,
  watchlistSymbols,
  onToggleWatchlist,
  flashSymbols = {},
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Subtitle mapping based on category
  const categorySubtitles: Record<SubmarketCategory, string> = {
    'us-stocks': 'United States market trends and most active equities',
    'world-stocks': 'Global international equities and foreign benchmark leaders',
    'crypto': 'Top digital assets, cryptocurrencies and decentralized tokens',
    'futures': 'Commodities, energy, and global index futures contracts',
    'forex': 'Major foreign exchange currency pairs and global currency rates',
    'govt-bonds': 'Sovereign government treasury yields and debt securities',
    'corp-bonds': 'Investment grade and high yield corporate bond indexes',
    'etfs': 'Top traded exchange-traded funds and index benchmark trackers',
    'economy': 'Macroeconomic indicators, inflation benchmarks, and employment metrics',
  };

  // Sort according to activeFilter
  let sortedStocks = [...stocks];
  if (activeFilter === 'top-gainers') {
    sortedStocks.sort((a, b) => b.changePercent - a.changePercent);
  } else if (activeFilter === 'top-losers') {
    sortedStocks.sort((a, b) => a.changePercent - b.changePercent);
  } else if (activeFilter === 'high-volume') {
    sortedStocks.sort((a, b) => b.numericVolume - a.numericVolume);
  }

  // Display initial 5 rows (matching the exact screenshot) or all if expanded
  const displayStocks = isExpanded ? sortedStocks : sortedStocks.slice(0, 5);

  const filters: { id: MoverFilter; label: string }[] = [
    { id: 'most-active', label: 'Most active' },
    { id: 'top-gainers', label: 'Top gainers' },
    { id: 'top-losers', label: 'Top losers' },
    { id: 'high-volume', label: 'High volume' },
  ];

  return (
    <section className="border border-[#e0e3eb] rounded-2xl overflow-hidden shadow-xs bg-white">
      {/* Section Tab Filters Header */}
      <div className="p-5 border-b border-[#e0e3eb] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#131722]">Market Movers</h2>
          <p className="text-xs text-[#787B86] mt-0.5">
            {categorySubtitles[category] || 'United States market trends and most active equities'}
          </p>
        </div>

        {/* Filter Sub-tabs */}
        <div className="flex items-center space-x-1.5 bg-[#f0f3fa] p-1 rounded-xl self-start md:self-auto">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                  isActive
                    ? 'font-bold bg-white text-[#131722] shadow-xs'
                    : 'font-semibold text-[#787B86] hover:text-[#131722]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticker Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fafbfd] border-b border-[#e0e3eb] text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-5">
                Symbol
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Price (USD)
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Change %
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Change ($)
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Volume
              </th>
              <th scope="col" className="py-3 px-5 text-right">
                Trend (1D)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3fa] font-medium">
            {displayStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const isWatchlisted = watchlistSymbols.has(stock.symbol);
              const flash = flashSymbols[stock.symbol];

              // Path fallback if sparklineD not set
              const sparklinePath =
                stock.sparklineD ||
                (isPositive
                  ? 'M0,20 Q25,23 50,12 T100,3'
                  : 'M0,5 Q30,6 60,18 T100,22');

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock)}
                  className={`hover:bg-[#f8f9fd] transition-colors group cursor-pointer ${
                    flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''
                  }`}
                >
                  {/* SYMBOL */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center space-x-3">
                      {/* Watchlist star (quick hover affordance) */}
                      <button
                        onClick={(e) => onToggleWatchlist(stock, e)}
                        className={`p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100 ${
                          isWatchlisted ? '!opacity-100 text-amber-500' : 'text-[#787B86]'
                        }`}
                        title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        aria-label={`Toggle watchlist for ${stock.symbol}`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isWatchlisted ? 'fill-amber-400 text-amber-500' : 'stroke-current'
                          }`}
                        />
                      </button>

                      <span
                        className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                        style={{ backgroundColor: stock.logoBg }}
                      >
                        {stock.logoLetter}
                      </span>
                      <div>
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] flex items-center">
                          {stock.symbol}
                          <span className="ml-1.5 text-[11px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium">
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="text-xs text-[#787B86]">{stock.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="py-3.5 px-4 text-right font-bold text-[#131722] tabular-nums">
                    {stock.currency === 'USD' ? '' : stock.currency === 'KRW' ? '₩' : ''}
                    {stock.price >= 1000
                      ? stock.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : stock.price.toFixed(2)}
                  </td>

                  {/* CHANGE % */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tabular-nums ${
                        isPositive
                          ? 'bg-[#e8f5e9] text-[#089981]'
                          : 'bg-[#ffebee] text-[#F23645]'
                      }`}
                    >
                      {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* CHANGE ($) */}
                  <td
                    className={`py-3.5 px-4 text-right font-semibold tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? `+${stock.changeAmount.toFixed(2)}` : stock.changeAmount.toFixed(2)}
                  </td>

                  {/* VOLUME */}
                  <td className="py-3.5 px-4 text-right text-xs text-[#787B86] tabular-nums">
                    {stock.volume}
                  </td>

                  {/* TREND (1D) */}
                  <td className="py-3.5 px-5 text-right w-28">
                    <svg className="w-24 h-6 ml-auto overflow-visible" viewBox="0 0 100 25">
                      <path
                        d={sparklinePath}
                        fill="none"
                        stroke={isPositive ? '#089981' : '#F23645'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Link */}
      {sortedStocks.length > 5 && (
        <div className="py-3.5 px-5 bg-white border-t border-[#f0f3fa] text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#2962FF] hover:underline inline-flex items-center gap-1 cursor-pointer transition"
          >
            <span>{isExpanded ? 'Show fewer stocks' : 'Show more active stocks'}</span>
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};
