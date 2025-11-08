import React from 'react';

interface TruthMeterProps {
  score: number;
}

const TruthMeter: React.FC<TruthMeterProps> = ({ score }) => {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  // Map score (0-100) to angle (-90 to 90 degrees)
  const angle = (clampedScore / 100) * 180 - 90;

  const getMeterColor = (score: number) => {
    if (score < 25) return 'text-red-500';
    if (score < 75) return 'text-yellow-400';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 10 40 A 30 30 0 0 1 90 40"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          
          {/* Needle */}
          <g transform={`translate(50, 40) rotate(${angle})`}>
             <polygon points="0,0 -3,-20 3,-20" fill="currentColor" className="text-slate-200" />
             <circle cx="0" cy="0" r="4" fill="currentColor" className="text-slate-200" />
          </g>
        </svg>
        
        <div className={`absolute bottom-0 w-full text-center ${getMeterColor(clampedScore)}`}>
            <span className="text-4xl font-bold">{clampedScore}</span>
            <span className="text-lg font-medium">%</span>
            <p className="text-sm font-semibold uppercase tracking-wider">Confidence</p>
        </div>
      </div>
    </div>
  );
};

export default TruthMeter;
