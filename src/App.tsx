/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { CollegeCard } from './components/CollegeCard';
import { CollegeDetailModal } from './components/CollegeDetailModal';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { FitCalculatorModal } from './components/FitCalculatorModal';
import { AICounselorDrawer } from './components/AICounselorDrawer';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { COLLEGES_DATA } from './data/colleges';
import { College, FilterState } from './types';
import { Scale, Sparkles, Calculator, Bookmark, Check, X, ArrowRight, Info } from 'lucide-react';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'directory' | 'compare' | 'fit' | 'counselor' | 'roi'>('directory');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedStream: 'All',
    selectedTypes: [],
    selectedZones: [],
    selectedExams: [],
    maxAnnualFee: 15,
    minAvgCTC: 0,
    maxNirfRank: 100,
    sortBy: 'nirf'
  });

  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Compared colleges (max 4)
  const [comparedColleges, setComparedColleges] = useState<College[]>(() => {
    // Default 2 popular colleges for initial demo comparison
    const iitb = COLLEGES_DATA.find((c) => c.id === 'iit-bombay');
    const bits = COLLEGES_DATA.find((c) => c.id === 'bits-pilani');
    return iitb && bits ? [iitb, bits] : [];
  });

  // Shortlisted colleges
  const [shortlistedColleges, setShortlistedColleges] = useState<College[]>(() => {
    try {
      const saved = localStorage.getItem('shiksha_shortlist');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        return COLLEGES_DATA.filter((c) => ids.includes(c.id));
      }
    } catch (e) {
      // ignore
    }
    return [COLLEGES_DATA[0], COLLEGES_DATA[1]];
  });

  // Modals & Drawers state
  const [detailCollege, setDetailCollege] = useState<College | null>(null);
  const [isFitModalOpen, setIsFitModalOpen] = useState(false);
  const [isCounselorDrawerOpen, setIsCounselorDrawerOpen] = useState(false);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
  const [isShortlistDrawerOpen, setIsShortlistDrawerOpen] = useState(false);
  const [counselorInitialPrompt, setCounselorInitialPrompt] = useState<string | undefined>(undefined);

  // Sync shortlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shiksha_shortlist', JSON.stringify(shortlistedColleges.map((c) => c.id)));
    } catch (e) {
      // ignore
    }
  }, [shortlistedColleges]);

  // Handle compare toggle
  const handleToggleCompare = (college: College) => {
    setComparedColleges((prev) => {
      const exists = prev.some((c) => c.id === college.id);
      if (exists) {
        return prev.filter((c) => c.id !== college.id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 colleges at the same time.');
        return prev;
      }
      return [...prev, college];
    });
  };

  // Handle shortlist toggle
  const handleToggleShortlist = (college: College) => {
    setShortlistedColleges((prev) => {
      const exists = prev.some((c) => c.id === college.id);
      if (exists) {
        return prev.filter((c) => c.id !== college.id);
      }
      return [...prev, college];
    });
  };

  // Trigger Counselor with custom prompt
  const handleAskCounselor = (prompt: string) => {
    setCounselorInitialPrompt(prompt);
    setIsCounselorDrawerOpen(true);
  };

  // Filter and sort colleges
  const filteredColleges = useMemo(() => {
    return COLLEGES_DATA.filter((college) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = college.name.toLowerCase().includes(query);
        const matchesShort = college.shortName.toLowerCase().includes(query);
        const matchesCity = college.city.toLowerCase().includes(query);
        const matchesState = college.state.toLowerCase().includes(query);
        const matchesExams = college.acceptedExams.some((e) => e.toLowerCase().includes(query));
        const matchesBranches = college.popularBranches.some((b) => b.toLowerCase().includes(query));

        if (!matchesName && !matchesShort && !matchesCity && !matchesState && !matchesExams && !matchesBranches) {
          return false;
        }
      }

      // Stream
      if (filters.selectedStream !== 'All' && college.stream !== filters.selectedStream) {
        return false;
      }

      // Type
      if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(college.type)) {
        return false;
      }

      // Zone
      if (filters.selectedZones.length > 0 && !filters.selectedZones.includes(college.zone)) {
        return false;
      }

      // Max Annual Fee
      if (college.annualTuitionFeeLakhs > filters.maxAnnualFee) {
        return false;
      }

      // Min Avg CTC
      if (college.avgPlacementCTCLPA < filters.minAvgCTC) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'nirf') {
        return a.nirfStreamRank - b.nirfStreamRank;
      }
      if (filters.sortBy === 'placement') {
        return b.avgPlacementCTCLPA - a.avgPlacementCTCLPA;
      }
      if (filters.sortBy === 'fee-asc') {
        return a.annualTuitionFeeLakhs - b.annualTuitionFeeLakhs;
      }
      if (filters.sortBy === 'roi') {
        return a.roiPaybackMonths - b.roiPaybackMonths;
      }
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        comparedColleges={comparedColleges}
        shortlistedColleges={shortlistedColleges}
        onOpenShortlist={() => setIsShortlistDrawerOpen(true)}
        onOpenCompare={() => setActiveTab('compare')}
      />

      {/* Main Content Areas */}
      <main className="flex-1 pb-24">
        {activeTab === 'directory' && (
          <>
            {/* Hero Section with Search & Instant Filters */}
            <HeroSearch
              filters={filters}
              setFilters={setFilters}
              totalCount={COLLEGES_DATA.length}
              filteredCount={filteredColleges.length}
              onOpenFitModal={() => setIsFitModalOpen(true)}
              onOpenCompareModal={() => setActiveTab('compare')}
              onOpenCounselorModal={() => setIsCounselorDrawerOpen(true)}
              showFiltersDrawer={showFiltersDrawer}
              setShowFiltersDrawer={setShowFiltersDrawer}
            />

            {/* Colleges Grid Directory */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Informational Sub-header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {filters.selectedStream === 'All'
                      ? 'Premier Indian Institutions'
                      : `Top Institutes in ${filters.selectedStream}`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {filteredColleges.length} institutes sorted by{' '}
                    <span className="font-semibold text-slate-700">
                      {filters.sortBy === 'nirf'
                        ? 'NIRF Ranking'
                        : filters.sortBy === 'placement'
                        ? 'Placement Package'
                        : filters.sortBy === 'fee-asc'
                        ? 'Affordable Tuition'
                        : filters.sortBy === 'roi'
                        ? 'Fastest ROI Payback'
                        : 'Name'}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFitModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
                  >
                    <Calculator className="w-3.5 h-3.5 text-amber-700" />
                    <span>Predict My Fit</span>
                  </button>
                  <button
                    onClick={() => setIsRoiModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    <span>₹ ROI Simulator</span>
                  </button>
                </div>
              </div>

              {/* Grid cards */}
              {filteredColleges.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                  <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h3 className="font-bold text-slate-800 text-base mb-1">No Institutes Matched Your Filters</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Try clearing some of your filter criteria such as maximum tuition fee, minimum salary package, or search keyword.
                  </p>
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
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredColleges.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      isCompared={comparedColleges.some((c) => c.id === college.id)}
                      isShortlisted={shortlistedColleges.some((c) => c.id === college.id)}
                      onToggleCompare={handleToggleCompare}
                      onToggleShortlist={handleToggleShortlist}
                      onOpenDetails={(col) => setDetailCollege(col)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab: Side-by-Side Comparison */}
        {activeTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ComparisonMatrix
              comparedColleges={comparedColleges}
              allColleges={COLLEGES_DATA}
              onRemoveCollege={(id) => setComparedColleges((prev) => prev.filter((c) => c.id !== id))}
              onAddCollege={(col) => {
                if (comparedColleges.length < 4) {
                  setComparedColleges((prev) => [...prev, col]);
                }
              }}
              onClearAll={() => setComparedColleges([])}
              onAskCounselorComparison={(cols) => {
                const prompt = `Please provide a rigorous, objective comparison between ${cols
                  .map((c) => c.name)
                  .join(' and ')}. Analyze which one offers the superior career trajectory, ROI, campus life, and placement stability.`;
                handleAskCounselor(prompt);
              }}
              onClose={() => setActiveTab('directory')}
            />
          </div>
        )}

        {/* Tab: Fit Predictor Direct View */}
        {activeTab === 'fit' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <FitCalculatorModal
              isOpen={true}
              onClose={() => setActiveTab('directory')}
              onOpenDetails={(col) => setDetailCollege(col)}
              onToggleCompare={handleToggleCompare}
              comparedColleges={comparedColleges}
            />
          </div>
        )}

        {/* Tab: ROI Visualizer Direct View */}
        {activeTab === 'roi' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <RoiCalculatorModal
              isOpen={true}
              onClose={() => setActiveTab('directory')}
              allColleges={COLLEGES_DATA}
              selectedCollege={comparedColleges[0] || COLLEGES_DATA[0]}
            />
          </div>
        )}

        {/* Tab: AI Counselor Direct View */}
        {activeTab === 'counselor' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AICounselorDrawer
              isOpen={true}
              onClose={() => setActiveTab('directory')}
              comparedColleges={comparedColleges}
              allColleges={COLLEGES_DATA}
              onOpenDetails={(col) => setDetailCollege(col)}
              initialPrompt={counselorInitialPrompt}
            />
          </div>
        )}
      </main>

      {/* Floating Sticky Comparison Bar (When colleges are selected) */}
      {comparedColleges.length > 0 && activeTab === 'directory' && (
        <div className="fixed bottom-4 inset-x-4 max-w-4xl mx-auto z-30 bg-slate-900 text-white rounded-xl shadow-2xl p-3 sm:px-4 flex items-center justify-between border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 shrink-0">
              <Scale className="w-4 h-4" />
              <span>Comparing ({comparedColleges.length}/4):</span>
            </div>

            <div className="flex items-center gap-1.5">
              {comparedColleges.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-200 shrink-0"
                >
                  <span className="truncate max-w-[120px] font-medium">{col.shortName}</span>
                  <button
                    onClick={() => handleToggleCompare(col)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              onClick={() => setActiveTab('compare')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
            >
              <span>View Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* College Detail Modal */}
      <CollegeDetailModal
        college={detailCollege}
        onClose={() => setDetailCollege(null)}
        isCompared={detailCollege ? comparedColleges.some((c) => c.id === detailCollege.id) : false}
        isShortlisted={detailCollege ? shortlistedColleges.some((c) => c.id === detailCollege.id) : false}
        onToggleCompare={handleToggleCompare}
        onToggleShortlist={handleToggleShortlist}
        onAskCounselorAbout={(col) => {
          setDetailCollege(null);
          handleAskCounselor(
            `Provide an in-depth admissions assessment of ${col.name}. What are the cutoff requirements, true average placement packages, and what type of student is best suited for it?`
          );
        }}
      />

      {/* Floating Fit Calculator Modal */}
      {isFitModalOpen && activeTab !== 'fit' && (
        <FitCalculatorModal
          isOpen={isFitModalOpen}
          onClose={() => setIsFitModalOpen(false)}
          onOpenDetails={(col) => setDetailCollege(col)}
          onToggleCompare={handleToggleCompare}
          comparedColleges={comparedColleges}
        />
      )}

      {/* Floating ROI Calculator Modal */}
      {isRoiModalOpen && activeTab !== 'roi' && (
        <RoiCalculatorModal
          isOpen={isRoiModalOpen}
          onClose={() => setIsRoiModalOpen(false)}
          allColleges={COLLEGES_DATA}
          selectedCollege={comparedColleges[0] || COLLEGES_DATA[0]}
        />
      )}

      {/* Floating AI Counselor Drawer */}
      {isCounselorDrawerOpen && activeTab !== 'counselor' && (
        <AICounselorDrawer
          isOpen={isCounselorDrawerOpen}
          onClose={() => setIsCounselorDrawerOpen(false)}
          comparedColleges={comparedColleges}
          allColleges={COLLEGES_DATA}
          onOpenDetails={(col) => setDetailCollege(col)}
          initialPrompt={counselorInitialPrompt}
        />
      )}

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistDrawerOpen}
        onClose={() => setIsShortlistDrawerOpen(false)}
        shortlistedColleges={shortlistedColleges}
        onRemoveShortlist={(id) => setShortlistedColleges((prev) => prev.filter((c) => c.id !== id))}
        onLoadIntoCompare={(cols) => {
          setComparedColleges(cols);
          setActiveTab('compare');
        }}
        onOpenDetails={(col) => setDetailCollege(col)}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">ShikshaSetu</span>
            <span>·</span>
            <span>Independent Indian Higher Education Comparison Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Data Grounded in NIRF 2026 & AICTE/UGC</span>
            <span>·</span>
            <span>JoSAA / CSAB / MCC / CAT Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
