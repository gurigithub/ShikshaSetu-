import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles, Calculator, Scale, ArrowUpDown } from 'lucide-react';
import { FilterState, Stream } from '../types';
import { ALL_STREAMS, ALL_ZONES, ALL_INSTITUTE_TYPES } from '../data/colleges';

interface HeroSearchProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  onOpenFitModal: () => void;
  onOpenCompareModal: () => void;
  onOpenCounselorModal: () => void;
  showFiltersDrawer: boolean;
  setShowFiltersDrawer: (show: boolean) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onOpenFitModal,
  onOpenCompareModal,
  onOpenCounselorModal,
  showFiltersDrawer,
  setShowFiltersDrawer
}) => {
  const handleStreamChange = (stream: Stream | 'All') => {
    setFilters((prev) => ({ ...prev, selectedStream: stream }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto">
        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs font-semibold mb-3">
            <span>🇮🇳 Verified NIRF Rankings & MoE Data</span>
            <span aria-hidden="true">·</span>
            <span>2026 Admissions Ready</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Identify & Compare the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Best Colleges in India</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Unbiased, data-driven comparisons across IITs, NITs, IIMs, AIIMS, and premier universities. Analyze actual placement CTCs, tuition fees, cutoffs, and exact ROI payback periods.
          </p>
        </div>

        {/* Quick Action Bar (Hero CTA Buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={onOpenFitModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-md transition-all transform active:scale-95"
          >
            <Calculator className="w-4 h-4 text-slate-950" />
            <span>Personalized Fit & Eligibility Predictor</span>
          </button>

          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs sm:text-sm transition-all active:scale-95"
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Side-by-Side Comparison Matrix</span>
          </button>

          <button
            onClick={onOpenCounselorModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-semibold text-xs sm:text-sm transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Admissions Counselor</span>
          </button>
        </div>

        {/* Search & Stream Selector Box */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-5 text-slate-900 border border-slate-200/80">
          {/* Search bar input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by institute name, city (e.g. Chennai, Delhi), exam (JEE, CAT, NEET), or keyword..."
              className="w-full pl-11 pr-10 py-3 text-sm sm:text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 placeholder:text-slate-400 transition-shadow"
            />
            {filters.searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Stream Filter Segmented Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
              {ALL_STREAMS.map((stream) => {
                const isActive = filters.selectedStream === stream;
                return (
                  <button
                    key={stream}
                    onClick={() => handleStreamChange(stream)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {stream === 'All' ? 'All Disciplines' : stream}
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle & Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  showFiltersDrawer
                    ? 'bg-slate-100 text-slate-900 border-slate-400'
                    : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {(filters.selectedTypes.length > 0 ||
                  filters.selectedZones.length > 0 ||
                  filters.maxAnnualFee < 15 ||
                  filters.minAvgCTC > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>

              <div className="flex items-center gap-1 text-xs text-slate-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy']
                    }))
                  }
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="nirf">NIRF Rank (Top First)</option>
                  <option value="placement">Avg Placement CTC (High to Low)</option>
                  <option value="fee-asc">Annual Tuition Fee (Low to High)</option>
                  <option value="roi">Fastest ROI Payback</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Drawer / Expandable Filter Controls */}
          {showFiltersDrawer && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Type Filter */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Institute Type</label>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
                  {ALL_INSTITUTE_TYPES.map((type) => {
                    const isSelected = filters.selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            selectedTypes: isSelected
                              ? prev.selectedTypes.filter((t) => t !== type)
                              : [...prev.selectedTypes, type]
                          }));
                        }}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          isSelected
                            ? 'bg-slate-900 text-white font-medium'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zone Filter */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1.5">Geographic Region</label>
                <div className="flex flex-wrap gap-1">
                  {ALL_ZONES.map((zone) => {
                    const isSelected = filters.selectedZones.includes(zone);
                    return (
                      <button
                        key={zone}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            selectedZones: isSelected
                              ? prev.selectedZones.filter((z) => z !== zone)
                              : [...prev.selectedZones, zone]
                          }));
                        }}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          isSelected
                            ? 'bg-slate-900 text-white font-medium'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {zone} India
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Max Annual Tuition Fee Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-800">Max Annual Tuition</label>
                  <span className="text-slate-600 font-medium">₹{filters.maxAnnualFee} Lakhs</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={filters.maxAnnualFee}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, maxAnnualFee: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-slate-900"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Subsidized (&lt; ₹1L)</span>
                  <span>₹15L+</span>
                </div>
              </div>

              {/* Min Placement CTC Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-800">Min Placement CTC</label>
                  <span className="text-slate-600 font-medium">₹{filters.minAvgCTC} LPA</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="2"
                  value={filters.minAvgCTC}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minAvgCTC: parseInt(e.target.value, 10) }))
                  }
                  className="w-full accent-slate-900"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>Any Package</span>
                  <span>₹30+ LPA</span>
                </div>
              </div>

              {/* Reset Filters button */}
              <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
                  <strong className="text-slate-800">{totalCount}</strong> premier institutes
                </span>
                <button
                  onClick={() =>
                    setFilters({
                      searchQuery: '',
                      selectedStream: 'All',
                      selectedTypes: [],
                      selectedZones: [],
                      selectedExams: [],
                      maxAnnualFee: 15,
                      minAvgCTC: 0,
                      maxNirfRank: 100,
                      sortBy: 'nirf'
                    })
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
