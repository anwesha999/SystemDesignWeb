
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DesignPhase } from "../types";
import { STATIC_DESIGNS, STATIC_DIAGRAMS } from "../staticData";

export class GeminiService {
  // Always check process.env.API_KEY to see if we have a valid key
  private get hasKey(): boolean {
    const key = process.env.API_KEY;
    return !!(key && key !== 'undefined' && key.length > 5);
  }

  async generateDesignSection(systemId: string, systemName: string, phase: DesignPhase, systemContext: string): Promise<string> {
    // Check static cache first if no key
    if (!this.hasKey && STATIC_DESIGNS[systemId]?.[phase]) {
      return STATIC_DESIGNS[systemId][phase]!;
    }

    if (!this.hasKey) {
      return `### [Demo Mode]
You are currently viewing a static demo. To generate dynamic SDE-3 level architecture for **${systemName}**, please provide a Gemini API Key in your environment variables.

${STATIC_DESIGNS[systemId]?.[phase] || "Full design content for this specific module is coming soon in the static package."}`;
    }

    const prompt = `
      You are an expert Staff Software Engineer (SDE-3) and Software Architect at a Big Tech company.
      Create a deep, insightful design for: ${systemName}
      Focus specifically on the phase: ${phase}
      
      Context: ${systemContext}
      
      Guidelines:
      - If ${phase} is "Requirements": Discuss Functional and Non-Functional (99.99% Availability). Perform detailed capacity planning.
      - If ${phase} is "High Level Design": Provide structured explanation. Use terms like Fan-out, Back-pressure, CQRS.
      - If ${phase} is "Data Model & APIs": Provide schema for SQL and NoSQL.
      - If ${phase} is "Low Level Design (Java)": Write production-ready Java code snippets using Design Patterns.
      - If ${phase} is "Machine Coding / Craft": Format as a "2-hour session to build a working application (e.g., Snake & Ladder, Splitwise, or a Parking Lot)". Focus on the Class Diagram, Design Patterns (like Strategy or Factory), and concurrency handling. Emphasize extensibility and clean code.
      - If ${phase} is "Deep Dives & Scaling": Focus on "Common Tasks: Design a Kafka-backed Order Event Processor or a Food-Order Matching System." Discuss Consistency vs. Latency trade-offs. Address how to handle 200k+ events/min with strict ordering. Discuss Kafka partitioning, Redis caching, and Idempotency in depth.
      - If ${phase} is "Interview Follow-ups": Provide senior-level trade-off thinking.

      Format the response in professional, deep-insight Markdown.
    `;

    try {
      // Create fresh instance to ensure we use the latest API key as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { thinkingConfig: { thinkingBudget: 16384 } }
      });
      return response.text || "Failed to generate content.";
    } catch (e) {
      console.error(e);
      return STATIC_DESIGNS[systemId]?.[phase] || "API Error: Falling back to limited static content.";
    }
  }

  async generateBlogCover(systemId: string, systemName: string): Promise<string | undefined> {
    if (!this.hasKey) return `https://picsum.photos/seed/${systemId}/1200/600?grayscale`;

    try {
      // Create fresh instance to ensure we use the latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A futuristic, professional technical blog header image representing '${systemName} System Architecture'. Dark mode aesthetic, minimalist nodes and connections.` }]
        },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });
      
      // Correctly iterate through parts to find the image part as per guidelines
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      return part ? `data:image/png;base64,${part.inlineData.data}` : undefined;
    } catch (e) {
      console.error(e);
      return `https://picsum.photos/seed/${systemId}/1200/600?grayscale`;
    }
  }

  async generateMermaidDiagram(systemId: string, systemName: string): Promise<string> {
    if (!this.hasKey && STATIC_DIAGRAMS[systemId]) {
      return STATIC_DIAGRAMS[systemId];
    }

    if (!this.hasKey) return "graph TD\n  A[App] --> B[API Gateway]\n  B --> C[Microservice]\n  C --> D[(Database)]";

    const prompt = `
      Create an advanced Mermaid.js graph code for the High Level Architecture of ${systemName}.
      Include CDN, DNS, API Gateway, Load Balancers, Microservices, Databases, Message Queues, Cache.
      ONLY return the mermaid code block starting with "graph TD".
    `;

    try {
      // Create fresh instance to ensure we use the latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        // Using 'gemini-3-flash-preview' for basic text/reasoning tasks as recommended
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text?.replace(/```mermaid|```/g, '').trim() || STATIC_DIAGRAMS[systemId] || "graph TD\n  Error --> Diagram";
    } catch (e) {
      console.error(e);
      return STATIC_DIAGRAMS[systemId] || "graph TD\n  Fallback --> Diagram";
    }
  }

  async generateExplainerVideo(prompt: string): Promise<string | undefined> {
    // Re-initialize directly inside the method to support user-selected keys
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic visualization of a cloud architecture for ${prompt}. High quality 3D rendering.`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      // Append API key when fetching from the download link as per guidelines
      return downloadLink ? `${downloadLink}&key=${process.env.API_KEY}` : undefined;
    } catch (e) {
      console.error("Veo API error:", e);
      throw e; // Rethrow to let App.tsx handle potential key selection reset
    }
  }
}

export const gemini = new GeminiService();
