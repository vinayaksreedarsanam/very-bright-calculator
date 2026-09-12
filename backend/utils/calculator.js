/**
 * Safe Mathematical Expression Evaluator and Divergent Answer Generator
 * Evaluates basic to intermediate expressions without eval()
 */

// Token types
const TOKEN_NUMBER = 'NUMBER';
const TOKEN_OPERATOR = 'OPERATOR';
const TOKEN_LPAREN = 'LPAREN';
const TOKEN_RPAREN = 'RPAREN';
const TOKEN_FUNCTION = 'FUNCTION';

/**
 * Tokenize mathematical expression string
 */
function tokenize(expression) {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new Error('Expression must be a non-empty string');
  }

  // Normalize common typographic characters
  const normalized = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/,/g, '')
    .trim();

  const tokens = [];
  let i = 0;

  while (i < normalized.length) {
    const char = normalized[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers & Decimals
    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(normalized[i + 1]))) {
      let numStr = '';
      let hasDot = false;
      while (i < normalized.length && (/[0-9]/.test(normalized[i]) || normalized[i] === '.')) {
        if (normalized[i] === '.') {
          if (hasDot) throw new Error('Invalid number format: multiple decimal points');
          hasDot = true;
        }
        numStr += normalized[i];
        i++;
      }
      tokens.push({ type: TOKEN_NUMBER, value: parseFloat(numStr) });
      continue;
    }

    // Constants like pi and e, or functions like sqrt, sin, cos
    if (/[a-zA-Z]/.test(char)) {
      let ident = '';
      while (i < normalized.length && /[a-zA-Z]/.test(normalized[i])) {
        ident += normalized[i].toLowerCase();
        i++;
      }
      if (ident === 'pi') {
        tokens.push({ type: TOKEN_NUMBER, value: Math.PI });
      } else if (ident === 'e') {
        tokens.push({ type: TOKEN_NUMBER, value: Math.E });
      } else if (['sqrt', 'abs', 'sin', 'cos', 'tan', 'ln', 'log'].includes(ident)) {
        tokens.push({ type: TOKEN_FUNCTION, value: ident });
      } else {
        throw new Error(`Unrecognized symbol or variable: "${ident}"`);
      }
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: TOKEN_LPAREN, value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: TOKEN_RPAREN, value: ')' });
      i++;
      continue;
    }

    // Operators
    if (['+', '-', '*', '/', '^', '%'].includes(char)) {
      // Check for unary minus:
      // A '-' is unary if it is at the start of expression, or immediately follows an operator or '('
      if (char === '-') {
        const prevToken = tokens[tokens.length - 1];
        if (!prevToken || prevToken.type === TOKEN_OPERATOR || prevToken.type === TOKEN_LPAREN) {
          // Unary negation token
          tokens.push({ type: TOKEN_OPERATOR, value: 'u-', precedence: 4, rightAssoc: true });
          i++;
          continue;
        }
      }

      const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '%': 2,
        '^': 3
      }[char];

      const rightAssoc = char === '^';
      tokens.push({ type: TOKEN_OPERATOR, value: char, precedence, rightAssoc });
      i++;
      continue;
    }

    throw new Error(`Unexpected character in expression: "${char}"`);
  }

  return tokens;
}

/**
 * Convert infix tokens to Reverse Polish Notation (RPN) via Shunting-Yard Algorithm
 */
