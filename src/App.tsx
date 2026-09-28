import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroTitle } from './components/HeroTitle';
import { SubmarketNav } from './components/SubmarketNav';
import { IndicesCards } from './components/IndicesCards';
import { MarketMoversTable } from './components/MarketMoversTable';
import { SearchModal } from './components/SearchModal';
import { StockDetailModal } from './components/StockDetailModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { GetStartedModal } from './components/GetStartedModal';
import {
  SubmarketCategory,
  MoverFilter,
  StockItem,
  IndexCardData,
} from './types/market';
import { INDICES_DATA, ALL_STOCKS_DATA } from './data/marketData';

export default function App() {
  // Navigation & Category states
  const [activeNav, setActiveNav] = useState('Markets');
  const [activeCategory, setActiveCategory] = useState<SubmarketCategory>('us-stocks');
  const [activeFilter, setActiveFilter] = useState<MoverFilter>('most-active');
  const [selectedRegion, setSelectedRegion] = useState('everywhere');
  const [language, setLanguage] = useState('EN');

  // Interactive Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  // Watchlist state (persisted in memory & localStorage)
  const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['NVDA', 'AAPL']);
    } catch {
      return new Set(['NVDA', 'AAPL']);
    }
  });

  // Paper Trading Balance
  const [userBalance, setUserBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tv_paper_balance');
      return saved ? parseFloat(saved) : 100000;
    } catch {
      return 100000;
    }
  });

  // Live price tick simulation state
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);
  const [liveStocks, setLiveStocks] = useState<StockItem[]>(ALL_STOCKS_DATA);
  const [flashSymbols, setFlashSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Synchronize watchlist changes
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist', JSON.stringify(Array.from(watchlistSymbols)));
    } catch {
      // ignore
    }
  }, [watchlistSymbols]);

  // Synchronize balance
  useEffect(() => {
    try {
      localStorage.setItem('tv_paper_balance', userBalance.toString());
    } catch {
      // ignore
    }
  }, [userBalance]);

  // Live price tick simulation
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setLiveStocks((prevStocks) => {
        // Pick 1 or 2 random stocks to fluctuate slightly
        const randomIndex = Math.floor(Math.random() * prevStocks.length);
        const target = prevStocks[randomIndex];

        // Random price delta between -0.3% and +0.3%
        const deltaPercent = (Math.random() * 0.6 - 0.28) / 100;
        const newPrice = Number((target.price * (1 + deltaPercent)).toFixed(2));
        const deltaAmount = Number((newPrice - target.price).toFixed(2));
        const newChangeAmount = Number((target.changeAmount + deltaAmount).toFixed(2));
        const newChangePercent = Number(
          (target.changePercent + deltaPercent * 100).toFixed(2)
        );

        const direction: 'up' | 'down' = deltaAmount >= 0 ? 'up' : 'down';

        setFlashSymbols((prev) => ({ ...prev, [target.symbol]: direction }));
        setTimeout(() => {
          setFlashSymbols((prev) => {
            const next = { ...prev };
            delete next[target.symbol];
            return next;
          });
        }, 900);

        const updated = [...prevStocks];
        updated[randomIndex] = {
          ...target,
          price: newPrice,
          changeAmount: newChangeAmount,
          changePercent: newChangePercent,
        };
        return updated;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  // Current category stocks
  const currentCategoryStocks = useMemo(() => {
    return liveStocks.filter((s) => s.category === activeCategory);
  }, [liveStocks, activeCategory]);

  // Current indices data
  const currentIndices = useMemo(() => {
    return INDICES_DATA[activeCategory] || INDICES_DATA['us-stocks'];
  }, [activeCategory]);

  // Watchlisted stock items
  const watchlistStockItems = useMemo(() => {
    return liveStocks.filter((s) => watchlistSymbols.has(s.symbol));
  }, [liveStocks, watchlistSymbols]);

  // Toggle watchlist
  const handleToggleWatchlist = (stock: StockItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlistSymbols((prev) => {
      const next = new Set(prev);
      if (next.has(stock.symbol)) {
        next.delete(stock.symbol);
      } else {
        next.add(stock.symbol);
      }
      return next;
    });
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) => {
      const next = new Set(prev);
      next.delete(symbol);
      return next;
    });
  };

  const handleClearWatchlist = () => {
    setWatchlistSymbols(new Set());
  };

  // Trade handler
  const handleTrade = (
    symbol: string,
    type: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    const totalCost = shares * price;
    if (type === 'BUY') {
      setUserBalance((prev) => prev - totalCost);
    } else {
      setUserBalance((prev) => prev + totalCost);
    }
  };

  // Click on Index Card
  const handleSelectIndex = (index: IndexCardData) => {
    // If it's an index, find corresponding stock or synthesize a view
    const stockMatch = liveStocks.find(
      (s) => s.symbol.toLowerCase() === index.symbol.toLowerCase()
    );
    if (stockMatch) {
      setSelectedStock(stockMatch);
    } else {
      setSelectedStock({
        symbol: index.symbol,
        name: index.name,
        exchange: 'INDEX',
        currency: 'USD',
        price: index.numericPrice,
        changePercent: index.numericChangePercent,
        changeAmount: (index.numericPrice * index.numericChangePercent) / 100,
        volume: '1.2B',
        numericVolume: 1200000000,
        logoLetter: index.badgeText,
        logoBg: index.badgeBg,
        trendPoints: [index.numericPrice * 0.99, index.numericPrice],
        category: activeCategory,
        marketCap: '$45.2T',
        peRatio: '24.8',
        description: `${index.name} is a premier benchmark index reflecting market performance and capital flows across top equities.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#131722] font-sans antialiased selection:bg-blue-100 flex flex-col">
      {/* Top Header Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
        watchlistCount={watchlistSymbols.size}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        isLiveUpdating={isLiveUpdating}
        onToggleLiveUpdating={() => setIsLiveUpdating(!isLiveUpdating)}
        language={language}
        onSelectLanguage={setLanguage}
        activeNav={activeNav}
        onSelectNav={setActiveNav}
      />

      {/* Main Content Viewport */}
      <main className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 flex-1">
        {/* Hero Title Section */}
        <HeroTitle
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Submarket Pill Navigation */}
        <SubmarketNav
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Indices Overview Section */}
        <IndicesCards
          indices={currentIndices}
          onSelectIndex={handleSelectIndex}
          onViewAllIndices={() => {
            // Focus on indices view or scroll
          }}
        />

        {/* Movers & Ticker Table Section */}
        <MarketMoversTable
          category={activeCategory}
          stocks={currentCategoryStocks}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          onSelectStock={(stock) => setSelectedStock(stock)}
          watchlistSymbols={watchlistSymbols}
          onToggleWatchlist={handleToggleWatchlist}
          flashSymbols={flashSymbols}
        />
      </main>

      {/* Global Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allStocks={liveStocks}
        onSelectStock={(stock) => setSelectedStock(stock)}
      />

      <StockDetailModal
        stock={selectedStock}
        isOpen={selectedStock !== null}
        onClose={() => setSelectedStock(null)}
        isWatchlisted={selectedStock ? watchlistSymbols.has(selectedStock.symbol) : false}
        onToggleWatchlist={() => {
          if (selectedStock) handleToggleWatchlist(selectedStock);
        }}
        userBalance={userBalance}
        onTrade={handleTrade}
      />

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistStocks={watchlistStockItems}
        onSelectStock={(stock) => setSelectedStock(stock)}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onClearWatchlist={handleClearWatchlist}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />
    </div>
  );
}
