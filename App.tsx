import React, { useState, useCallback, useEffect } from 'react';
import { verifyClaim, verifyUrl } from './services/geminiService';
import type { VerificationResult, GroundingChunk, UrlVerificationResponse } from './types';
import AnalysisResult from './components/ResultCard';
import AgenticProcessExplanation from './components/AgenticProcessExplanation';
import { AppIcon, EmptyStateIllustration } from './components/Illustrations';

type GeolocationState = {
  coords: { latitude: number; longitude: number; } | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  message: string;
}

type InputMode = 'text' | 'url';

const App: React.FC = () => {
  const [mode, setMode] = useState<InputMode>('text');
  const [inputText, setInputText] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [results, setResults] = useState<VerificationResult[] | null>(null);
  const [sources, setSources] = useState<GroundingChunk[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useGeolocation, setUseGeolocation] = useState<boolean>(false);
  const [locationState, setLocationState] = useState<GeolocationState>({
    coords: null,
    status: 'idle',
    message: 'Enable for location-based claims.',
  });
  
  const activeInput = mode === 'text' ? inputText : urlInput;

  useEffect(() => {
    if (useGeolocation) {
      setLocationState(prev => ({ ...prev, status: 'pending', message: 'Requesting location...' }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            status: 'success',
            message: 'Location acquired!',
          });
        },
        (error) => {
          setLocationState({
            coords: null,
            status: 'error',
            message: `Error: ${error.message}.`,
          });
          setUseGeolocation(false); // Toggle off if permission is denied
        }
      );
    } else {
      setLocationState({ coords: null, status: 'idle', message: 'Enable for location-based claims.' });
    }
  }, [useGeolocation]);

  const handleSubmit = useCallback(async () => {
    if (!activeInput.trim()) {
      setError(`Please enter a ${mode} to verify.`);
      return;
    }
    
    if (useGeolocation && locationState.status !== 'success') {
      setError('Waiting for location data. Please wait or disable location services to proceed.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);
    setSources([]);

    try {
      const response = mode === 'text'
        ? await verifyClaim(inputText, locationState.coords ?? undefined)
        : await verifyUrl(urlInput, locationState.coords ?? undefined);
      
      let responseText = response.text;
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
      }

      const parsedJson = JSON.parse(responseText.trim());

      if (mode === 'url') {
        const urlResult: UrlVerificationResponse = parsedJson;
        setResults(urlResult.claims_analyses);
      } else {
        const verificationResult: VerificationResult = parsedJson;
        setResults([verificationResult]);
      }
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
      if (groundingChunks) {
        setSources(groundingChunks);
      }

    } catch (e) {
      console.error("Verification process failed:", e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred: ${errorMessage}. The model may have returned an invalid response. Check the console for details.`);
    } finally {
      setIsLoading(false);
    }
  }, [mode, inputText, urlInput, useGeolocation, locationState.coords, locationState.status, activeInput]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Fix: Add children to props type to fix TypeScript error.
  const TabButton: React.FC<{ currentMode: InputMode, targetMode: InputMode, children: React.ReactNode }> = ({ currentMode, targetMode, children }) => (
    <button
        onClick={() => setMode(targetMode)}
        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
            currentMode === targetMode
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <AppIcon />
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Truth Verifier
          </h1>
        </div>
        <p className="text-slate-400 mb-8 text-lg">
          The AI agent that deconstructs claims, analyzes sources, and verifies with facts.
        </p>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
            <div className="flex justify-center gap-2 mb-4">
                <TabButton currentMode={mode} targetMode='text'>Verify Text</TabButton>
                <TabButton currentMode={mode} targetMode='url'>Verify from URL</TabButton>
            </div>
            <div className="relative">
              {mode === 'text' ? (
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., The Eiffel Tower is taller than the Empire State Building and is the most visited monument."
                  className="w-full h-24 p-4 pr-32 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 transition-all resize-none disabled:opacity-50"
                  disabled={isLoading}
                />
              ) : (
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., https://www.example.com/news/article-to-verify"
                  className="w-full h-14 p-4 pr-32 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 transition-all disabled:opacity-50"
                  disabled={isLoading}
                />
              )}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !activeInput.trim()}
                className="absolute top-1/2 -translate-y-1/2 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
            <label htmlFor="geo-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input type="checkbox" id="geo-toggle" className="sr-only" checked={useGeolocation} onChange={() => setUseGeolocation(!useGeolocation)} disabled={isLoading} />
                    <div className="block bg-slate-700 w-12 h-6 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useGeolocation ? 'translate-x-6 bg-cyan-400' : ''}`}></div>
                </div>
                <div className="ml-3 text-slate-400 text-sm">Use Geo-location</div>
            </label>
            <p className={`text-xs ${locationState.status === 'error' ? 'text-red-400' : 'text-slate-500'}`}>
              ({locationState.message})
            </p>
        </div>


        <div className="mt-8 min-h-[400px] flex flex-col items-center justify-start gap-6">
          {isLoading && <AgenticProcessExplanation isDone={!isLoading && !!results} />}
          {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg w-full max-w-4xl">{error}</div>}
          {results && results.map((result, index) => (
            <AnalysisResult key={index} result={result} sources={sources} claimTitle={result.sub_claim_analyses[0]?.sub_claim} />
          ))}
          {!isLoading && !error && !results && (
            <EmptyStateIllustration />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;