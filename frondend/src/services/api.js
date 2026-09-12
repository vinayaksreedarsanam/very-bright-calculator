/**
 * API Service for Very Bright Calculator
 */

const API_BASE = '/api';

/**
 * Fetch step-by-step unwanted calculations for a simple expression
 */
export async function fetchCalculationSteps(expression) {
  const response = await fetch(`${API_BASE}/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expression })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to calculate: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch step-by-step calculations for complex problems (supports imageBase64 or question text)
 */
export async function fetchComplexCalculationSteps(question, imageBase64 = null) {
  const response = await fetch(`${API_BASE}/complex-steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, imageBase64 })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Failed to calculate: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch historical calculation archive
 */
export async function getAnalysesApi() {
  const response = await fetch(`${API_BASE}/analyses`);
  if (!response.ok) {
    throw new Error('Failed to retrieve history');
  }
  return response.json();
}
