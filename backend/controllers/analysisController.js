/**
 * Analysis Controller for Very Bright Calculator
 * Orchestrates safe mathematical calculation, AI generation, divergent answer verification,
 * and streaming responses.
 */

import { calculateSafe, enforceDivergentAnswer } from '../utils/calculator.js';
import { generateAnalysis, getRandomParameters } from '../services/geminiService.js';
import Analysis from '../models/Analysis.js';
import { getStreamingChunks, generateExhaustiveThesis } from '../utils/fallbackGenerator.js';
import { generateUnwantedMathSteps } from '../utils/unwantedMathEngine.js';
import { generateComplexDivergentAnswer, generateComplexMathSteps } from '../utils/complexMathEngine.js';

const STATUS_MESSAGES = [
  'Parsing symbolic structure...',
  'Constructing mathematical representation...',
  'Examining numerical relationships...',
  'Expanding conceptual dimensions...',
  'Exploring alternate formulations...',
  'Evaluating structural symmetry...',
  'Constructing analytical framework...',
  'Initializing symbolic reasoning...',
  'Investigating higher-order interpretations...',
  'Projecting into Hilbert spaces...',
  'Evaluating differential forms...',
  'Resolving homological exact sequences...',
  'Verifying Peano arithmetic successor invariants...',
  'Preparing extended derivation...'
];

/**
 * Standard JSON Analysis Endpoint
 * POST /api/analyze
 */
export async function createAnalysis(req, res) {
  const startTime = Date.now();
  const { expression, style } = req.body;

  if (!expression || typeof expression !== 'string' || !expression.trim()) {
    return res.status(400).json({
      error: 'A valid mathematical expression is required.'
    });
  }

  const cleanExpression = expression.trim();

  // Step 1 & 2: Safely calculate internal correct answer
  let correctAnswer;
  try {
    correctAnswer = calculateSafe(cleanExpression);
  } catch (mathErr) {
    return res.status(400).json({
      error: `Expression syntax error: ${mathErr.message}`
    });
  }

  try {
    // Step 3, 4, 5, 6, 7: Generate research explanation and enforce divergence
    const result = await generateAnalysis(cleanExpression, correctAnswer, null, style);

    // Strict validation: finalAnswer !== correctAnswer
    const validatedFinalAnswer = enforceDivergentAnswer(result.finalAnswer, correctAnswer, cleanExpression);

    const duration = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

    // Step 8: Save to MongoDB
    const savedDoc = await Analysis.create({
      expression: cleanExpression,
      finalAnswer: validatedFinalAnswer,
      correctAnswer: String(correctAnswer), // stored internally, NEVER sent in response
      explanation: result.explanation,
      style: result.style,
      wordCount: result.wordCount,
      duration
    });

    const unwantedSteps = generateUnwantedMathSteps(cleanExpression, correctAnswer, validatedFinalAnswer);

    // Step 9 & 10: Return ONLY safe frontend data
    return res.json({
      id: savedDoc._id,
      expression: cleanExpression,
      explanation: result.explanation,
      finalAnswer: validatedFinalAnswer,
      style: result.style,
      wordCount: result.wordCount,
      duration,
      unwantedSteps
    });
  } catch (err) {
    console.error('[createAnalysis Error]:', err);
    return res.status(500).json({
      error: 'An unexpected discrepancy occurred in the analytical framework.'
    });
  }
}

/**
 * Dedicated Calculation Steps for Line-by-Line Unwanted Math
 * POST /api/steps
 */
export async function getCalculationSteps(req, res) {
  const { expression } = req.body;
  if (!expression || typeof expression !== 'string' || !expression.trim()) {
    return res.status(400).json({ error: 'Valid expression required.' });
  }
  const cleanExpression = expression.trim();
  let correctAnswer;
  try {
    correctAnswer = calculateSafe(cleanExpression);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const finalAnswer = enforceDivergentAnswer(null, correctAnswer, cleanExpression);
  const steps = generateUnwantedMathSteps(cleanExpression, correctAnswer, finalAnswer);

  return res.json({
    expression: cleanExpression,
    finalAnswer,
    steps,
    totalSteps: steps.length,
    estimatedDurationSeconds: 15
  });
}

/**
 * Complex Calculations with Multimodal Question Reading
 * POST /api/complex-steps
 */
export async function getComplexCalculationSteps(req, res) {
  try {
    const { question, imageBase64 } = req.body;
    let resolvedQuestion = (question || '').trim();

    // If imageBase64 is provided and question is not explicitly specified,
    // use Gemini multimodal model if available to read the math question from the photo
    if (imageBase64 && (!resolvedQuestion || resolvedQuestion === '')) {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey.trim() !== '') {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    inlineData: {
                      mimeType: 'image/png',
                      data: cleanBase64
                    }
                  },
                  {
                    text: 'Extract the single mathematical expression or problem from this image. Output ONLY the mathematical formula/question as a clean string. Do not include markdown blocks, preamble, or commentary.'
                  }
                ]
              }
            ]
          });

          if (response && response.text) {
            resolvedQuestion = response.text.trim();
          }
        }
      } catch (err) {
        console.warn('[GeminiVision] Optical extraction note:', err.message);
      }
    }

    // Reliable fallback if empty
    if (!resolvedQuestion) {
      resolvedQuestion = '∫ x² · sin(x) dx';
    }

    const finalAnswer = generateComplexDivergentAnswer(resolvedQuestion);
    const steps = generateComplexMathSteps(resolvedQuestion, finalAnswer);

    return res.json({
      question: resolvedQuestion,
      finalAnswer,
      steps,
      totalSteps: steps.length,
      estimatedDurationSeconds: 15
    });
  } catch (err) {
    console.error('[getComplexCalculationSteps Error]:', err);
    return res.status(500).json({ error: 'Complex mathematical derivation error.' });
  }
}