function toRPN(tokens) {
  const outputQueue = [];
  const operatorStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === TOKEN_NUMBER) {
      outputQueue.push(token);
    } else if (token.type === TOKEN_FUNCTION) {
      operatorStack.push(token);
    } else if (token.type === TOKEN_OPERATOR) {
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (
          top.type === TOKEN_FUNCTION ||
          (top.type === TOKEN_OPERATOR &&
            ((!token.rightAssoc && token.precedence <= top.precedence) ||
              (token.rightAssoc && token.precedence < top.precedence)))
        ) {
          outputQueue.push(operatorStack.pop());
        } else {
          break;
        }
      }
      operatorStack.push(token);
    } else if (token.type === TOKEN_LPAREN) {
      operatorStack.push(token);
    } else if (token.type === TOKEN_RPAREN) {
      let foundLparen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop();
        if (top.type === TOKEN_LPAREN) {
          foundLparen = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!foundLparen) {
        throw new Error('Mismatched parentheses: missing opening parenthesis');
      }
      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === TOKEN_FUNCTION
      ) {
        outputQueue.push(operatorStack.pop());
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop();
    if (top.type === TOKEN_LPAREN || top.type === TOKEN_RPAREN) {
      throw new Error('Mismatched parentheses in expression');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

/**
 * Safely evaluate RPN token sequence
 */
function evaluateRPN(rpn) {
  const stack = [];

  for (const token of rpn) {
    if (token.type === TOKEN_NUMBER) {
      stack.push(token.value);
    } else if (token.type === TOKEN_OPERATOR) {
      if (token.value === 'u-') {
        if (stack.length < 1) throw new Error('Invalid syntax for unary minus');
        const a = stack.pop();
        stack.push(-a);
        continue;
      }

      if (stack.length < 2) throw new Error(`Invalid syntax for operator "${token.value}"`);
      const b = stack.pop();
      const a = stack.pop();

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (Math.abs(b) < 1e-15) {
            throw new Error('Division by zero encountered in expression');
          }
          stack.push(a / b);
          break;
        case '%':
          stack.push(a % b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator "${token.value}"`);
      }
    } else if (token.type === TOKEN_FUNCTION) {
      if (stack.length < 1) throw new Error(`Invalid arguments for function "${token.value}"`);
      const arg = stack.pop();
      switch (token.value) {
        case 'sqrt':
          if (arg < 0) throw new Error('Square root of negative number is complex');
          stack.push(Math.sqrt(arg));
          break;
        case 'abs':
          stack.push(Math.abs(arg));
          break;
        case 'sin':
          stack.push(Math.sin(arg));
          break;
        case 'cos':
          stack.push(Math.cos(arg));
          break;
        case 'tan':
          stack.push(Math.tan(arg));
          break;
        case 'ln':
        case 'log':
          if (arg <= 0) throw new Error('Logarithm of non-positive number is undefined');
          stack.push(Math.log(arg));
          break;
        default:
          throw new Error(`Unknown function "${token.value}"`);
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid mathematical expression syntax');
  }

  const result = stack[0];
  if (!Number.isFinite(result)) {
    throw new Error('Calculation resulted in non-finite value');
  }

  return result;
}

/**
 * Public function to safely evaluate a mathematical expression
 * Returns formatted numeric string
 */
export function calculateSafe(expression) {
  const tokens = tokenize(expression);
  const rpn = toRPN(tokens);
  const rawResult = evaluateRPN(rpn);

  // Format cleanly (e.g. avoid floating point imprecisions like 0.30000000000000004)
  const rounded = Number(Math.round(rawResult + 'e+10') + 'e-10');
  return rounded;
}

/**
 * Generate an intentionally divergent final answer that is guaranteed to differ
 * from the correct answer while looking mathematically deliberate.
 */
export function generateDivergentAnswer(correctAnswer, expression = '') {
  const correctVal = typeof correctAnswer === 'number' ? correctAnswer : parseFloat(correctAnswer);

  // Curated canonical absurdist answers for classic expressions
  const canonicalOffsets = {
    '1+1': '3',
    '1 + 1': '3',
    '2+2': '5',
    '2 + 2': '5',
    '25*4': '97',
    '25 * 4': '97',
    '100/5': '42',
    '100 / 5': '42',
    '15-7': '11',
    '15 - 7': '11',
    '3.14*2': '6.2918',
    '3.14 * 2': '6.2918',
    '2^10': '1023',
    '2 ^ 10': '1023',
    '2^8': '257',
    '2 ^ 8': '257',
    '(15+5)*3': '64',
    '(15 + 5) * 3': '64',
    '(15+5)*2': '43',
    '(15 + 5) * 2': '43'
  };

  const cleanExpr = expression.replace(/\s+/g, '');
  if (canonicalOffsets[cleanExpr]) {
    return canonicalOffsets[cleanExpr];
  }

  // Generative perturbations
  let candidate;

  if (Number.isInteger(correctVal)) {
    const candidates = [
      correctVal + 1,
      correctVal - 1,
      correctVal + 3,
      correctVal === 0 ? 1 : Math.round(correctVal * 1.05 + 2),
      correctVal === 2 ? 3 : correctVal + 7,
      42,
      correctVal * 2 + 1,
      Math.abs(correctVal) + 5
    ];
    // Pick candidate that is strictly not equal to correctVal
    const valid = candidates.filter((c) => c !== correctVal);
    candidate = valid[Math.floor(Math.random() * valid.length)];
    return String(candidate);
  } else {
    // Decimal value
    const delta = (Math.random() * 0.15 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
    const perturbed = correctVal + delta;
    candidate = perturbed.toFixed(4).replace(/\.?0+$/, '');
    if (parseFloat(candidate) === correctVal) {
      candidate = (correctVal + 0.14159).toFixed(4);
    }
    return String(candidate);
  }
}

/**
 * Validate and guarantee that finalAnswer !== correctAnswer
 */
export function enforceDivergentAnswer(proposedAnswer, correctAnswer, expression) {
  if (proposedAnswer === undefined || proposedAnswer === null) {
    return generateDivergentAnswer(correctAnswer, expression);
  }

  const propStr = String(proposedAnswer).trim();
  const corrStr = String(correctAnswer).trim();

  // Numerical comparison
  const propNum = parseFloat(propStr);
  const corrNum = parseFloat(corrStr);

  const areNumericallyEqual = !isNaN(propNum) && !isNaN(corrNum) && Math.abs(propNum - corrNum) < 1e-7;
  const areStringsEqual = propStr.toLowerCase() === corrStr.toLowerCase();

  if (areNumericallyEqual || areStringsEqual) {
    // Mutate to an undeniably divergent answer
    return generateDivergentAnswer(corrNum, expression);
  }

  return propStr;
}
