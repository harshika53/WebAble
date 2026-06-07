// Shows a prioritized list of improvement suggestions from axe violations

interface Suggestion {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;  // how many elements are affected
}

interface ImprovementSuggestionsProps {
  suggestions: Suggestion[];
}

const IMPACT_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  serious:  'bg-orange-100 text-orange-700 border-orange-200',
  moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  minor:    'bg-blue-100 text-blue-700 border-blue-200',
};

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-gray-700 mb-3">
      🔧 Improvement Suggestions
    </h3>
    {suggestions.length === 0 ? (
      <p className="text-green-600 text-sm">🎉 No issues found!</p>
    ) : (
      <ul className="space-y-3">
        {suggestions.map((s) => (
          <li
            key={s.id}
            className={`rounded-lg border p-3 text-sm ${IMPACT_COLORS[s.impact]}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold capitalize">{s.impact}</span>
              <span className="text-xs opacity-70">{s.nodes} element(s) affected</span>
            </div>
            <p className="font-medium">{s.help}</p>
            <p className="text-xs mt-1 opacity-80">{s.description}</p>
            
              href={s.helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline mt-1 inline-block"
            >
              Learn more →
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
);