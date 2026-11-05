import React, { useState } from 'react';
import { X, IndianRupee, TrendingUp, Calculator, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { College } from '../types';

interface RoiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  allColleges: College[];
  selectedCollege?: College;
}

export const RoiCalculatorModal: React.FC<RoiCalculatorModalProps> = ({
  isOpen,
  onClose,
  allColleges,
  selectedCollege
}) => {
  const [collegeA, setCollegeA] = useState<College>(
    selectedCollege || allColleges.find((c) => c.id === 'nit-trichy') || allColleges[0]
  );
  const [collegeB, setCollegeB] = useState<College>(
    allColleges.find((c) => c.id === 'bits-pilani') || allColleges[1]
  );

  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.5); // % per year
  const [monthlyLivingCost, setMonthlyLivingCost] = useState<number>(30000); // INR per month after graduation
  const [annualIncrement, setAnnualIncrement] = useState<number>(10); // % yearly hike

  if (!isOpen) return null;

  const calculateMetrics = (college: College) => {
    const totalFees = college.totalCourseFeeLakhs * 100000;
    const avgSalaryAnnual = college.avgPlacementCTCLPA * 100000;
    // Estimated gross monthly salary
    const grossMonthly = avgSalaryAnnual / 12;
    // Estimated net take-home (~82% after tax/PF)
    const netMonthly = grossMonthly * 0.82;
    // Net monthly savings after basic post-grad living expenses
    const monthlySavings = Math.max(5000, netMonthly - monthlyLivingCost);

    // Breakeven months to recover total fees
    const breakevenMonths = Math.ceil(totalFees / monthlySavings);

    // Cumulative 5-year post-graduation net savings
    let cumulative5YearSavings = 0;
    let currentSalary = avgSalaryAnnual;
    for (let year = 1; year <= 5; year++) {
      const yearNetMonthly = (currentSalary / 12) * 0.82;
      const yearSavings = Math.max(0, (yearNetMonthly - monthlyLivingCost) * 12);
      cumulative5YearSavings += yearSavings;
      currentSalary *= 1 + annualIncrement / 100;
    }

    const net5YearWealth = cumulative5YearSavings - totalFees;
    const roiMultiple = ((cumulative5YearSavings) / totalFees).toFixed(1);

    return {
      totalFees,
      grossMonthly,
      netMonthly,
      monthlySavings,
      breakevenMonths,
      net5YearWealth,
      roiMultiple
    };
  };

  const metricsA = calculateMetrics(collegeA);
  const metricsB = calculateMetrics(collegeB);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold mb-1 border border-emerald-200/60">
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Investment vs. Salary Payback Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Return on Investment (ROI) & Wealth Visualizer
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Compare actual payback duration and 5-year wealth accumulation between colleges.
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
          {/* Controls Bar: Select College A and College B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select College A</label>
              <select
                value={collegeA.id}
                onChange={(e) => {
                  const found = allColleges.find((c) => c.id === e.target.value);
                  if (found) setCollegeA(found);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              >
                {allColleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stream}) - Total: ₹{c.totalCourseFeeLakhs}L
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select College B (Benchmark)</label>
              <select
                value={collegeB.id}
                onChange={(e) => {
                  const found = allColleges.find((c) => c.id === e.target.value);
                  if (found) setCollegeB(found);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-slate-900"
              >
                {allColleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stream}) - Total: ₹{c.totalCourseFeeLakhs}L
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sliders for Simulation Assumptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Estimated Post-Grad Monthly Living Cost</span>
                <span className="font-bold text-slate-900">₹{monthlyLivingCost.toLocaleString('en-IN')}/mo</span>
              </div>
              <input
                type="range"
                min="15000"
                max="60000"
                step="5000"
                value={monthlyLivingCost}
                onChange={(e) => setMonthlyLivingCost(parseInt(e.target.value, 10))}
                className="w-full accent-slate-900"
              />
              <span className="text-[10px] text-slate-400">Rent, groceries, utilities in metro city</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-700">Expected Annual Salary Growth Hike</span>
                <span className="font-bold text-slate-900">{annualIncrement}% per year</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={annualIncrement}
                onChange={(e) => setAnnualIncrement(parseInt(e.target.value, 10))}
                className="w-full accent-slate-900"
              />
              <span className="text-[10px] text-slate-400">Industry appraisal benchmark (tech/consulting ~10-15%)</span>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* College A Card */}
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-xs">
              <div className="text-xs font-semibold text-slate-500 mb-1">College A</div>
              <h3 className="font-bold text-base text-slate-900 mb-3">{collegeA.name}</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Tuition Investment:</span>
                  <span className="font-bold text-slate-900">₹{collegeA.totalCourseFeeLakhs} Lakhs</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Average Starting CTC:</span>
                  <span className="font-bold text-emerald-700">₹{collegeA.avgPlacementCTCLPA} LPA</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Est. Net Monthly Take-Home:</span>
                  <span className="font-semibold text-slate-800">
                    ₹{Math.round(metricsA.netMonthly).toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <div className="text-[11px] text-amber-800 font-semibold">Total Breakeven Duration:</div>
                  <div className="text-2xl font-black text-amber-950 mt-0.5">
                    {metricsA.breakevenMonths} Months
                  </div>
                  <div className="text-[10px] text-amber-700 mt-0.5">
                    {metricsA.breakevenMonths < 12
                      ? '🚀 Recovers tuition in less than 1 year!'
                      : `Takes ~${(metricsA.breakevenMonths / 12).toFixed(1)} years to recover degree cost`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="text-[11px] text-emerald-800 font-semibold">5-Year Cumulative Net Wealth:</div>
                  <div className="text-xl font-black text-emerald-950 mt-0.5">
                    ₹{(metricsA.net5YearWealth / 100000).toFixed(1)} Lakhs
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">
                    Net savings after full tuition recovery and living expenses
                  </div>
                </div>
              </div>
            </div>

            {/* College B Card */}
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-xs">
              <div className="text-xs font-semibold text-slate-500 mb-1">College B (Benchmark)</div>
              <h3 className="font-bold text-base text-slate-900 mb-3">{collegeB.name}</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Tuition Investment:</span>
                  <span className="font-bold text-slate-900">₹{collegeB.totalCourseFeeLakhs} Lakhs</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Average Starting CTC:</span>
                  <span className="font-bold text-emerald-700">₹{collegeB.avgPlacementCTCLPA} LPA</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Est. Net Monthly Take-Home:</span>
                  <span className="font-semibold text-slate-800">
                    ₹{Math.round(metricsB.netMonthly).toLocaleString('en-IN')}/mo
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <div className="text-[11px] text-amber-800 font-semibold">Total Breakeven Duration:</div>
                  <div className="text-2xl font-black text-amber-950 mt-0.5">
                    {metricsB.breakevenMonths} Months
                  </div>
                  <div className="text-[10px] text-amber-700 mt-0.5">
                    {metricsB.breakevenMonths < 12
                      ? '🚀 Recovers tuition in less than 1 year!'
                      : `Takes ~${(metricsB.breakevenMonths / 12).toFixed(1)} years to recover degree cost`}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
                  <div className="text-[11px] text-emerald-800 font-semibold">5-Year Cumulative Net Wealth:</div>
                  <div className="text-xl font-black text-emerald-950 mt-0.5">
                    ₹{(metricsB.net5YearWealth / 100000).toFixed(1)} Lakhs
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">
                    Net savings after full tuition recovery and living expenses
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Verdict Insight */}
          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Financial Decision Verdict</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {metricsA.breakevenMonths < metricsB.breakevenMonths
                ? `${collegeA.name} provides a faster breakeven by ${metricsB.breakevenMonths - metricsA.breakevenMonths} months due to lower upfront tuition fees.`
                : `${collegeB.name} provides a faster breakeven by ${metricsA.breakevenMonths - metricsB.breakevenMonths} months.`}{' '}
              Over a 5-year career horizon,{' '}
              {metricsA.net5YearWealth >= metricsB.net5YearWealth
                ? `${collegeA.name} yields an estimated ₹${((metricsA.net5YearWealth - metricsB.net5YearWealth) / 100000).toFixed(1)} Lakhs more in net accumulated savings.`
                : `${collegeB.name} yields an estimated ₹${((metricsB.net5YearWealth - metricsA.net5YearWealth) / 100000).toFixed(1)} Lakhs more in net accumulated savings.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
