import React from 'react';
import { X, Trash2, ArrowUpRight, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { StockItem } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onClearWatchlist: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistStocks,
  onSelectStock,
  onRemoveFromWatchlist,
  onClearWatchlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/35 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#e0e3eb]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f0f3fa] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-base font-bold text-[#131722]">My Watchlist</h2>
            <span className="text-xs bg-[#f0f3fa] text-[#787B86] px-2 py-0.5 rounded-full font-semibold">
              {watchlistStocks.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {watchlistStocks.length > 0 && (
              <button
                onClick={onClearWatchlist}
                className="text-xs text-[#787B86] hover:text-[#F23645] transition p-1.5 rounded hover:bg-gray-100 cursor-pointer"
                title="Clear all watchlist items"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#787B86] hover:text-[#131722] hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of stocks */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f0f3fa] p-2">
          {watchlistStocks.length === 0 ? (
            <div className="py-20 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-[#f0f3fa] flex items-center justify-center mx-auto mb-3 text-[#787B86]">
                <Star className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#131722] mb-1">Your watchlist is empty</p>
              <p className="text-xs text-[#787B86] leading-relaxed">
                Click the star icon next to any stock symbol in the market movers table to pin it
                here for quick tracking.
              </p>
            </div>
          ) : (
            watchlistStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              return (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f0f3fa] transition group cursor-pointer"
                  onClick={() => {
                    onSelectStock(stock);
                    onClose();
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: stock.logoBg }}
                    >
                      {stock.logoLetter}
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] flex items-center gap-1.5">
                        <span>{stock.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                          {stock.exchange}
                        </span>
                      </div>
                      <div className="text-xs text-[#787B86] truncate max-w-[130px]">
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] tabular-nums">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(stock.symbol);
                      }}
                      className="p-1.5 rounded-lg text-[#787B86] hover:text-[#F23645] hover:bg-gray-200 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f0f3fa] bg-[#fafbfd] text-xs text-[#787B86] text-center">
          Synced across TradingView Markets sessions
        </div>
      </div>
    </div>
  );
};
