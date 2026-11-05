import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Target, Award, Scale, HelpCircle } from 'lucide-react';
import { CategoryQuota, College, FitRecommendation, Stream, UserEligibilityProfile } from '../types';
import { calculateCollegeFit } from '../utils/fitCalculator';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Delhi', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

interface FitCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDetails: (college: College) => void;
  onToggleCompare: (college: College) => void;
  comparedColleges: College[];
}

export const FitCalculatorModal: React.FC<FitCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenDetails,
  onToggleCompare,
  comparedColleges
}) => {
  const [profile, setProfile] = useState<UserEligibilityProfile>({
    stream: 'Engineering',
    exam: 'JEE Main',
    scoreOrRank: 98.5,
    isPercentile: true,
    category: 'General',
    homeState: 'Delhi',
    maxTotalBudgetLakhs: 12,
    priority: 'roi'
  });

  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState<FitRecommendation[]>([]);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const recommendations = calculateCollegeFit(profile);
    setResults(recommendations);
    setHasCalculated(true);
  };

  const dreamMatches = results.filter((r) => r.matchType === 'Dream');
  const targetMatches = results.filter((r) => r.matchType === 'Target');
  const safeMatches = results.filter((r) => r.matchType === 'Safe');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold mb-1 border border-amber-200/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Smart Institute Suitability Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Personalized College & University Fit Predictor
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your examination score, category quota, home state, and budget to find your Dream, Target, and Safe colleges.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 text-sm space-y-6">
          {/* Input Form */}
          <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            {/* Stream */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Academic Discipline</label>
              <select
                value={profile.stream}
                onChange={(e) => {
                  const s = e.target.value as Stream;
                  let defaultExam = 'JEE Main';
                  if (s === 'Management') defaultExam = 'CAT';
                  if (s === 'Medical') defaultExam = 'NEET UG';
                  if (s === 'Law') defaultExam = 'CLAT';
                  if (s === 'University' || s === 'Sciences') defaultExam = 'CUET UG';
                  setProfile((prev) => ({ ...prev, stream: s, exam: defaultExam }));
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              >
                <option value="Engineering">Engineering & Technology</option>
                <option value="Management">Management / MBA</option>
                <option value="Medical">Medical & Healthcare (MBBS)</option>
                <option value="Law">Law (NLUs / LL.B)</option>
                <option value="University">Multidisciplinary Universities (DU/JNU/BHU)</option>
              </select>
            </div>

            {/* Exam */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Entrance Exam</label>
              <select
                value={profile.exam}
                onChange={(e) => setProfile((prev) => ({ ...prev, exam: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              >
                {profile.stream === 'Engineering' && (
                  <>
                    <option value="JEE Main">JEE Main</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                    <option value="BITSAT">BITSAT</option>
                    <option value="WBJEE">WBJEE</option>
                    <option value="VITEEE">VITEEE</option>
                  </>
                )}
                {profile.stream === 'Management' && (
                  <>
                    <option value="CAT">CAT (Common Admission Test)</option>
                    <option value="XAT">XAT (Xavier Aptitude Test)</option>
                    <option value="GMAT">GMAT</option>
                  </>
                )}
                {profile.stream === 'Medical' && (
                  <>
                    <option value="NEET UG">NEET UG</option>
                    <option value="INI-CET">INI-CET</option>
                  </>
                )}
                {profile.stream === 'Law' && (
                  <>
                    <option value="CLAT">CLAT (Common Law Admission Test)</option>
                    <option value="AILET">AILET (NLU Delhi)</option>
                  </>
                )}
                {(profile.stream === 'University' || profile.stream === 'Sciences') && (
                  <>
                    <option value="CUET UG">CUET UG</option>
                    <option value="CUET PG">CUET PG</option>
                    <option value="JEE Advanced">JEE Advanced</option>
                  </>
                )}
              </select>
            </div>

            {/* Score / Rank */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {profile.isPercentile ? 'Expected / Actual Percentile' : 'All India Rank (AIR)'}
                </label>
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, isPercentile: !prev.isPercentile }))}
                  className="text-[10px] text-amber-800 font-semibold underline"
                >
                  Switch to {profile.isPercentile ? 'Rank' : 'Percentile'}
                </button>
              </div>
              <input
                type="number"
                step={profile.isPercentile ? '0.1' : '1'}
                min="1"
                max={profile.isPercentile ? '100' : '500000'}
                value={profile.scoreOrRank}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, scoreOrRank: parseFloat(e.target.value) || 0 }))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reservation Category</label>
              <select
                value={profile.category}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, category: e.target.value as CategoryQuota }))
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              >
                <option value="General">General / Open (Unreserved)</option>
                <option value="OBC-NCL">OBC-NCL (Non-Creamy Layer)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>

            {/* Home State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Home State (Domicile Quota)</label>
              <select
                value={profile.homeState}
                onChange={(e) => setProfile((prev) => ({ ...prev, homeState: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Maximum Total Budget */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Total Budget Cap</label>
                <span className="text-xs text-slate-500 font-medium">₹{profile.maxTotalBudgetLakhs} Lakhs</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={profile.maxTotalBudgetLakhs}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    maxTotalBudgetLakhs: parseInt(e.target.value, 10)
                  }))
                }
                className="w-full accent-slate-900"
              />
            </div>

            {/* Primary Preference / Priority */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Top Decision Priority</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'roi', label: 'Maximum ROI' },
                  { id: 'placement', label: 'Highest Salary CTC' },
                  { id: 'nirf', label: 'NIRF / Brand Rank' },
                  { id: 'low-fee', label: 'Low Subsidized Fee' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProfile((prev) => ({ ...prev, priority: p.id as any }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      profile.priority === p.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Calculate My Best Matches</span>
              </button>
            </div>
          </form>

          {/* Results Display */}
          {hasCalculated ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Recommended Institutes for Your Profile
                </h3>
                <span className="text-xs text-slate-500">
                  {results.length} Institutes Analyzed
                </span>
              </div>

              {/* Target / Realistic Matches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Target / High Probability Institutes</h4>
                    <p className="text-[11px] text-slate-500">Realistic admissions probability with strong cut-off alignment.</p>
                  </div>
                </div>

                {targetMatches.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-50">No exact target matches found for current exam filter. Try adjusting your rank or exam.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {targetMatches.map((rec) => renderRecommendationCard(rec, comparedColleges, onOpenDetails, onToggleCompare))}
                  </div>
                )}
              </div>

              {/* Dream / Reach Matches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    🌟
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Dream / Reach Institutes</h4>
                    <p className="text-[11px] text-slate-500">Aspirational top-tier institutes. Achievable with top percentile or subsequent counseling rounds.</p>
                  </div>
                </div>

                {dreamMatches.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-50">No dream matches found for this specific filter set.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dreamMatches.map((rec) => renderRecommendationCard(rec, comparedColleges, onOpenDetails, onToggleCompare))}
                  </div>
                )}
              </div>

              {/* Safe Matches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Safe / High-Confidence Backup Institutes</h4>
                    <p className="text-[11px] text-slate-500">Exceptional confidence of admission; strong cushion choices.</p>
                  </div>
                </div>

                {safeMatches.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-50">No safe matches found.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {safeMatches.map((rec) => renderRecommendationCard(rec, comparedColleges, onOpenDetails, onToggleCompare))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">Enter your scores above to reveal personalized matches</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Our algorithm computes state domicile quotas, reservation categories, and total course budget to identify exactly which colleges you should apply to.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function renderRecommendationCard(
  rec: FitRecommendation,
  comparedColleges: College[],
  onOpenDetails: (col: College) => void,
  onToggleCompare: (col: College) => void
) {
  const isCompared = comparedColleges.some((c) => c.id === rec.college.id);

  return (
    <div
      key={rec.college.id}
      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
    >
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-amber-900">
            NIRF #{rec.college.nirfStreamRank} · {rec.college.city}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {rec.fitScore}% Fit
            </span>
          </div>
        </div>

        <h5
          onClick={() => onOpenDetails(rec.college)}
          className="font-bold text-slate-900 text-sm hover:text-amber-800 cursor-pointer transition-colors"
        >
          {rec.college.name}
        </h5>

        <div className="grid grid-cols-2 gap-2 my-2.5 p-2 rounded bg-slate-50 text-[11px]">
          <div>
            <span className="text-slate-500 block">Total Fees:</span>
            <span className="font-bold text-slate-900">₹{rec.college.totalCourseFeeLakhs}L</span>
          </div>
          <div>
            <span className="text-slate-500 block">Avg Package:</span>
            <span className="font-bold text-emerald-700">₹{rec.college.avgPlacementCTCLPA} LPA</span>
          </div>
        </div>

        <ul className="space-y-1 mb-3">
          {rec.reasoning.map((r, idx) => (
            <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1 leading-tight">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <button
          onClick={() => onToggleCompare(rec.college)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            isCompared
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isCompared ? 'In Compare' : 'Compare'}</span>
        </button>

        <button
          onClick={() => onOpenDetails(rec.college)}
          className="text-xs font-semibold text-slate-900 hover:text-amber-800 flex items-center gap-0.5"
        >
          <span>Deep Dive</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
