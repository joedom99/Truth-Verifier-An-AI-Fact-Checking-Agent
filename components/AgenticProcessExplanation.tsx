import React, { useState, useEffect } from 'react';
import { AgentWorkIllustration } from './Illustrations';

const steps = [
    {
        title: "Deconstructing Claim",
        description: "Breaking down the initial query into smaller, verifiable sub-claims."
    },
    {
        title: "Executing Tools",
        description: "Using Google Search and Maps to gather real-time information and evidence."
    },
    {
        title: "Analyzing Sources",
        description: "Evaluating the credibility, bias, and sentiment of the information found."
    },
    {
        title: "Synthesizing Verdict",
        description: "Combining all findings into a comprehensive, final analysis and confidence score."
    },
    {
        title: "Generating Report & Visuals",
        description: "Formatting the final analysis and rendering data visualizations."
    }
];

type StepStatus = 'pending' | 'active' | 'completed';

const StatusIcon: React.FC<{ status: StepStatus }> = ({ status }) => {
    switch (status) {
        case 'active':
            return (
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-500 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-t-cyan-400 border-r-cyan-400 border-b-cyan-400/20 border-l-cyan-400/20 rounded-full animate-spin"></div>
                </div>
            );
        case 'completed':
            return (
                <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        case 'pending':
        default:
            return (
                <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                </div>
            );
    }
};

const ProcessStep: React.FC<{ title: string; description: string; status: StepStatus }> = ({ title, description, status }) => {
    const getStatusClasses = () => {
        switch(status) {
            case 'active': return 'opacity-100';
            case 'completed': return 'opacity-60';
            case 'pending': return 'opacity-40';
        }
    };
    
    return (
        <div className={`flex items-start gap-4 transition-opacity duration-500 ${getStatusClasses()}`}>
            <div className="flex-shrink-0 mt-1">
                <StatusIcon status={status} />
            </div>
            <div>
                <h3 className={`font-semibold ${status === 'active' ? 'text-cyan-300' : 'text-slate-200'}`}>{title}</h3>
                <p className="text-sm text-slate-400">{description}</p>
            </div>
        </div>
    );
};

interface AgenticProcessExplanationProps {
  isDone: boolean;
}

const AgenticProcessExplanation: React.FC<AgenticProcessExplanationProps> = ({ isDone }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // This interval simulates the backend agent progressing through the first set of steps.
        const interval = setInterval(() => {
            setCurrentStep(prev => {
                // Stop the timer before we get to the final, client-side step.
                if (prev < steps.length - 2) { 
                    return prev + 1;
                }
                clearInterval(interval);
                return prev;
            });
        }, 1800); // Shortened interval for a snappier feel

        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
      // Once the backend simulation is done...
      if(currentStep >= steps.length - 2) {
        if (isDone) {
          // If the parent says we're done loading, complete the final step.
          setCurrentStep(steps.length);
        } else {
          // Otherwise, show the final step as active. This covers the client-side render time.
          setCurrentStep(steps.length - 1);
        }
      }
    }, [currentStep, isDone])

    const getStatus = (stepIndex: number): StepStatus => {
        if (stepIndex < currentStep) return 'completed';
        if (stepIndex === currentStep) return 'active';
        return 'pending';
    };

    return (
        <div className="w-full max-w-2xl p-6 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 animate-fade-in">
            <AgentWorkIllustration />
            <div className="space-y-5">
                {steps.map((step, index) => (
                    <ProcessStep
                        key={index}
                        title={step.title}
                        description={step.description}
                        status={getStatus(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default AgenticProcessExplanation;