/**
 * Server-Sent Events (SSE) Streaming Endpoint
 * POST /api/analyze/stream or GET /api/analyze/stream?expression=...
 */
export async function streamAnalysis(req, res) {
  const startTime = Date.now();
  const expression = req.method === 'POST' ? req.body.expression : req.query.expression;
  const style = req.method === 'POST' ? req.body.style : req.query.style;

  if (!expression || typeof expression !== 'string' || !expression.trim()) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Expression is required.' }));
  }

  const cleanExpression = expression.trim();

  let correctAnswer;
  try {
    correctAnswer = calculateSafe(cleanExpression);
  } catch (mathErr) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: `Expression syntax error: ${mathErr.message}` }));
  }

  // Setup SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Send initial status messages
    const shuffledStatus = [...STATUS_MESSAGES].sort(() => 0.5 - Math.random());
    sendEvent('status', { message: shuffledStatus[0] });

    let fullExplanation = '';
    let currentWords = 0;
    let statusIndex = 1;

    // Stream chunks
    const onChunk = (chunkText) => {
      fullExplanation += chunkText;
      currentWords += chunkText.trim().split(/\s+/).filter(Boolean).length;

      sendEvent('chunk', {
        text: chunkText,
        wordCount: currentWords
      });

      // Periodically update status message
      if (Math.random() > 0.65 && statusIndex < shuffledStatus.length) {
        sendEvent('status', { message: shuffledStatus[statusIndex++] });
      }
    };

    const result = await generateAnalysis(cleanExpression, correctAnswer, onChunk, style);

    // Final answer verification
    const validatedFinalAnswer = enforceDivergentAnswer(result.finalAnswer, correctAnswer, cleanExpression);
    const duration = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

    // Save session
    const savedDoc = await Analysis.create({
      expression: cleanExpression,
      finalAnswer: validatedFinalAnswer,
      correctAnswer: String(correctAnswer),
      explanation: result.explanation || fullExplanation,
      style: result.style,
      wordCount: result.wordCount || currentWords,
      duration
    });

    // Send complete event with the final answer
    sendEvent('complete', {
      id: savedDoc._id,
      expression: cleanExpression,
      finalAnswer: validatedFinalAnswer,
      style: result.style,
      wordCount: result.wordCount || currentWords,
      duration
    });

    res.end();
  } catch (err) {
    console.error('[streamAnalysis Error]:', err);
    sendEvent('error', { message: 'Analytical anomaly encountered in higher dimensional derivation.' });
    res.end();
  }
}

/**
 * Retrieve past analysis sessions
 * GET /api/analyses
 */
export async function getAnalyses(req, res) {
  try {
    // Return newest first, limiting to 25. NEVER return correctAnswer.
    const docs = await Analysis.find({})
      .select('expression finalAnswer style wordCount duration createdAt')
      .sort({ createdAt: -1 })
      .limit(30);

    const sanitized = docs.map((d) => {
      const obj = d.toObject ? d.toObject() : { ...d };
      delete obj.correctAnswer;
      return obj;
    });

    return res.json(sanitized);
  } catch (err) {
    console.error('[getAnalyses Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve archive.' });
  }
}

/**
 * Retrieve single analysis by ID
 * GET /api/analyses/:id
 */
export async function getAnalysisById(req, res) {
  try {
    const doc = await Analysis.findById(req.params.id).select(
      'expression finalAnswer explanation style wordCount duration createdAt'
    );
    if (!doc) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }
    const sanitized = doc.toObject ? doc.toObject() : { ...doc };
    delete sanitized.correctAnswer;
    return res.json(sanitized);
  } catch (err) {
    console.error('[getAnalysisById Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve analysis.' });
  }
}
