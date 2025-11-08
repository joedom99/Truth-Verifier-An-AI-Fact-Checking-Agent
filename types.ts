export interface SourceAnalysis {
  bias: string;
  sentiment: string;
  tone: string;
}

export interface DefinitiveSource {
  uri: string;
  title: string;
  analysis: SourceAnalysis;
}

export interface SubClaimAnalysis {
  sub_claim: string;
  verdict: string;
  confidence_score: number;
  explanation: string;
}

export interface VerificationResult {
  overall_verdict: string;
  overall_confidence_score: number;
  overall_explanation: string;
  is_complex_claim: boolean;
  sub_claim_analyses: SubClaimAnalysis[];
  definitive_sources: DefinitiveSource[];
}

export interface UrlVerificationResponse {
    claims_analyses: VerificationResult[];
}


export interface WebSource {
  uri: string;
  title: string;
}

export interface MapSource {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri: string;
            title: string;
        }[];
    }
}

export interface GroundingChunk {
  web?: WebSource;
  maps?: MapSource;
}
