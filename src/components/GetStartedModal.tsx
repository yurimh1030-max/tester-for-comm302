import React, { useState } from 'react';
import { X, CheckCircle, TrendingUp, BarChart2, Bell, Zap } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#e0e3eb] overflow-hidden p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#787B86] hover:text-[#131722] hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-[#2962FF] mb-3">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#131722] tracking-tight">
            Get started with Markets
          </h2>
          <p className="text-xs text-[#787B86] mt-1">
            Access institutional grade charting, paper trading, and real-time alerts.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-[#089981] mx-auto animate-bounce" />
            <div className="text-base font-bold text-[#131722]">Welcome to TradingView!</div>
            <div className="text-xs text-[#787B86]">Your sandbox trader account is activated.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#131722]">
                <TrendingUp className="w-3.5 h-3.5 text-[#089981]" />
                <span>Unlimited real-time stock & crypto market tickers</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#131722]">
                <BarChart2 className="w-3.5 h-3.5 text-[#2962FF]" />
                <span>100+ technical indicators and Pine Script charting</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#131722]">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>$100,000 paper trading balance to practice risk-free</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-[#131722] mb-1.5">
                Work or Personal Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e0e3eb] text-sm text-[#131722] placeholder-[#787B86] focus:border-[#2962FF] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0055ff] via-[#2962ff] to-[#9c27b0] text-white text-sm font-bold shadow-md hover:opacity-95 transition cursor-pointer"
            >
              Create Free Trader Account
            </button>

            <div className="text-center">
              <span className="text-[11px] text-[#787B86]">
                No credit card required · Free forever sandbox
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
