import React, { useState } from 'react';
import { X, ExternalLink, Scale, Bookmark, Sparkles, Building2, MapPin, IndianRupee, TrendingUp, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { College } from '../types';

interface CollegeDetailModalProps {
  college: College | null;
  onClose: () => void;
  isCompared: boolean;
  isShortlisted: boolean;
  onToggleCompare: (college: College) => void;
  onToggleShortlist: (college: College) => void;
  onAskCounselorAbout: (college: College) => void;
}

export const CollegeDetailModal: React.FC<CollegeDetailModalProps> = ({
  college,
  onClose,
  isCompared,
  isShortlisted,
  onToggleCompare,
  onToggleShortlist,
  onAskCounselorAbout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'placements' | 'fees' | 'cutoffs' | 'analysis'>('overview');

  if (!college) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
              <span className="font-semibold text-amber-900">
                NIRF Rank #{college.nirfStreamRank} ({college.stream})
              </span>
              <span aria-hidden="true">·</span>
              <span>{college.type}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {college.city}, {college.state} ({college.zone} India)
              </span>
              <span aria-hidden="true">·</span>
              <span>Est. {college.establishedYear}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {college.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Nav Tabs */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-white overflow-x-auto scrollbar-none text-xs sm:text-sm font-medium">
          {[
            { id: 'overview', label: 'Overview & Ranking' },
            { id: 'placements', label: 'Placements & Recruiters' },
            { id: 'fees', label: 'Fees & ROI' },
            { id: 'cutoffs', label: 'Admissions & Cutoffs' },
            { id: 'analysis', label: 'Pros & Considerations' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-slate-800 text-sm space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric summary boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">NIRF Overall Score</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {college.nirfScore} / 100
                  </div>
                  <div className="text-[11px] text-slate-400">Govt of India Verified</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Campus Area</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {college.campusSizeAcres} Acres
                  </div>
                  <div className="text-[11px] text-slate-400">Faculty Ratio: {college.facultyRatio}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Accreditation</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">
                    {college.naacGrade}
                  </div>
                  <div className="text-[11px] text-slate-400">Autonomous Tier-1</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Hostel Housing</div>
                  <div className="text-sm font-bold text-slate-900 mt-1 truncate">
                    {college.hostelAvailability}
                  </div>
                  <div className="text-[11px] text-slate-400">₹{college.hostelFeePerYearLakhs}L / yr</div>
                </div>
              </div>

              {/* NIRF 5 Parameter Breakdown if present */}
              {college.nirfBreakdown && (
                <div className="p-4 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    NIRF Parameter Metric Breakdown
                  </h4>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Teaching, Learning & Resources (TLR)</span>
                        <span className="font-bold text-slate-900">{college.nirfBreakdown.tlr} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${college.nirfBreakdown.tlr}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Research & Professional Practice (RPC)</span>
                        <span className="font-bold text-slate-900">{college.nirfBreakdown.rpc} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: `${college.nirfBreakdown.rpc}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Graduation Outcomes (GO)</span>
                        <span className="font-bold text-slate-900">{college.nirfBreakdown.go} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${college.nirfBreakdown.go}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Outreach & Inclusivity (OI)</span>
                        <span className="font-bold text-slate-900">{college.nirfBreakdown.oi} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: `${college.nirfBreakdown.oi}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">Peer & Academic Perception (PR)</span>
                        <span className="font-bold text-slate-900">{college.nirfBreakdown.pr} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${college.nirfBreakdown.pr}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Highlights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Institutional Highlights
                </h4>
                <ul className="space-y-2">
                  {college.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Alumni network */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                <span className="font-bold text-amber-950 block mb-0.5">Notable Alumni & Legacy:</span>
                <p className="text-amber-900 leading-relaxed">{college.alumniNetwork}</p>
              </div>
            </div>
          )}

          {activeTab === 'placements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Average CTC Package</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">₹{college.avgPlacementCTCLPA} LPA</div>
                  <div className="text-xs text-slate-500 mt-0.5">Top-tier corporate hiring</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Median Salary</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">₹{college.medianPlacementCTCLPA} LPA</div>
                  <div className="text-xs text-slate-500 mt-0.5">50th percentile of graduating class</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Placement Success Rate</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{college.placementPercentage}%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Highest Package: ₹{college.highestPlacementCTCLPA} LPA</div>
                </div>
              </div>

              {/* Top Recruiters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Leading Visiting Recruiters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {college.topRecruiters.map((recruiter, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      {recruiter}
                    </span>
                  ))}
                </div>
              </div>

              {/* Popular Branches */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  High-Demand Programs & Branches
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {college.popularBranches.map((branch, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      <span className="font-medium text-slate-800">{branch}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Annual Tuition Fee</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">₹{college.annualTuitionFeeLakhs} Lakhs</div>
                  <div className="text-xs text-slate-500 mt-0.5">Per academic year</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Total Course Fee</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">₹{college.totalCourseFeeLakhs} Lakhs</div>
                  <div className="text-xs text-slate-500 mt-0.5">Degree tuition combined</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-500">Payback Breakeven</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    {college.roiPaybackMonths < 1
                      ? `${Math.round(college.roiPaybackMonths * 30)} days`
                      : `${college.roiPaybackMonths} months`}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Calculated against avg CTC</div>
                </div>
              </div>

              {/* Payback breakdown explanation */}
              <div className="p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">ROI Calculation Methodology:</div>
                <p className="text-slate-600 leading-relaxed">
                  ROI Payback period indicates how many months of gross post-graduation salary are required to recover the complete tuition fees of ₹{college.totalCourseFeeLakhs} Lakhs. With an average starting package of ₹{college.avgPlacementCTCLPA} LPA (₹{(college.avgPlacementCTCLPA / 12).toFixed(2)} Lakhs/month), an alumnus reaches full breakeven in approximately {college.roiPaybackMonths} months.
                </p>
                <div className="pt-2 text-slate-500">
                  Hostel & Mess Charges: Approx ₹{college.hostelFeePerYearLakhs} Lakhs per year.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cutoffs' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Accepted Entrance Examinations
                </h4>
                <div className="text-base font-bold text-slate-900">
                  {college.acceptedExams.join(', ')}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Cutoff Benchmarks & Percentile Thresholds
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm mb-3">
                  {college.typicalCutoffSummary}
                </p>

                {college.homeStateQuotaAvailable && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-amber-50 text-amber-900 border border-amber-200/60">
                      <span className="font-bold block">Home State Quota ({college.state}):</span>
                      <span>{college.homeStateCutoffPercentileOrRank || 'Available (50-85% quota)'}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      <span className="font-bold block">Other State / All-India:</span>
                      <span>{college.otherStateCutoffPercentileOrRank || 'Strict All India Rank threshold'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Pros */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Key Advantages & Strengths
                </h4>
                <ul className="space-y-2">
                  {college.pros.map((pro, idx) => (
                    <li key={idx} className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-950 text-xs sm:text-sm">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Considerations / Cons */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Factors to Consider Before Applying
                </h4>
                <ul className="space-y-2">
                  {college.cons.map((con, idx) => (
                    <li key={idx} className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-950 text-xs sm:text-sm">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(college)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isCompared ? 'In Comparison' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={() => onToggleShortlist(college)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors ${
                isShortlisted
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskCounselorAbout(college)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Consult AI Counselor</span>
            </button>

            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
