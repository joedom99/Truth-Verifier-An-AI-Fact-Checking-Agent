import React, { useState } from 'react';
import type { GroundingChunk, VerificationResult, SourceAnalysis } from '../types';
import TruthMeter from './TruthMeter';
import SourceLandscape from './SourceLandscape';
import { CardDecoration } from './Illustrations';

interface AnalysisResultProps {
  result: VerificationResult;
  sources: GroundingChunk[] | null;
  claimTitle?: string;
}

const markdownToHtml = (text: string) => {
  if (!text) return '';
  let processedText = text
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2 text-slate-200">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-slate-100">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-4 text-white">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-cyan-300 rounded px-1 py-0.5 text-sm">$1</code>')
    .replace(/(\r\n|\n|\r){2,}/g, '</p><p>') // Paragraphs
    .replace(/(\r\n|\n|\r)/g, '<br/>'); // Line breaks

  // Handle lists separately to wrap them in <ul>
  const listRegex = /^\* (.*$)/gm;
  if (listRegex.test(processedText)) {
      processedText = processedText.replace(listRegex, (match, content) => `<li>${content.replace(/<br\/>/g, '')}</li>`);
      const listItems = processedText.match(/<li>.*<\/li>/g)?.join('') || '';
      processedText = processedText.replace(/<li>.*<\/li>/gs, `<ul>${listItems}</ul>`);
  }
  
  return `<p>${processedText.replace(/<br\/><br\/>/g, '</p><p>')}</p>`;
};


const getTagColor = (type: keyof SourceAnalysis, value: string) => {
    const v = value.toLowerCase();
    switch (type) {
        case 'bias':
            if (v.includes('left')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            if (v.includes('right')) return 'bg-red-500/20 text-red-300 border-red-500/30';
            if (v.includes('neutral')) return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
            return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        case 'sentiment':
            if (v === 'positive') return 'bg-green-500/20 text-green-300 border-green-500/30';
            if (v === 'negative') return 'bg-red-500/20 text-red-300 border-red-500/30';
            return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        case 'tone':
            if (v === 'objective') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
            if (v === 'opinionated') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
        default:
            return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};

const AnalysisTag: React.FC<{ type: keyof SourceAnalysis; value: string }> = ({ type, value }) => (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getTagColor(type, value)}`}>
        {value}
    </span>
);


const AccordionItem: React.FC<{ title: string; children: React.ReactNode; score?: number; verdict?: string; defaultOpen?: boolean }> = ({ title, children, score, verdict, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const getVerdictColor = (v?: string) => {
        if (!v) return 'text-slate-300';
        const lowerV = v.toLowerCase();
        if (lowerV.includes('true')) return 'text-green-400';
        if (lowerV.includes('false')) return 'text-red-400';
        if (lowerV.includes('misleading')) return 'text-yellow-400';
        return 'text-slate-300';
    };

    return (
        <div className="border border-slate-700 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-900/50 hover:bg-slate-800/70 transition-colors"
            >
                <span className="text-left font-semibold text-slate-200">{title}</span>
                <div className="flex items-center gap-4">
                    {verdict && <span className={`font-bold ${getVerdictColor(verdict)}`}>{verdict}</span>}
                    <svg className={`w-6 h-6 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 bg-slate-900/80 border-t border-slate-700">
                    {children}
                </div>
            )}
        </div>
    );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, sources, claimTitle }) => {
  const allSources = sources ? [...new Map(sources.filter(s => s.web?.uri || s.maps?.uri).map(item => [(item.web?.uri || item.maps?.uri), item])).values()] : [];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-fade-in z-0">
       <CardDecoration />
       {claimTitle && (
        <div className="p-4 bg-slate-900/30 border-b border-slate-700">
          <p className="text-sm text-slate-400 text-center">Analysis for Claim:</p>
          <p className="text-md font-semibold text-cyan-300 text-center">"{claimTitle}"</p>
        </div>
      )}
      <div className="p-6 md:p-8 space-y-10">
        
        {/* Overall Analysis */}
        <div>
            <h2 className="text-3xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Overall Analysis
            </h2>
            <TruthMeter score={result.overall_confidence_score} />
            <div className="text-center mb-6">
                <p className="text-2xl font-bold text-slate-100">{result.overall_verdict}</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                <h3 className="text-xl font-bold text-slate-200 mb-3">Summary</h3>
                <div className="text-slate-300 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: markdownToHtml(result.overall_explanation) }} />
            </div>
        </div>
        
        {/* Claim Deconstruction */}
        {result.is_complex_claim && result.sub_claim_analyses?.length > 0 && (
            <div>
                <h2 className="text-2xl font-bold text-slate-200 mb-4 text-center">Claim Deconstruction</h2>
                <div className="space-y-3">
                    {result.sub_claim_analyses.map((sub, index) => (
                        <AccordionItem key={index} title={sub.sub_claim} score={sub.confidence_score} verdict={sub.verdict}>
                            <div className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: markdownToHtml(sub.explanation) }}/>
                        </AccordionItem>
                    ))}
                </div>
            </div>
        )}

        {/* Source Credibility */}
        {result.definitive_sources && result.definitive_sources.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4 text-center">Source Credibility</h3>
            <div className="space-y-3">
              <AccordionItem title="Source Landscape" defaultOpen={true}>
                <SourceLandscape sources={result.definitive_sources} />
              </AccordionItem>
              {result.definitive_sources.map((source, index) => (
                <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <a href={source.uri} target="_blank" rel="noopener noreferrer" className="block mb-3 text-cyan-400 hover:text-cyan-300 font-semibold truncate transition-colors">
                    {source.title || source.uri}
                  </a>
                  <div className="flex flex-wrap gap-2">
                    <AnalysisTag type="bias" value={source.analysis.bias} />
                    <AnalysisTag type="sentiment" value={source.analysis.sentiment} />
                    <AnalysisTag type="tone" value={source.analysis.tone} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Consulted Sources */}
        {allSources.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-slate-200 mb-4 text-center">All Sources Consulted</h3>
            <ul className="space-y-2">
              {/* Fix: Render reviewSnippets for maps sources according to Gemini API guidelines */}
              {allSources.map((source, index) => {
                const mainUri = source.web?.uri || source.maps?.uri;
                const mainTitle = source.web?.title || source.maps?.title || mainUri;
                const reviewSnippets = source.maps?.placeAnswerSources?.reviewSnippets || [];
                
                if (!mainUri) return null;

                return (
                  <li key={index} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors">
                    <a
                      href={mainUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{mainTitle}</span>
                    </a>
                    {reviewSnippets.length > 0 && (
                      <ul className="mt-2 pl-8 space-y-1 list-disc list-outside">
                        {reviewSnippets.map((snippet, sIndex) => (
                           <li key={sIndex} className="text-sm">
                            <a
                              href={snippet.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-500 hover:text-cyan-400"
                            >
                              <span className="truncate">{snippet.title || snippet.uri}</span>
                            </a>
                             <span className="text-slate-500"> (review snippet)</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;