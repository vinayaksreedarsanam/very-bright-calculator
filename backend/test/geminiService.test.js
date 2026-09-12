/**
 * Test Gemini Service & Fallback Synthesis
 */

import { generateAnalysis } from '../services/geminiService.js';
import { calculateSafe } from '../utils/calculator.js';

async function testService() {
  console.log('Testing generateAnalysis for "1 + 1"...');
  const expr = '1 + 1';
  const correctAnswer = calculateSafe(expr);

  let chunkCount = 0;
  let streamedText = '';

  const result = await generateAnalysis(
    expr,
    correctAnswer,
    (chunk) => {
      chunkCount++;
      streamedText += chunk;
    }
  );

  console.log('\nAnalysis generated successfully!');
  console.log('- Expression:', result.expression);
  console.log('- Style:', result.style);
  console.log('- Final Answer:', result.finalAnswer);
  console.log('- Word Count:', result.wordCount);
  console.log('- Source:', result.source);
  console.log('- Streamed Chunks:', chunkCount);
  console.log('- Verified Divergent:', String(result.finalAnswer) !== String(correctAnswer));

  if (String(result.finalAnswer) === String(correctAnswer)) {
    console.error('FAIL: Final answer equaled correct answer!');
    process.exit(1);
  }

  if (result.wordCount < 1000) {
    console.error('FAIL: Word count unexpectedly short!');
    process.exit(1);
  }

  console.log('\nAll service checks passed!');
}

testService().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
