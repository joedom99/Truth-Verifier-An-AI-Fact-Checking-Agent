# Truth Verifier: An AI Fact-Checking Agent
# by: Joe Domaleski and Sophie Castellon
# Georgia Tech 2025 AI ATL Hackathon

An advanced AI agent designed to meticulously fact-check claims using Google Search and Google Maps. This tool deconstructs complex statements, analyzes source credibility, and provides a clear, data-driven verdict to help you distinguish fact from fiction. It features a detailed explanation of its reasoning, a visual 'truth-meter', and a confidence score to assess the validity of any statement or the claims within a web article.

## Key Features

-   **Dual-Mode Verification:** Verify claims entered as plain text or by providing a URL to an article.
-   **Claim Deconstruction:** Automatically breaks down complex, multi-part claims into simpler, verifiable sub-claims for a more granular analysis.
-   **Real-Time Grounding:** Leverages the power of Google Search and Google Maps to gather the most current information.
-   **Source Credibility Analysis:** Identifies definitive sources and evaluates their bias, sentiment, and tone.
-   **Interactive Visualizations:**
    -   **Truth Meter:** An intuitive gauge displaying the overall confidence score of the verdict.
    -   **Source Landscape:** A chart plotting sources based on their bias and tone, providing a clear view of the information landscape.
-   **Location-Aware:** Optionally uses your geo-location for more accurate results on "nearby" or location-specific queries.
-   **Detailed Reporting:** Generates a comprehensive report including an overall verdict, a summary explanation, and a breakdown of each sub-claim analysis.

## More Information about the Project

-  **Devpost:** https://devpost.com/software/truth-verifier-an-ai-fact-checking-agent
-  **YouTube:** https://youtu.be/FG_24rk-ngU?si=PABj8I0rGXrvsDTN

## Try It Out Link

**Web:** https://truth-verifier-541538522417.us-west1.run.app/

### Run Locally

**Prerequisites:** [Node.js](https://nodejs.org/)

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set Environment Variable:**
    Create a file named `.env.local` in the root of the project and add your Gemini API key:
    ```
    API_KEY=your_gemini_api_key_here
    ```
    *Note: The project is currently configured to use `process.env.API_KEY`, so you may need to adjust your local setup to expose this variable correctly (e.g., using a `.env` file with a library like `dotenv`).*

3.  **Run the app:**
    ```bash
    npm run dev
    ```
