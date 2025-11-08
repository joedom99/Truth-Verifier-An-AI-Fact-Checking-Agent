import { GoogleGenAI, GenerateContentResponse, Tool } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const verificationResultSchema = `{
  "type": "object",
  "properties": {
    "overall_verdict": { "type": "string", "description": "A concise overall verdict for the original claim." },
    "overall_confidence_score": { "type": "number", "description": "An overall confidence score (0-100) for the original claim." },
    "overall_explanation": { "type": "string", "description": "A summary explanation synthesizing the sub-claim findings. Use markdown." },
    "is_complex_claim": { "type": "boolean", "description": "True if the original claim was broken down into sub-claims." },
    "sub_claim_analyses": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "sub_claim": { "type": "string" },
          "verdict": { "type": "string" },
          "confidence_score": { "type": "number" },
          "explanation": { "type": "string", "description": "Use markdown for formatting." }
        },
        "required": ["sub_claim", "verdict", "confidence_score", "explanation"]
      }
    },
    "definitive_sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "uri": { "type": "string" },
          "title": { "type": "string" },
          "analysis": {
            "type": "object",
            "properties": {
              "bias": { "type": "string", "description": "e.g., 'Left-leaning', 'Right-leaning', 'Neutral', 'Corporate', 'Scientific'" },
              "sentiment": { "type": "string", "description": "e.g., 'Positive', 'Negative', 'Neutral'" },
              "tone": { "type": "string", "description": "e.g., 'Objective', 'Opinionated', 'Promotional', 'Satirical'" }
            },
            "required": ["bias", "sentiment", "tone"]
          }
        },
        "required": ["uri", "title", "analysis"]
      }
    }
  },
  "required": ["overall_verdict", "overall_confidence_score", "overall_explanation", "is_complex_claim", "sub_claim_analyses", "definitive_sources"]
}`;

export const verifyClaim = async (claim: string, userLocation?: { latitude: number; longitude: number }): Promise<GenerateContentResponse> => {
  const prompt = `You are a sophisticated, multi-faceted fact-checking AI agent. Your task is to verify the following claim using the provided tools (Google Search, Google Maps).

Claim: "${claim}"

Follow these steps meticulously:
1.  **Deconstruction:** First, analyze the claim. Is it a simple, singular claim, or is it a complex claim composed of multiple verifiable parts?
    - If it's complex, set 'is_complex_claim' to true and deconstruct it into an array of simple, distinct sub-claims.
    - If it's simple, set 'is_complex_claim' to false and treat the original claim as the only sub-claim in the 'sub_claim_analyses' array.

2.  **Verification:** For EACH sub-claim, perform verification using the most appropriate tool(s).
    - Use Google Maps for any claims related to geography, locations, businesses, or "nearby" queries.
    - Use Google Search for all other claims.
    - For each sub-claim, provide a concise verdict, a confidence score (0-100), and a detailed explanation of your reasoning based on the tool's results.

3.  **Source Credibility Analysis:** After verifying all sub-claims, identify the top 3-5 most definitive and authoritative sources you consulted overall. For each of these sources, perform a credibility analysis. Assess its potential bias, overall sentiment, and the tone of the content.

4.  **Synthesis:** Finally, provide an overall summary for the original, top-level claim. This should include an 'overall_verdict', an 'overall_confidence_score', and an 'overall_explanation' that synthesizes the findings from the sub-claim analyses.

Respond with ONLY a valid JSON object in a markdown block. The JSON object must conform to the following schema:
${verificationResultSchema}

Your entire response must be the JSON object inside a \`\`\`json markdown block.`;
  
  const tools: Tool[] = [{googleSearch: {}}, {googleMaps: {}}];
  
  const toolConfig = userLocation ? {
    retrievalConfig: {
      latLng: userLocation
    }
  } : undefined;

  return ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: tools,
      toolConfig: toolConfig,
      temperature: 0.2,
    },
  });
};


export const verifyUrl = async (url: string, userLocation?: { latitude: number; longitude: number }): Promise<GenerateContentResponse> => {
    const prompt = `You are a sophisticated, multi-faceted fact-checking AI agent. A user has provided the following URL for analysis:

URL: "${url}"

Your task is to:
1.  **Access and Analyze Content:** Using Google Search, access and thoroughly read the content of the article at the provided URL.
2.  **Identify Key Claims:** Identify and extract the 1-3 most significant, distinct, and verifiable claims made within the article. If the article is an opinion piece, extract its core arguments.
3.  **Perform Individual Verification:** For EACH claim you identified, perform a complete and independent verification analysis. Follow the detailed steps (Deconstruction, Verification, Source Credibility Analysis, Synthesis) as outlined for a single claim verification.
4.  **Format Response:** Structure your entire response as a single valid JSON object in a markdown block. The JSON object must contain one key: "claims_analyses", which is an array. Each object in this array must conform to the following schema:
${verificationResultSchema}

Ensure each element in the "claims_analyses" array is a complete verification result for one of the key claims you identified from the article.`;

    const tools: Tool[] = [{ googleSearch: {} }, { googleMaps: {} }];

    const toolConfig = userLocation ? {
        retrievalConfig: {
            latLng: userLocation
        }
    } : undefined;

    return ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: tools,
            toolConfig: toolConfig,
            temperature: 0.2,
        },
    });
};