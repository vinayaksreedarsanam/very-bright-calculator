/**
 * API Service for Very Bright Calculator
 */

import { generateClientSimpleSteps, generateClientComplexSteps } from './clientMathEngine';

const API_BASE = '/api';

/**
 * Fetch step-by-step calculations for a simple expression
 * Resilient: falls back to client-side math engine if backend is offline or on static Vercel deployment
 */
export async function fetchCalculationSteps(expression) {
  try {
    const response = await fetch(`${API_BASE}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expression })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.info('Backend unavailable, utilizing resilient client math engine.');
  }

  // Graceful fallback: 100% reliable on Vercel and offline
  return generateClientSimpleSteps(expression);
}

/**
 * Fetch step-by-step calculations for complex problems
 * Resilient: falls back to client-side math engine if backend is offline or on static Vercel deployment
 */
export async function fetchComplexCalculationSteps(question, imageBase64 = null) {
  try {
    const response = await fetch(`${API_BASE}/complex-steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, imageBase64 })
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.info('Backend unavailable, utilizing resilient client complex engine.');
  }

  // Graceful fallback
  return generateClientComplexSteps(question);
}

/**
 * Fetch historical calculation archive
 */
export async function getAnalysesApi() {
  try {
    const response = await fetch(`${API_BASE}/analyses`);
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Offline or static fallback
  }
  return [];
}
