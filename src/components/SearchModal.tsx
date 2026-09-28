import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { StockItem } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allStocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allStocks,
  onSelectStock,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'us-stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'etfs', label: 'ETFs' },
  ];

  const filteredStocks = allStocks.filter((stock) => {
    const matchesCategory =
      selectedCategory === 'all' || stock.category === selectedCategory;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      stock.symbol.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q) ||
      stock.exchange.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e0e3eb] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker, company or market asset (e.g. NVDA, Apple, BTC)..."
            className="w-full bg-transparent text-sm sm:text-base text-[#131722] placeholder-[#787B86] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-gray-100 text-[#787B86] hover:text-[#131722] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-xs font-semibold text-[#787B86] hover:text-[#131722] bg-gray-100 hover:bg-gray-200 px-2 py-1 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#fafbfd] border-b border-[#e0e3eb] overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                selectedCategory === cat.id
                  ? 'bg-[#131722] text-white'
                  : 'bg-white text-[#787B86] hover:text-[#131722] border border-[#e0e3eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#f0f3fa] p-2">
          {filteredStocks.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#787B86]">
              No financial symbols matching &quot;{query}&quot;
            </div>
          ) : (
            filteredStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    onSelectStock(stock);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f0f3fa] cursor-pointer transition group"
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
                      <div className="text-xs text-[#787B86] truncate max-w-xs sm:max-w-md">
                        {stock.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-sm font-bold text-[#131722] tabular-nums">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold flex items-center justify-end gap-1 tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787B86] group-hover:text-[#2962FF] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#fafbfd] border-t border-[#e0e3eb] text-[11px] text-[#787B86] flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>TradingView Markets Fast Search</span>
        </div>
      </div>
    </div>
  );
};
