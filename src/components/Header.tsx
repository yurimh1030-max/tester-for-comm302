import React, { useState } from 'react';
import { Search, Globe, User, Star, ChevronDown, Check, Activity, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
  isLiveUpdating: boolean;
  onToggleLiveUpdating: () => void;
  language: string;
  onSelectLanguage: (lang: string) => void;
  activeNav: string;
  onSelectNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenGetStarted,
  watchlistCount,
  onOpenWatchlist,
  isLiveUpdating,
  onToggleLiveUpdating,
  language,
  onSelectLanguage,
  activeNav,
  onSelectNav,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'KR', name: '한국어 (Korean)' },
    { code: 'JP', name: '日本語 (Japanese)' },
    { code: 'DE', name: 'Deutsch (German)' },
    { code: 'ES', name: 'Español (Spanish)' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#f0f3fa] px-4 lg:px-7 h-16 flex items-center justify-between">
      {/* Left Navigation items & Search */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* TradingView Iconic Monogram Logo */}
        <button
          onClick={() => onSelectNav('Markets')}
          className="flex items-center text-black hover:opacity-85 transition-opacity cursor-pointer focus:outline-none"
          title="TradingView Markets Home"
          aria-label="TradingView Markets Home"
        >
          <svg className="h-6 w-9 shrink-0" fill="currentColor" viewBox="0 0 36 28">
            <path d="M14.07 0H21.93V28H14.07V0Z" />
            <path d="M0 7.63636H7.86364V28H0V7.63636Z" />
            <path d="M28.1364 15.2727H36V28H28.1364V15.2727Z" />
          </svg>
        </button>

        {/* Quick Search Bar Pill */}
        <button
          onClick={onOpenSearch}
          className="relative hidden sm:flex items-center bg-[#f0f3fa] hover:bg-[#e8ebf2] text-[#787B86] hover:text-[#131722] px-3.5 py-2 rounded-full cursor-pointer transition-colors duration-150 w-44 md:w-60 lg:w-64 text-left group"
          aria-label="Quick Search"
        >
          <Search className="w-4 h-4 mr-2.5 text-[#787B86] group-hover:text-[#131722] shrink-0 transition-colors" />
          <span className="text-xs md:text-sm font-medium truncate">Search (Ctrl+K)</span>
          <kbd className="hidden lg:inline-flex ml-auto text-[10px] font-semibold bg-white border border-[#e0e3eb] px-1.5 py-0.5 rounded text-[#787B86] shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-[#131722]">
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => onSelectNav(item)}
                className={`transition-colors relative py-5 cursor-pointer font-semibold ${
                  isActive
                    ? 'text-[#2962FF] border-b-2 border-[#2962FF] -mb-[1px]'
                    : 'text-[#131722] hover:text-[#2962FF]'
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Utility Buttons */}
      <div className="flex items-center space-x-2 sm:space-x-3.5">
        {/* Live Simulation Pulse Toggle */}
        <button
          onClick={onToggleLiveUpdating}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition ${
            isLiveUpdating
              ? 'bg-emerald-50 text-[#089981] border-emerald-200'
              : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
          }`}
          title={isLiveUpdating ? 'Market updates active (simulated)' : 'Market simulation paused'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveUpdating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span>{isLiveUpdating ? 'Live' : 'Paused'}</span>
        </button>

        {/* Watchlist Quick Button */}
        <button
          onClick={onOpenWatchlist}
          className="relative p-2 rounded-full hover:bg-gray-100 text-[#131722] transition cursor-pointer"
          title="Watchlist"
          aria-label="View Watchlist"
        >
          <Star className="w-4 h-4 text-current" />
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#2962FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-full hover:bg-gray-100 text-[#131722] transition cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-current" />
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-1 text-[#131722] hover:bg-gray-100 px-2.5 py-1.5 rounded-full text-sm font-semibold transition cursor-pointer"
            aria-label="Change Language"
          >
            <Globe className="w-4 h-4 text-[#131722]" />
            <span className="text-xs uppercase font-bold tracking-tight">{language}</span>
            <ChevronDown className="w-3 h-3 text-[#787B86]" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-[#e0e3eb] py-1.5 z-50 text-xs font-medium">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    onSelectLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-[#f0f3fa] transition-colors cursor-pointer text-[#131722]"
                >
                  <span>{l.name}</span>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-[#2962FF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Icon Button */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User Profile"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#131722] transition cursor-pointer"
          >
            <User className="w-5 h-5 text-current" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e0e3eb] p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[#f0f3fa]">
                <div className="font-bold text-sm text-[#131722]">Guest Trader</div>
                <div className="text-[11px] text-[#787B86]">Paper Trading: $100,000.00</div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenWatchlist();
                  }}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-[#f0f3fa] transition text-[#131722] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>My Watchlist ({watchlistCount})</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onToggleLiveUpdating();
                  }}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-[#f0f3fa] transition text-[#131722] flex items-center gap-2 cursor-pointer font-medium"
                >
                  <Activity className="w-3.5 h-3.5 text-[#089981]" />
                  <span>Simulated Live Ticker ({isLiveUpdating ? 'On' : 'Off'})</span>
                </button>
              </div>
              <div className="pt-1 border-t border-[#f0f3fa]">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenGetStarted();
                  }}
                  className="w-full py-1.5 text-center text-xs font-semibold text-[#2962FF] hover:bg-blue-50 rounded-lg transition cursor-pointer"
                >
                  Sign in or Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Vibrant Gradient Get Started Pill */}
        <button
          onClick={onOpenGetStarted}
          className="bg-gradient-to-r from-[#0055ff] via-[#2962ff] to-[#9c27b0] hover:opacity-95 text-white text-xs md:text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
