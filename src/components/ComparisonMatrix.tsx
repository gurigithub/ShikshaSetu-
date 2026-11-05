import React, { useState } from 'react';
import { X, Plus, Scale, Sparkles, Check, ArrowRight, IndianRupee, TrendingUp, Award, Clock, Share2, Copy, CheckCheck } from 'lucide-react';
import { College } from '../types';

interface ComparisonMatrixProps {
  comparedColleges: College[];
  allColleges: College[];
  onRemoveCollege: (id: string) => void;
  onAddCollege: (college: College) => void;
  onClearAll: () => void;
  onAskCounselorComparison: (colleges: College[]) => void;
  onClose?: () => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  comparedColleges,
  allColleges,
  onRemoveCollege,
  onAddCollege,
  onClearAll,
  onAskCounselorComparison,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Helper to determine lowest fee winner
  const lowestFee = Math.min(...comparedColleges.map((c) => c.totalCourseFeeLakhs));
  // Helper to determine highest placement winner
  const highestAvgCTC = Math.max(...comparedColleges.map((c) => c.avgPlacementCTCLPA));
  // Helper to determine best NIRF rank
  const bestNirf = Math.min(...comparedColleges.map((c) => c.nirfStreamRank));
  // Helper to determine fastest payback
  const fastestPayback = Math.min(...comparedColleges.map((c) => c.roiPaybackMonths));

