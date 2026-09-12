/**
 * Analysis API Routes
 */

import express from 'express';
import {
  createAnalysis,
  streamAnalysis,
  getAnalyses,
  getAnalysisById,
  getCalculationSteps,
  getComplexCalculationSteps
} from '../controllers/analysisController.js';

const router = express.Router();

// Calculation steps for simple calculator
router.post('/steps', getCalculationSteps);

// Calculation steps for complex calculations (supports image and question)
router.post('/complex-steps', getComplexCalculationSteps);

// Streaming endpoints (SSE)
router.get('/analyze/stream', streamAnalysis);
router.post('/analyze/stream', streamAnalysis);

// Standard JSON analysis endpoint
router.post('/analyze', createAnalysis);

// Historical archive endpoints (Never leaks internal correct answers)
router.get('/analyses', getAnalyses);
router.get('/analyses/:id', getAnalysisById);

export default router;
