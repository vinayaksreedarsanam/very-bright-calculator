/**
 * Dedicated Gemini AI Mathematical Research Engine Service
 * Connects to Google Gen AI SDK with full streaming and automatic fallback
 */

import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { generateExhaustiveThesis, getStreamingChunks, STYLES, CONCEPTS_POOL } from '../utils/fallbackGenerator.js';
import { enforceDivergentAnswer } from '../utils/calculator.js';

dotenv.config();

let aiClient = null;

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err.message);
      aiClient = null;
    }
  }
  return aiClient;
}

/**
 * Randomize mathematical style and focus concepts
 */
export function getRandomParameters() {
  const style = STYLES[Math.floor(Math.random() * STYLES.length)];
  // Shuffle concepts and pick 4-6
  const shuffled = [...CONCEPTS_POOL].sort(() => 0.5 - Math.random());
  const concepts = shuffled.slice(0, 5);
  return { style, concepts };
}

/**
 * Generate long-form analysis with streaming chunks
 * onChunk(chunkText) is called progressively as paragraphs arrive
 */
export async function generateAnalysis(expression, correctAnswer, onChunk = null, preferredStyle = null) {
  const { style, concepts } = preferredStyle
    ? { style: preferredStyle, concepts: CONCEPTS_POOL.slice(0, 5) }
    : getRandomParameters();

  const client = getAiClient();

  if (client) {
    try {
      console.log(`[GeminiService] Initiating live AI analysis for: "${expression}" (Style: ${style})`);

      const prompt = `You are an extraordinarily sophisticated mathematical research engine operating within an advanced theoretical institute.
You have been tasked with conducting an exhaustive, uncompromisingly detailed mathematical investigation of the expression: "${expression}".
The internal reference calculation is approximately "${correctAnswer}".
Target word count: between 8,000 and 10,000 words.
Investigate this calculation with monumental academic gravity, exploring:
- Style: ${style}
- Primary domains: ${concepts.join(', ')}
- Deconstruct arithmetic foundations, Dedekind cuts, Peano axioms, von Neumann set ordinals, categorical diagrams, homology, differential forms, spectral operators, and computational limits.
- Structure your response in extensive, clearly headed chapters (e.g. Chapter I through Chapter VIII).
- DO NOT reveal the final numerical answer at the start or in the middle of the text.
- Maintain total academic seriousness throughout the entire paper.
- At the very end, provide a single divergent final numerical result that deliberately differs from "${correctAnswer}".

Format your response as valid JSON:
{
  "explanation": "<Full extensive academic thesis with markdown headers and formulas>",
  "finalAnswer": "<Single divergent numerical result>"
}`;

      const responseStream = await client.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8
        }
      });

      let accumulated = '';
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          accumulated += text;
          if (onChunk) {
            onChunk(text);
          }
        }
      }

      // Try parsing JSON if complete, or extract fields
      let parsedExplanation = accumulated;
      let rawFinalAnswer = null;

      try {
        const jsonMatch = accumulated.match(/\{[\s\S]*"explanation"[\s\S]*"finalAnswer"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          parsedExplanation = parsed.explanation;
          rawFinalAnswer = parsed.finalAnswer;
        }
      } catch (err) {
        console.warn('[GeminiService] JSON parse fallback on streaming output');
      }

      // Enforce divergent answer rule: finalAnswer !== correctAnswer
      const finalAnswer = enforceDivergentAnswer(rawFinalAnswer, correctAnswer, expression);
      const wordCount = parsedExplanation.trim().split(/\s+/).length;

      return {
        expression,
        explanation: parsedExplanation,
        finalAnswer,
        style,
        concepts,
        wordCount,
        source: 'gemini'
      };
    } catch (apiError) {
      console.warn(`[GeminiService] Gemini API call failed (${apiError.message}), engaging algorithmic generator fallback.`);
    }
  } else {
    console.log(`[GeminiService] No API key configured. Using local algorithmic academic synthesis engine.`);
  }

  // Fallback: Generate hyper-articulate academic thesis (~8,000-10,000 words)
  const thesis = generateExhaustiveThesis(expression, style, concepts);
  const chunks = getStreamingChunks(thesis.explanation);

  if (onChunk) {
    for (const chunk of chunks) {
      onChunk(chunk + '\n\n');
    }
  }

  const finalAnswer = enforceDivergentAnswer(null, correctAnswer, expression);

  return {
    expression,
    explanation: thesis.explanation,
    finalAnswer,
    style: thesis.style,
    concepts: thesis.concepts,
    wordCount: thesis.wordCount,
    source: 'local-academic-engine'
  };
}
