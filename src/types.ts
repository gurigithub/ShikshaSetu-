export type Stream = 'Engineering' | 'Management' | 'Medical' | 'University' | 'Law' | 'Sciences';

export type InstituteType =
  | 'IIT'
  | 'NIT'
  | 'IIM'
  | 'AIIMS'
  | 'NLSIU'
  | 'Central University'
  | 'State Government'
  | 'Deemed / Premier Private'
  | 'Institute of Eminence';

export type Zone = 'North' | 'South' | 'East' | 'West' | 'Central';

export type CategoryQuota = 'General' | 'OBC-NCL' | 'EWS' | 'SC' | 'ST';

export interface NIRFBreakdown {
  tlr: number; // Teaching, Learning & Resources (out of 100)
  rpc: number; // Research and Professional Practice
  go: number;  // Graduation Outcomes
  oi: number;  // Outreach and Inclusivity
  pr: number;  // Perception
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  stream: Stream;
  type: InstituteType;
  city: string;
  state: string;
  zone: Zone;
  establishedYear: number;
  campusSizeAcres: number;
  nirfOverallRank?: number;
  nirfStreamRank: number;
  nirfScore: number;
  nirfBreakdown?: NIRFBreakdown;
  naacGrade: string;
  annualTuitionFeeLakhs: number; // in Lakhs INR
  totalCourseFeeLakhs: number; // in Lakhs INR
  hostelFeePerYearLakhs: number;
  avgPlacementCTCLPA: number; // in LPA
  medianPlacementCTCLPA: number;
  highestPlacementCTCLPA: number;
  placementPercentage: number;
  roiPaybackMonths: number; // Calculated: (totalCourseFeeLakhs / (avgPlacementCTCLPA / 12))
  acceptedExams: string[];
  popularBranches: string[];
  typicalCutoffSummary: string;
  homeStateQuotaAvailable: boolean;
  homeStateCutoffPercentileOrRank?: string;
  otherStateCutoffPercentileOrRank?: string;
  facultyRatio: string;
  hostelAvailability: string;
  topRecruiters: string[];
  keyHighlights: string[];
  pros: string[];
  cons: string[];
  website: string;
  alumniNetwork: string;
}

export interface FilterState {
  searchQuery: string;
  selectedStream: Stream | 'All';
  selectedTypes: InstituteType[];
  selectedZones: Zone[];
  selectedExams: string[];
  maxAnnualFee: number;
  minAvgCTC: number;
  maxNirfRank: number;
  sortBy: 'nirf' | 'placement' | 'fee-asc' | 'roi' | 'name';
}

export interface UserEligibilityProfile {
  stream: Stream;
  exam: string;
  scoreOrRank: number; // e.g. Rank 3200 or 98.4 percentile
  isPercentile: boolean;
  category: CategoryQuota;
  homeState: string;
  maxTotalBudgetLakhs: number;
  priority: 'roi' | 'placement' | 'nirf' | 'low-fee' | 'campus-life';
}

export interface FitRecommendation {
  college: College;
  matchType: 'Dream' | 'Target' | 'Safe';
  fitScore: number; // 0 - 100
  reasoning: string[];
}

export interface CounselorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  collegeContext?: string[];
}
