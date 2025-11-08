import React from 'react';
import type { DefinitiveSource } from '../types';

interface SourceLandscapeProps {
  sources: DefinitiveSource[];
}

const mapBiasToX = (bias: string): number => {
  const b = bias.toLowerCase();
  if (b.includes('left')) return 10;
  if (b.includes('right')) return 90;
  if (b.includes('neutral')) return 50;
  return 50; // Default for 'Corporate', 'Scientific', etc.
};

const mapToneToY = (tone: string): number => {
  const t = tone.toLowerCase();
  if (t.includes('objective')) return 90;
  if (t.includes('opinionated')) return 10;
  if (t.includes('promotional')) return 30;
  if (t.includes('satirical')) return 50;
  return 60; // Default for others
};

const getSourceColor = (bias: string): string => {
    const b = bias.toLowerCase();
    if (b.includes('left')) return 'fill-blue-400';
    if (b.includes('right')) return 'fill-red-400';
    if (b.includes('neutral')) return 'fill-slate-400';
    return 'fill-purple-400';
}

const SourceLandscape: React.FC<SourceLandscapeProps> = ({ sources }) => {
  const chartWidth = 500;
  const chartHeight = 250;
  const padding = 40;

  const plottedPoints = new Map<string, number>();

  const pointsData = sources.map((source) => {
    const baseX = mapBiasToX(source.analysis.bias);
    const baseY = mapToneToY(source.analysis.tone);
    const key = `${baseX},${baseY}`;

    const count = plottedPoints.get(key) || 0;
    plottedPoints.set(key, count + 1);

    // Apply a circular offset ("jitter") if this coordinate is already used
    const angle = count * (Math.PI / 3); // Stagger points at 60-degree intervals
    const radius = count > 0 ? 8 : 0; // No jitter for the first point at a location

    const jitterX = Math.cos(angle) * radius;
    const jitterY = Math.sin(angle) * radius;
    
    const cx = ((baseX / 100) * (chartWidth - 2 * padding)) + padding + jitterX;
    // Subtract jitterY because SVG y-coordinates increase downwards
    const cy = chartHeight - (((baseY / 100) * (chartHeight - 2 * padding)) + padding) - jitterY;

    return { cx, cy, source };
  });


  return (
    <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 mt-4">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Guideline Grid */}
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#475569" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#475569" strokeWidth="1" />

        {/* Axis Labels */}
        <text x={chartWidth / 2} y={chartHeight - 5} textAnchor="middle" className="text-xs fill-slate-400 font-semibold">Bias</text>
        <text x={chartWidth / 2} y={chartHeight - 18} textAnchor="middle" className="text-xs fill-slate-500">(Left-Leaning → Right-Leaning)</text>
        
        <text x="15" y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90 15,${chartHeight/2})`} className="text-xs fill-slate-400 font-semibold">Tone</text>
        <text x="28" y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90 28,${chartHeight/2})`} className="text-xs fill-slate-500">(Opinionated → Objective)</text>
        

        {/* Data Points */}
        {pointsData.map(({ cx, cy, source }, index) => {
          return (
            <g key={index} className="cursor-pointer group">
              <circle
                cx={cx}
                cy={cy}
                r="8"
                className={`${getSourceColor(source.analysis.bias)} opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                <title>{source.title}\nBias: {source.analysis.bias}\nTone: {source.analysis.tone}</title>
              </circle>
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dy=".3em"
                className="text-xs font-bold fill-white pointer-events-none"
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">Sources Legend:</h4>
        <ol className="list-inside space-y-2 text-sm">
          {sources.map((source, index) => (
            <li key={index} className="flex items-start">
              <span className="font-semibold mr-2">{index + 1}.</span>
              <a 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline"
                title={source.uri}
              >
                {source.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default SourceLandscape;