import React from 'react';
import { Bookmark, Scale, ArrowRight, Check, MapPin, IndianRupee, TrendingUp, Award, Clock } from 'lucide-react';
import { College } from '../types';

interface CollegeCardProps {
  college: College;
  isCompared: boolean;
  isShortlisted: boolean;
  onToggleCompare: (college: College) => void;
  onToggleShortlist: (college: College) => void;
  onOpenDetails: (college: College) => void;
  onOpenFitForCollege?: (college: College) => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({
  college,
  isCompared,
  isShortlisted,
  onToggleCompare,
  onToggleShortlist,
  onOpenDetails,
  onOpenFitForCollege
}) => {
  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between ${
        isCompared
          ? 'border-amber-500 shadow-md ring-1 ring-amber-500/50'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="p-5">
        {/* Header: Quiet Editorial Kicker with Unboxed Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-amber-800">
              #{college.nirfStreamRank} in {college.stream}
            </span>
            <span aria-hidden="true">·</span>
            <span>{college.type}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              {college.city}, {college.state}
            </span>
          </div>

          {/* Quick Bookmark Button */}
          <button
            onClick={() => onToggleShortlist(college)}
            aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
            className={`p-1.5 rounded-md transition-colors ${
              isShortlisted
                ? 'text-amber-600 bg-amber-50'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Primary Title */}
        <h3
          onClick={() => onOpenDetails(college)}
          className="text-lg font-bold text-slate-900 tracking-tight hover:text-amber-700 cursor-pointer transition-colors mb-1.5"
        >
          {college.name}
        </h3>

        {/* Short Highlights Line */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {college.keyHighlights[0]}
        </p>

        {/* High-Value Metric Triplets */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 mb-4 text-xs">
          {/* Tuition Fee */}
          <div>
            <div className="text-slate-500 font-medium text-[11px] flex items-center gap-0.5">
              <IndianRupee className="w-3 h-3 text-slate-400" />
              Annual Tuition
            </div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {college.annualTuitionFeeLakhs < 0.1
                ? `₹${Math.round(college.annualTuitionFeeLakhs * 100000).toLocaleString('en-IN')}`
                : `₹${college.annualTuitionFeeLakhs}L`}
            </div>
            <div className="text-[10px] text-slate-400">Total: ₹{college.totalCourseFeeLakhs}L</div>
          </div>

          {/* Average CTC */}
          <div>
            <div className="text-slate-500 font-medium text-[11px] flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              Avg Package
            </div>
            <div className="text-sm font-bold text-emerald-700 mt-0.5">
              ₹{college.avgPlacementCTCLPA} LPA
            </div>
            <div className="text-[10px] text-slate-400">
              Median: ₹{college.medianPlacementCTCLPA}L
            </div>
          </div>

          {/* ROI Payback */}
          <div>
            <div className="text-slate-500 font-medium text-[11px] flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-amber-600" />
              ROI Payback
            </div>
            <div className="text-sm font-bold text-amber-900 mt-0.5">
              {college.roiPaybackMonths < 1
                ? `${Math.round(college.roiPaybackMonths * 30)} days`
                : `${college.roiPaybackMonths} mo`}
            </div>
            <div className="text-[10px] text-slate-400">Investment return</div>
          </div>
        </div>

        {/* Admissions & Cutoffs Info */}
        <div className="text-xs text-slate-600 space-y-1 mb-4">
          <div className="flex items-start gap-1">
            <span className="font-semibold text-slate-700 shrink-0">Exams:</span>
            <span className="text-slate-600">{college.acceptedExams.join(', ')}</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="font-semibold text-slate-700 shrink-0">Cutoff:</span>
            <span className="text-slate-600 truncate">{college.typicalCutoffSummary}</span>
          </div>
        </div>
      </div>

      {/* Footer Card Controls */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 rounded-b-xl">
        {/* Toggle Compare Checkbox */}
        <button
          onClick={() => onToggleCompare(college)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            isCompared
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-slate-600" />
          <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
          {isCompared && <Check className="w-3.5 h-3.5 text-amber-700 ml-0.5" />}
        </button>

        {/* View Details Button */}
        <button
          onClick={() => onOpenDetails(college)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md text-slate-900 hover:text-amber-800 hover:bg-slate-100 transition-colors"
        >
          <span>Full Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
