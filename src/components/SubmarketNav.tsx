import React from 'react';
import { SubmarketCategory } from '../types/market';

interface SubmarketNavProps {
  activeCategory: SubmarketCategory;
  onSelectCategory: (cat: SubmarketCategory) => void;
}

export const SubmarketNav: React.FC<SubmarketNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const tabs: { id: SubmarketCategory; label: string }[] = [
    { id: 'us-stocks', label: 'US stocks' },
    { id: 'world-stocks', label: 'World stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'futures', label: 'Futures' },
    { id: 'forex', label: 'Forex' },
    { id: 'govt-bonds', label: 'Government bonds' },
    { id: 'corp-bonds', label: 'Corporate bonds' },
    { id: 'etfs', label: 'ETFs' },
    { id: 'economy', label: 'Economy' },
  ];

  return (
    <div className="flex items-center justify-start lg:justify-center overflow-x-auto hide-scrollbar pb-6 mb-8 gap-2 px-1">
      {tabs.map((tab) => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm whitespace-nowrap transition cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#f0f3fa] text-[#131722] font-semibold shadow-xs'
                : 'text-[#787b86] font-medium hover:text-[#131722] hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
