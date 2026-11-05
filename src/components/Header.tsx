import React from 'react';
import { Landmark, Scale, Sparkles, Bookmark, Calculator, GraduationCap } from 'lucide-react';
import { College } from '../types';

interface HeaderProps {
  activeTab: 'directory' | 'compare' | 'fit' | 'counselor' | 'roi';
  setActiveTab: (tab: 'directory' | 'compare' | 'fit' | 'counselor' | 'roi') => void;
  comparedColleges: College[];
  shortlistedColleges: College[];
  onOpenShortlist: () => void;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  comparedColleges,
  shortlistedColleges,
  onOpenShortlist,
  onOpenCompare
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('directory')}>
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-amber-400 shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">ShikshaSetu</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/80">
                  India 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Premier College & University Comparison Engine
              </p>
            </div>
          </div>

          {/* Navigation Items (Clean Typography with subtle active states) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'directory'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                Colleges Directory
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('compare');
                onOpenCompare();
              }}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                activeTab === 'compare'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                Compare Matrix
                {comparedColleges.length > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                    {comparedColleges.length}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fit')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'fit'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4" />
                Fit Predictor
              </span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'roi'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span>₹</span>
                ROI Visualizer
              </span>
            </button>

            <button
              onClick={() => setActiveTab('counselor')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'counselor'
                  ? 'bg-amber-100 text-amber-950 font-semibold'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                AI Counselor
              </span>
            </button>
          </nav>

          {/* Action Trays: Shortlist & Quick Compare Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenShortlist}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Saved Colleges"
            >
              <Bookmark className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Shortlist</span>
              <span className="text-slate-500">({shortlistedColleges.length})</span>
            </button>

            {comparedColleges.length > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Compare ({comparedColleges.length}/4)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
