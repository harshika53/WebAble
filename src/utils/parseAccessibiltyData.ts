// Transforms raw axe-core + Lighthouse API response into
// structured category scores and suggestions

export interface CategoryScore {
  category: string;
  score: number;
  passed: number;
  failed: number;
  icon: string;
}

export interface Suggestion {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
}

// axe-core tags that map to display categories
const CATEGORY_MAP: Record<string, { label: string; icon: string }> = {
  'color-contrast':   { label: 'Contrast',   icon: '🎨' },
  'aria':             { label: 'ARIA',        icon: '♿' },
  'forms':            { label: 'Forms',       icon: '📝' },
  'keyboard':         { label: 'Keyboard',    icon: '⌨️'  },
  'images':           { label: 'Images',      icon: '🖼️'  },
  'navigation':       { label: 'Navigation',  icon: '🧭' },
  'language':         { label: 'Language',    icon: '🌐' },
  'structure':        { label: 'Structure',   icon: '🏗️'  },
};

export function parseAccessibilityData(axeResults: any): {
  categories: CategoryScore[];
  suggestions: Suggestion[];
} {
  const violations: any[] = axeResults?.violations ?? [];
  const passes: any[]     = axeResults?.passes ?? [];

  // Build a count map per category
  const categoryStats: Record<string, { passed: number; failed: number }> = {};

  for (const [key] of Object.entries(CATEGORY_MAP)) {
    categoryStats[key] = { passed: 0, failed: 0 };
  }

  passes.forEach((rule: any) => {
    rule.tags?.forEach((tag: string) => {
      if (categoryStats[tag]) categoryStats[tag].passed++;
    });
  });

  violations.forEach((rule: any) => {
    rule.tags?.forEach((tag: string) => {
      if (categoryStats[tag]) categoryStats[tag].failed++;
    });
  });

  const categories: CategoryScore[] = Object.entries(CATEGORY_MAP).map(
    ([key, { label, icon }]) => {
      const { passed, failed } = categoryStats[key];
      const total = passed + failed;
      const score = total === 0 ? 100 : Math.round((passed / total) * 100);
      return { category: label, score, passed, failed, icon };
    }
  ).filter(c => c.passed + c.failed > 0);  // hide empty categories

  const suggestions: Suggestion[] = violations.map((v: any) => ({
    id:          v.id,
    impact:      v.impact,
    description: v.description,
    help:        v.help,
    helpUrl:     v.helpUrl,
    nodes:       v.nodes?.length ?? 0,
  })).sort((a, b) => {
    const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
    return order[a.impact] - order[b.impact];
  });

  return { categories, suggestions };
}