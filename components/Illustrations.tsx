import React from 'react';

export const AppIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 md:w-12 md:h-12">
    <defs>
      <linearGradient id="icon-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#22d3ee" /> 
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path d="M4 12.48L8.69 17.5L19.5 6.5" stroke="url(#icon-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 12.48L8.69 17.5L19.5 6.5" stroke="url(#icon-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.3" filter="url(#glow)"/>
    <defs>
        <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
  </svg>
);


export const EmptyStateIllustration: React.FC = () => (
    <div className="text-center animate-fade-in">
        <svg className="mx-auto h-40 w-40 text-slate-700" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="scan-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <clipPath id="doc-clip">
                    <path d="M30 20 H 90 V 100 H 30 Z" />
                </clipPath>
            </defs>
            {/* Document shape */}
            <path d="M30 20 H 80 L 90 30 V 100 H 30 Z" stroke="#475569" strokeWidth="2" fill="#1e293b" />
            <path d="M 80 20 V 30 H 90" stroke="#475569" strokeWidth="2" />
            
            {/* Document lines */}
            <line x1="40" y1="45" x2="80" y2="45" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="55" x2="75" y2="55" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="65" x2="80" y2="65" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="75" x2="65" y2="75" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

            {/* Scanning beam */}
            <rect x="30" y="0" width="60" height="100" fill="url(#scan-gradient)" clipPath="url(#doc-clip)">
                <animate attributeName="y" from="15" to="95" dur="3s" repeatCount="indefinite" />
            </rect>
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-slate-300">Ready to uncover the truth?</h3>
        <p className="mt-1 text-slate-500">Enter a claim or URL above to start your verification.</p>
    </div>
);

export const AgentWorkIllustration: React.FC = () => (
    <svg viewBox="0 0 200 100" className="w-full max-w-sm mx-auto mb-4" preserveAspectRatio="xMidYMid meet">
        <style>
            {`
            .node { animation: pulse 4s infinite ease-in-out; }
            .node-1 { animation-delay: 0s; }
            .node-2 { animation-delay: 1s; }
            .node-3 { animation-delay: 2s; }
            .node-4 { animation-delay: 3s; }
            @keyframes pulse {
                0%, 100% { fill-opacity: 0.6; r: 4; }
                50% { fill-opacity: 1; r: 5; }
            }
            .particle {
                animation: flow 5s infinite linear;
                fill: #22d3ee;
            }
            .p1 { animation-delay: 0s; }
            .p2 { animation-delay: 1.25s; }
            .p3 { animation-delay: 2.5s; }
            .p4 { animation-delay: 3.75s; }
            @keyframes flow {
                from { motion-offset: 0%; }
                to { motion-offset: 100%; }
            }
            `}
        </style>
        <defs>
            <linearGradient id="core-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6"/>
                <stop offset="100%" stopColor="#22d3ee"/>
            </linearGradient>
        </defs>

        {/* Paths for particles to follow */}
        <path id="path1" d="M30 50 C 60 20, 70 20, 100 50" fill="none" stroke="#334155" strokeWidth="1" />
        <path id="path2" d="M30 50 C 60 80, 70 80, 100 50" fill="none" stroke="#334155" strokeWidth="1" />
        <path id="path3" d="M170 50 C 140 20, 130 20, 100 50" fill="none" stroke="#334155" strokeWidth="1" />
        <path id="path4" d="M170 50 C 140 80, 130 80, 100 50" fill="none" stroke="#334155" strokeWidth="1" />

        {/* Nodes */}
        <circle cx="30" cy="50" r="4" fill="#475569" className="node node-1" />
        <circle cx="170" cy="50" r="4" fill="#475569" className="node node-2" />
        <circle cx="100" cy="20" r="4" fill="#475569" className="node node-3" />
        <circle cx="100" cy="80" r="4" fill="#475569" className="node node-4" />
        
        {/* Core */}
        <circle cx="100" cy="50" r="12" fill="url(#core-grad)" className="node" style={{ animationDuration: '3s' }} />

        {/* Particles */}
        <circle r="1.5" className="particle p1">
            <animateMotion dur="5s" repeatCount="indefinite">
                <mpath href="#path1" />
            </animateMotion>
        </circle>
        <circle r="1.5" className="particle p2">
            <animateMotion dur="5s" repeatCount="indefinite">
                <mpath href="#path2" />
            </animateMotion>
        </circle>
        <circle r="1.5" className="particle p3">
            <animateMotion dur="5s" repeatCount="indefinite">
                <mpath href="#path3" />
            </animateMotion>
        </circle>
        <circle r="1.5" className="particle p4">
            <animateMotion dur="5s" repeatCount="indefinite">
                <mpath href="#path4" />
            </animateMotion>
        </circle>
    </svg>
);


export const CardDecoration: React.FC = () => (
    <svg className="absolute top-0 right-0 h-32 w-32 text-slate-700/50 -z-10" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <pattern id="dot-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#dot-pattern)" mask="url(#grad-mask)" />
      <mask id="grad-mask">
        <rect width="100" height="100" fill="url(#mask-grad)"/>
      </mask>
      <linearGradient id="mask-grad" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </svg>
  );