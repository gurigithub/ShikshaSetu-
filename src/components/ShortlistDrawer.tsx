import React, { useState } from 'react';
import { X, Bookmark, Scale, Trash2, ArrowRight, ExternalLink, Edit3, Check } from 'lucide-react';
import { College } from '../types';

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlistedColleges: College[];
  onRemoveShortlist: (id: string) => void;
  onLoadIntoCompare: (colleges: College[]) => void;
  onOpenDetails: (college: College) => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlistedColleges,
  onRemoveShortlist,
  onLoadIntoCompare,
  onOpenDetails
}) => {
  const [notes, setNotes] = useState<{ [collegeId: string]: string }>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Saved Shortlist</h3>
              <p className="text-xs text-slate-300">
                {shortlistedColleges.length} Institutes Bookmarked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {shortlistedColleges.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700 text-sm">No Colleges Shortlisted Yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any college card to save it here for quick tracking, comparison, and application note-taking.
              </p>
            </div>
          ) : (
            shortlistedColleges.map((college) => {
              const currentNote = notes[college.id] || '';
              const isEditing = editingId === college.id;

              return (
                <div
                  key={college.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors text-xs"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="font-semibold text-amber-800">
                      NIRF #{college.nirfStreamRank} · {college.stream}
                    </span>
                    <button
                      onClick={() => onRemoveShortlist(college.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => onOpenDetails(college)}
                    className="font-bold text-slate-900 text-sm hover:text-amber-800 cursor-pointer transition-colors"
                  >
                    {college.name}
                  </h4>

                  <div className="text-slate-500 my-1">
                    {college.city}, {college.state} · Total Fee: ₹{college.totalCourseFeeLakhs}L · Avg CTC: ₹{college.avgPlacementCTCLPA} LPA
                  </div>

                  {/* Personal Note */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <input
                          type="text"
                          value={currentNote}
                          placeholder="Add personal note (e.g., choice order, deadlines)..."
                          onChange={(e) =>
                            setNotes((prev) => ({ ...prev, [college.id]: e.target.value }))
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save Note</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="italic text-[11px]">
                          {currentNote ? `Note: "${currentNote}"` : 'No personal note added'}
                        </span>
                        <button
                          onClick={() => setEditingId(college.id)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title="Edit note"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {shortlistedColleges.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <button
              onClick={() => {
                onLoadIntoCompare(shortlistedColleges.slice(0, 4));
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Compare All Shortlisted (Up to 4)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
