import React from 'react';
import { ChevronRight } from 'lucide-react';
import { IndexCardData } from '../types/market';

interface IndicesCardsProps {
  indices: IndexCardData[];
  onSelectIndex: (index: IndexCardData) => void;
  onViewAllIndices: () => void;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  indices,
  onSelectIndex,
  onViewAllIndices,
}) => {
  return (
    <section className="mb-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onViewAllIndices}
          className="group inline-flex items-center text-2xl font-bold text-[#131722] hover:text-[#2962FF] transition-colors cursor-pointer"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 ml-1 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((idx) => {
          const isGreen = idx.isPositive;
          const strokeColor = isGreen ? '#089981' : '#F23645';

          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className="p-4 rounded-2xl bg-[#f0f3fa]/80 hover:bg-[#f0f3fa] border border-transparent hover:border-zinc-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span
                    className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm shrink-0"
                    style={{ backgroundColor: idx.badgeBg }}
                  >
                    {idx.badgeText}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#131722] group-hover:text-[#2962FF] transition-colors">
                      {idx.name}
                    </h3>
                    <span className="text-xs text-[#787B86]">{idx.symbol}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#131722] tabular-nums">
                    {idx.price}
                  </div>
                  <div
                    className={`text-xs font-semibold tabular-nums flex items-center justify-end ${
                      isGreen ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    <span>{idx.changePercent}</span>
                  </div>
                </div>
              </div>

              {/* Sparkline SVG */}
              <div className="h-10 w-full pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                  <defs>
                    <linearGradient id={`grad-${idx.id}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={strokeColor} />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={idx.sparklineD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="1.75"
                  />
                  <path
                    d={`${idx.sparklineD} L200,40 L0,40 Z`}
                    fill={`url(#grad-${idx.id})`}
                    opacity="0.15"
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