  const handleCopySummary = () => {
    const summary = comparedColleges
      .map(
        (c) =>
          `• ${c.name} (${c.stream}): NIRF #${c.nirfStreamRank} | Tuition: ₹${c.annualTuitionFeeLakhs}L/yr (Total ₹${c.totalCourseFeeLakhs}L) | Avg CTC: ₹${c.avgPlacementCTCLPA} LPA | ROI Payback: ${c.roiPaybackMonths} mo`
      )
      .join('\n');

    navigator.clipboard.writeText(`ShikshaSetu Comparison Matrix:\n\n${summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const remainingColleges = allColleges.filter(
    (c) => !comparedColleges.some((comp) => comp.id === c.id)
  );

  if (comparedColleges.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-2xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Your Comparison Matrix is Empty</h3>
        <p className="text-sm text-slate-600 mb-6">
          Select between 2 and 4 colleges or universities from the directory to compare fees, NIRF rankings, placements, and cutoffs side-by-side.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
        >
          Browse Colleges Directory
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-7xl mx-auto my-6">
      {/* Top Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Side-by-Side Comparison Matrix
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
              {comparedColleges.length} of 4 Institutes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Green badges indicate leading statistical metrics across compared institutes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {comparedColleges.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setShowAddPicker(!showAddPicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add College ({4 - comparedColleges.length} spots left)</span>
              </button>

              {showAddPicker && (
                <div className="absolute right-0 mt-2 w-72 max-h-64 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 text-xs">
                  <div className="font-bold text-slate-700 px-2 py-1 border-b border-slate-100">
                    Select College to Add:
                  </div>
                  {remainingColleges.slice(0, 15).map((col) => (
                    <button
                      key={col.id}
                      onClick={() => {
                        onAddCollege(col);
                        setShowAddPicker(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 flex items-center justify-between transition-colors"
                    >
                      <span className="truncate font-medium text-slate-800">{col.name}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        #{col.nirfStreamRank}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => onAskCounselorComparison(comparedColleges)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Counselor Analysis</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={onClearAll}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="p-4 w-44 font-semibold text-slate-500 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Institute & Parameters
              </th>
              {comparedColleges.map((college) => (
                <th key={college.id} className="p-4 min-w-[220px] max-w-[280px] align-top relative">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                      #{college.nirfStreamRank} in {college.stream}
                    </span>
                    <button
                      onClick={() => onRemoveCollege(college.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight mb-1">
                    {college.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {college.city}, {college.state}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {/* Stream & Institute Type */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Stream & Classification
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5">
                  <div className="font-medium text-slate-900">{c.stream}</div>
                  <div className="text-xs text-slate-500">{c.type}</div>
                </td>
              ))}
            </tr>

            {/* NIRF Rank & Score */}
            <tr className="bg-slate-50/30">
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                NIRF Ranking & Score
              </td>
              {comparedColleges.map((c) => {
                const isBest = c.nirfStreamRank === bestNirf;
                return (
                  <td key={c.id} className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-base">
                        #{c.nirfStreamRank}
                      </span>
                      {isBest && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Highest Rank
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">Overall Score: {c.nirfScore}/100</div>
                  </td>
                );
              })}
            </tr>

            {/* Tuition Fees */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Tuition Fee (Annual & Total)
              </td>
              {comparedColleges.map((c) => {
                const isLowest = c.totalCourseFeeLakhs === lowestFee;
                return (
                  <td key={c.id} className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">
                        {c.annualTuitionFeeLakhs < 0.1
                          ? `₹${Math.round(c.annualTuitionFeeLakhs * 100000).toLocaleString('en-IN')}/yr`
                          : `₹${c.annualTuitionFeeLakhs}L / year`}
                      </span>
                      {isLowest && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Lowest Fee
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Total Course: ₹{c.totalCourseFeeLakhs} Lakhs
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Placement Package */}
            <tr className="bg-slate-50/30">
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Average Placement CTC
              </td>
              {comparedColleges.map((c) => {
                const isHighest = c.avgPlacementCTCLPA === highestAvgCTC;
                return (
                  <td key={c.id} className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-700 text-base">
                        ₹{c.avgPlacementCTCLPA} LPA
                      </span>
                      {isHighest && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Highest Package
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      Median: ₹{c.medianPlacementCTCLPA} LPA · High: ₹{c.highestPlacementCTCLPA} LPA
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* ROI Payback Period */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                ROI Payback Duration
              </td>
              {comparedColleges.map((c) => {
                const isFastest = c.roiPaybackMonths === fastestPayback;
                return (
                  <td key={c.id} className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-amber-900">
                        {c.roiPaybackMonths < 1
                          ? `${Math.round(c.roiPaybackMonths * 30)} days`
                          : `${c.roiPaybackMonths} months`}
                      </span>
                      {isFastest && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                          Fastest ROI
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">Time to recover total degree cost</div>
                  </td>
                );
              })}
            </tr>

            {/* Accepted Entrance Exams */}
            <tr className="bg-slate-50/30">
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Entrance Examinations
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5 font-medium text-slate-800">
                  {c.acceptedExams.join(', ')}
                </td>
              ))}
            </tr>

            {/* Cutoffs Guidance */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Typical Cutoff Threshold
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5 text-xs text-slate-600 leading-relaxed">
                  {c.typicalCutoffSummary}
                  {c.homeStateQuotaAvailable && (
                    <div className="text-[11px] font-semibold text-amber-800 mt-1">
                      Includes 50-85% Home State Quota
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Campus & Infrastructure */}
            <tr className="bg-slate-50/30">
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Campus & Housing
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5 text-xs">
                  <div className="font-medium text-slate-800">{c.campusSizeAcres} Acres</div>
                  <div className="text-slate-500">{c.hostelAvailability}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Faculty Ratio: {c.facultyRatio}</div>
                </td>
              ))}
            </tr>

            {/* Top Recruiters */}
            <tr>
              <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Top Recruiters
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5 text-xs">
                  <div className="text-slate-700 leading-relaxed">
                    {c.topRecruiters.slice(0, 4).join(', ')}
                  </div>
                </td>
              ))}
            </tr>

            {/* Pros */}
            <tr className="bg-emerald-50/20">
              <td className="p-3.5 font-semibold text-emerald-900 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Primary Strength
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5 text-xs text-emerald-950">
                  {c.pros[0]}
                </td>
              ))}
            </tr>

            {/* Considerations */}
            <tr className="bg-amber-50/20">
              <td className="p-3.5 font-semibold text-amber-900 bg-slate-50/60 sticky left-0 z-10 border-r border-slate-100">
                Key Consideration
              </td>
              {comparedColleges.map((c) => (
                <td key={c.id} className="p-3.5 text-xs text-amber-950">
                  {c.cons[0]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
