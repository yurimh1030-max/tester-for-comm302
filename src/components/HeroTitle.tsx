import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface HeroTitleProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const HeroTitle: React.FC<HeroTitleProps> = ({ selectedRegion, onSelectRegion }) => {
  const [isOpen, setIsOpen] = useState(false);

  const regions = [
    { id: 'everywhere', label: 'Markets, everywhere' },
    { id: 'us', label: 'United States Markets' },
    { id: 'global', label: 'Global World Markets' },
    { id: 'europe', label: 'European Markets' },
    { id: 'asia', label: 'Asia-Pacific Markets' },
  ];

  const currentLabel = regions.find((r) => r.id === selectedRegion)?.label || 'Markets, everywhere';

  return (
    <div className="text-center mb-8 relative">
      <div className="inline-block relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-2 sm:gap-3 text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#131722] hover:opacity-90 transition cursor-pointer select-none"
          aria-expanded={isOpen}
          aria-label="Select Market Region"
        >
          <span>{currentLabel}</span>
          <ChevronDown
            className={`w-7 h-7 sm:w-9 sm:h-9 stroke-[3] text-black transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#e0e3eb] py-2 z-30 text-left">
            <div className="px-4 py-2 border-b border-[#f0f3fa] text-xs font-semibold uppercase text-[#787B86] tracking-wider">
              Select Region Focus
            </div>
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => {
                  onSelectRegion(region.id);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between hover:bg-[#f0f3fa] transition-colors cursor-pointer text-[#131722]"
              >
                <span>{region.label}</span>
                {selectedRegion === region.id && (
                  <Check className="w-4 h-4 text-[#2962FF]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
