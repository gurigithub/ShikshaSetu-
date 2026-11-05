import { College, FitRecommendation, UserEligibilityProfile } from '../types';
import { COLLEGES_DATA } from '../data/colleges';

export function calculateCollegeFit(
  profile: UserEligibilityProfile,
  allColleges: College[] = COLLEGES_DATA
): FitRecommendation[] {
  // Filter by stream matching
  const matchingColleges = allColleges.filter((c) => {
    if (profile.stream === 'Engineering') {
      return c.stream === 'Engineering';
    }
    if (profile.stream === 'Management') {
      return c.stream === 'Management';
    }
    if (profile.stream === 'Medical') {
      return c.stream === 'Medical';
    }
    if (profile.stream === 'Law') {
      return c.stream === 'Law';
    }
    if (profile.stream === 'Sciences' || profile.stream === 'University') {
      return c.stream === 'University' || c.stream === 'Sciences';
    }
    return true;
  });

  const recommendations: FitRecommendation[] = [];

  for (const college of matchingColleges) {
    const reasoning: string[] = [];
    let probabilityScore = 50; // default baseline

    // 1. Exam Compatibility Check
    const acceptsExam = college.acceptedExams.some(
      (e) =>
        e.toLowerCase().includes(profile.exam.toLowerCase()) ||
        profile.exam.toLowerCase().includes(e.toLowerCase())
    );

    if (!acceptsExam) {
      continue; // Skip institutes that don't take this exam
    }

    reasoning.push(`Accepts your target examination: ${profile.exam}`);

    // 2. Budget evaluation
    const isWithinBudget = college.totalCourseFeeLakhs <= profile.maxTotalBudgetLakhs;
    if (isWithinBudget) {
      probabilityScore += 15;
      reasoning.push(
        `Total course fee (₹${college.totalCourseFeeLakhs}L) is safely within your ₹${profile.maxTotalBudgetLakhs}L budget.`
      );
    } else {
      probabilityScore -= 20;
      reasoning.push(
        `Caution: Total fees (₹${college.totalCourseFeeLakhs}L) exceeds preferred ₹${profile.maxTotalBudgetLakhs}L cap (Education loan may be required).`
      );
    }

    // 3. Category Quota relaxation bonus
    let categoryMultiplier = 1.0;
    if (profile.category === 'OBC-NCL') {
      categoryMultiplier = 1.35;
      reasoning.push('OBC-NCL reservation quota grants relaxed cutoff criteria.');
    } else if (profile.category === 'EWS') {
      categoryMultiplier = 1.25;
      reasoning.push('10% EWS quota provides cutoff leverage.');
    } else if (profile.category === 'SC') {
      categoryMultiplier = 2.4;
      reasoning.push('SC quota relaxation substantially broadens rank cutoff.');
    } else if (profile.category === 'ST') {
      categoryMultiplier = 3.2;
      reasoning.push('ST category threshold provides maximum rank flexibility.');
    }

    // 4. Home State Quota advantage
    const isHomeState = college.state.toLowerCase() === profile.homeState.toLowerCase();
    if (isHomeState && college.homeStateQuotaAvailable) {
      probabilityScore += 20;
      reasoning.push(
        `🎉 50-85% Home State Quota advantage in ${college.state} significantly improves your closing rank probability!`
      );
    }

    // 5. Score / Rank evaluation heuristic
    let matchType: 'Dream' | 'Target' | 'Safe' = 'Target';

    if (profile.isPercentile) {
      // Input is Percentile (e.g., 99.4)
      const percentile = profile.scoreOrRank;
      const effectivePercentile = Math.min(100, percentile + (categoryMultiplier - 1) * 3);

      if (effectivePercentile >= 99.5) {
        if (college.nirfStreamRank <= 3) {
          matchType = 'Target';
          probabilityScore += 25;
        } else {
          matchType = 'Safe';
          probabilityScore += 35;
        }
      } else if (effectivePercentile >= 98.0) {
        if (college.nirfStreamRank <= 3) {
          matchType = 'Dream';
          probabilityScore += 10;
        } else if (college.nirfStreamRank <= 10) {
          matchType = 'Target';
          probabilityScore += 25;
        } else {
          matchType = 'Safe';
          probabilityScore += 30;
        }
      } else if (effectivePercentile >= 94.0) {
        if (college.nirfStreamRank <= 5) {
          matchType = 'Dream';
          probabilityScore -= 10;
        } else if (college.nirfStreamRank <= 20) {
          matchType = 'Target';
          probabilityScore += 15;
        } else {
          matchType = 'Safe';
          probabilityScore += 25;
        }
      } else {
        if (college.nirfStreamRank <= 15) {
          matchType = 'Dream';
          probabilityScore -= 20;
        } else {
          matchType = 'Target';
          probabilityScore += 10;
        }
      }
    } else {
      // Input is All India Rank (e.g., 1500)
      const rank = profile.scoreOrRank;
      const effectiveRank = rank / categoryMultiplier;

      if (effectiveRank <= 500) {
        if (college.nirfStreamRank <= 3) {
          matchType = 'Target';
          probabilityScore += 25;
        } else {
          matchType = 'Safe';
          probabilityScore += 35;
        }
      } else if (effectiveRank <= 2000) {
        if (college.nirfStreamRank <= 3) {
          matchType = 'Dream';
          probabilityScore += 10;
        } else if (college.nirfStreamRank <= 10) {
          matchType = 'Target';
          probabilityScore += 25;
        } else {
          matchType = 'Safe';
          probabilityScore += 30;
        }
      } else if (effectiveRank <= 8000) {
        if (college.nirfStreamRank <= 5) {
          matchType = 'Dream';
          probabilityScore -= 10;
        } else if (college.nirfStreamRank <= 25) {
          matchType = 'Target';
          probabilityScore += 15;
        } else {
          matchType = 'Safe';
          probabilityScore += 25;
        }
      } else {
        if (college.nirfStreamRank <= 15) {
          matchType = 'Dream';
          probabilityScore -= 25;
        } else {
          matchType = 'Target';
          probabilityScore += 10;
        }
      }
    }

    // 6. User Priority weighting
    if (profile.priority === 'roi') {
      if (college.roiPaybackMonths <= 6) {
        probabilityScore += 15;
        reasoning.push(`Ultra-high ROI match: Full tuition recovered in ~${college.roiPaybackMonths} months of employment.`);
      }
    } else if (profile.priority === 'placement') {
      if (college.avgPlacementCTCLPA >= 20) {
        probabilityScore += 15;
        reasoning.push(`Top placement match: Avg package of ₹${college.avgPlacementCTCLPA} LPA with Tier-1 recruiters.`);
      }
    } else if (profile.priority === 'nirf') {
      if (college.nirfStreamRank <= 10) {
        probabilityScore += 15;
        reasoning.push(`NIRF Top-10 Tier 1 institution status aligns with your brand priority.`);
      }
    } else if (profile.priority === 'low-fee') {
      if (college.annualTuitionFeeLakhs <= 1.0) {
        probabilityScore += 15;
        reasoning.push(`Highly affordable government-subsidized annual tuition fee: ₹${college.annualTuitionFeeLakhs}L.`);
      }
    }

    const clampedFitScore = Math.max(18, Math.min(99, Math.round(probabilityScore)));

    recommendations.push({
      college,
      matchType,
      fitScore: clampedFitScore,
      reasoning
    });
  }

  // Sort by fit score descending
  recommendations.sort((a, b) => b.fitScore - a.fitScore);
  return recommendations;
}
