export interface ScanResult {
  id: string;
  url: string;
  date: Date;
  score: number;
  metrics: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  issuesBySeverity: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  id: string;
  title: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriteria: string;
  affectedElements: string[];
  recommendation: string;
}