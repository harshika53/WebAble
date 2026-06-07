// Displays a single category (e.g. Contrast, ARIA, Forms) as a card
// with a score bar, label, and pass/fail count

interface CategoryScoreCardProps {
  category: string;
  score: number;       // 0–100
  passed: number;
  failed: number;
  icon: string;        // emoji or icon name
}

export const CategoryScoreCard = ({
  category, score, passed, failed, icon,
}: CategoryScoreCardProps) => {
  const color =
    score >= 90 ? 'bg-green-500' :
    score >= 50 ? 'bg-yellow-400' : 'bg-red-500';

  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{icon} {category}</span>
        <span className="text-lg font-bold text-gray-900">{score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <div className="flex gap-3 text-xs text-gray-500">
        <span className="text-green-600">✓ {passed} passed</span>
        <span className="text-red-500">✗ {failed} failed</span>
      </div>
    </div>
  );
};