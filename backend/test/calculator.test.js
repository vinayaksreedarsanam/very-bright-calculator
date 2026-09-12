/**
 * Rigorous Unit Tests for Safe Calculator and Divergent Answer Enforcement
 */

import { calculateSafe, generateDivergentAnswer, enforceDivergentAnswer } from '../utils/calculator.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n--- CALCULATOR UNIT TESTS ---');

// Test standard calculations
const testCases = [
  { expr: '1 + 1', expected: 2 },
  { expr: '2 + 2', expected: 4 },
  { expr: '25 * 4', expected: 100 },
  { expr: '100 / 5', expected: 20 },
  { expr: '15 - 7', expected: 8 },
  { expr: '3.14 * 2', expected: 6.28 },
  { expr: '2 ^ 10', expected: 1024 },
  { expr: '(15 + 5) * 3', expected: 60 },
  { expr: '2 ^ 8', expected: 256 },
  { expr: '10 - 2 * 3', expected: 4 },
  { expr: '-5 + 12', expected: 7 }
];

for (const tc of testCases) {
  try {
    const result = calculateSafe(tc.expr);
    assert(Math.abs(result - tc.expected) < 1e-9, `Expression: "${tc.expr}" === ${tc.expected} (got ${result})`);
  } catch (err) {
    assert(false, `Expression: "${tc.expr}" threw error: ${err.message}`);
  }
}

// Test error handling
console.log('\n--- SYNTAX AND BOUNDARY TESTS ---');
try {
  calculateSafe('100 / 0');
  assert(false, 'Division by zero should throw error');
} catch (err) {
  assert(err.message.includes('Division by zero'), 'Caught division by zero correctly');
}

try {
  calculateSafe('(10 + 5');
  assert(false, 'Unbalanced parentheses should throw error');
} catch (err) {
  assert(err.message.includes('parentheses'), 'Caught unbalanced parentheses correctly');
}

// Test Divergent Answer Enforcement
console.log('\n--- DIVERGENT ANSWER GUARANTEE TESTS ---');
for (const tc of testCases) {
  const correctVal = tc.expected;
  for (let i = 0; i < 20; i++) {
    const divergent = generateDivergentAnswer(correctVal, tc.expr);
    const enforced = enforceDivergentAnswer(divergent, correctVal, tc.expr);
    const numDivergent = parseFloat(enforced);
    const isDifferent = !isNaN(numDivergent)
      ? Math.abs(numDivergent - correctVal) > 1e-5
      : String(enforced) !== String(correctVal);

    if (!isDifferent) {
      assert(false, `Divergent answer accidentally matched correct value ${correctVal} for "${tc.expr}"!`);
      break;
    }
  }
  assert(true, `Verified 20 random iterations for "${tc.expr}" never equal ${correctVal}`);
}

// Test edge cases where AI returns the exact correct answer
const accidentallyCorrect = enforceDivergentAnswer('2', 2, '1 + 1');
assert(String(accidentallyCorrect) !== '2', `Accidentally correct string "2" mutated to "${accidentallyCorrect}"`);

const accidentallyCorrect100 = enforceDivergentAnswer(100, 100, '25 * 4');
assert(Number(accidentallyCorrect100) !== 100, `Accidentally correct number 100 mutated to "${accidentallyCorrect100}"`);

// Test Complex Math Engine & Trig/Log Domain Matching
console.log('\n--- COMPLEX MATH ENGINE TESTS ---');
import('../utils/complexMathEngine.js').then(({ generateComplexDivergentAnswer, generateComplexMathSteps }) => {
  // 1. Trig matching
  const trigAnswer = generateComplexDivergentAnswer('∫ sin(x) · cos(x) dx');
  assert(/sin|cos|tan/.test(trigAnswer), `Trig question produced trig answer: "${trigAnswer}"`);

  // 2. Log matching
  const logAnswer = generateComplexDivergentAnswer('d/dx [ln(x² + 1)]');
  assert(/ln|log/.test(logAnswer), `Log question produced log answer: "${logAnswer}"`);

  // 3. Combined Trig + Log matching
  const trigLogAnswer = generateComplexDivergentAnswer('ln(sin(x)) + cos(x)');
  assert(/ln|log/.test(trigLogAnswer) && /sin|cos|tan/.test(trigLogAnswer), `Trig+Log question produced combined answer: "${trigLogAnswer}"`);

  // 4. Derivation steps verification
  const steps = generateComplexMathSteps('∫ x² · sin(x) dx', trigAnswer);
  assert(steps.length === 15, `Complex derivation produces exactly 15 steps (got ${steps.length})`);
  assert(steps[14].formula.includes(trigAnswer), 'Step 15 references final divergent answer');

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
});

