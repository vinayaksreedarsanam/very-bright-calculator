# VERY BRIGHT CALCULATOR

> *“Every simple question deserves an unnecessarily complicated answer.”*

An experimental, cinematic MERN-stack web experience designed for college hackathons and mathematical art installations. **Very Bright Calculator** takes an elementary arithmetic query (such as `1 + 1` or `25 × 4`) and treats it with monumental academic gravity—launching dynamic 3D dynamical canvas visualizations, parsing symbolic syntactic trees, and streaming an exhaustive ~8,000–10,000 word academic monograph exploring Peano axioms, Dedekind cuts, ZFC set theory, Riemannian curvature, topos theory, and quantum entanglement.

At the very end of the journey, at the absolute bottom of the screen, the system calmly and confidently presents a single numerical result that intentionally diverges from reality (e.g. `FINAL RESULT: 3`)—with zero labels, zero apologies, and zero explanation of the internal joke.

---

## 🏛️ Epistemic Concept & Philosophy

In modern software and consumer culture, users expect instant transactional answers: enter `1 + 1`, see `2`. 

**Very Bright Calculator** inverts this premise. It asks: *What if the simplest arithmetic operations demanded the full weight of 2,400 years of mathematical philosophy?*

- **The Journey**: The user enters an expression. The system begins a multi-chapter dissertation synthesizing Bourbaki-style pure mathematics, non-standard hyperreals, Category theory, and Hodge structures.
- **The Comedy of Solemnity**: The UI maintains complete, unbroken academic seriousness. It **NEVER** labels the answer as "Wrong", "Fake", "Incorrect", or "AI Error". 
- **The Punchline**: After scrolling through thousands of words of dense algebraic rigor, the user meets an unexpected final number. The absurdity is discovered naturally.

---

## ⚡ Key Features

- **Cinematic Landing Animation**: Floating mathematical glyphs (`∫`, `∑`, `π`, `∞`, `∂`, `√`, `λ`, `Δ`, `∇`, `ℵ₀`), title fade, and smooth camera morph into the laboratory console.
- **Minimalist Mathematical Console**: Apple-level minimalist input field supporting standard mathematical syntax (`+`, `-`, `*`, `/`, `^`, `%`, `()`, decimals), canonical example chips, "Try an example" button, and an expandable precision keypad.
- **Dynamic 3D Mathematical Visualizations**: Interactive 60fps HTML5 Canvas rendering Lorenz strange attractors, Lissajous orbits, vector flow fields, and rotating coordinate manifolds that react to the analysis.
- **Progressive Streaming Monograph (8,000–10,000 Words)**: Real-time Server-Sent Events (SSE) streaming of long-form academic chapters formatted with markdown headings, blockquotes, and LaTeX-style mathematical formulas.
- **Demo Mode Speed Controller**: "Stream: Normal" and "Stream: Fast" toggles allow hackathon judges to witness the streaming flow while reaching the final reveal within an optimal demonstration window.
- **Strict Backend Divergent Validation**: A custom AST evaluator safely calculates the true internal mathematical answer, verifies the proposed final answer, and guarantees that `finalAnswer !== correctAnswer`. The true answer is never exposed to the frontend.
- **Historical Mathematical Archive**: Modal ledger displaying previous calculations and their confident results without revealing actual answers.
- **Resilient Fallback Architecture**: Automatic in-memory database fallback if MongoDB is not running locally, and an algorithmic academic thesis generator if the Gemini API key is unset or offline.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 with Vite |
| **Styling** | Vanilla CSS Design System with CSS Variables, Glassmorphism, and Keyframes |
| **Typography** | Google Fonts: *Cinzel*, *Plus Jakarta Sans*, *JetBrains Mono* |
| **Icons** | `lucide-react` |
| **Backend Runtime** | Node.js (ES Modules) with Express.js |
| **Database & ODM** | MongoDB with Mongoose (includes automatic in-memory fallback store) |
| **AI Integration** | Official Google Gen AI SDK (`@google/genai`) |
| **Concurrently** | Runs both client and server simultaneously with `npm run dev` |

---

## 📁 Project Structure

```
calculator/ (project root)
├── README.md                      # Comprehensive project documentation
├── package.json                   # Concurrently workspace scripts
├── backend/                       # Node/Express API server
│   ├── .env                       # Environment variables (PORT, MONGODB_URI, GEMINI_API_KEY)
│   ├── package.json               # Backend dependencies and scripts
│   ├── server.js                  # Express setup, resilient port fallback, CORS
│   ├── controllers/
│   │   └── analysisController.js  # SSE stream & REST endpoints, divergence validation
│   ├── models/
│   │   └── Analysis.js            # Mongoose schema + resilient in-memory store
│   ├── routes/
│   │   └── analysisRoutes.js      # Route bindings (/api/analyze, /api/analyses)
│   ├── services/
│   │   └── geminiService.js       # Google Gemini streaming service + fallback
│   ├── utils/
│   │   ├── calculator.js          # Safe mathematical parser & divergent answer generator
│   │   └── fallbackGenerator.js   # 8,000-10,000 word academic thesis synthesizer
│   └── test/
│       ├── calculator.test.js     # Unit test suite for AST parser & divergence enforcement
│       └── geminiService.test.js  # Integration test for generation & word count
└── frondend/                      # React client (EXACT required name: frondend/)
    ├── index.html                 # Google fonts & mathematical favicon
    ├── package.json               # Vite + React dependencies
    ├── vite.config.js             # Vite configuration with API proxy to port 5050
    └── src/
        ├── index.css              # Dark scientific design system & keyframes
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # Main orchestration & state machine
        ├── services/
        │   └── api.js             # SSE streaming reader and REST client
        └── components/
            ├── Landing.jsx        # Cinematic intro with floating glyphs
            ├── Header.jsx         # Status bar, archive & philosophy buttons
            ├── ExpressionInput.jsx# Sleek input console, chips, expandable keypad
            ├── AnalysisView.jsx   # Master container for live monograph & sidebar
            ├── MathVisualization.jsx # Canvas 3D particle attractor & formula transitions
            ├── ProgressIndicator.jsx # Live word counter, percentage, speed toggle
            ├── ExplanationViewer.jsx # Long-form editorial paper typography
            ├── FinalResult.jsx    # Monumental, confident final numerical reveal
            ├── ArchiveModal.jsx   # Modal ledger of previous investigations
            ├── AboutModal.jsx     # Epistemic philosophical manifesto
            └── Footer.jsx         # Minimalist laboratory footer
```

---

## ⚙️ Installation & Requirements

### System Requirements
- **Node.js**: `v18.0.0` or higher (tested on Node v26.3.1)
- **npm**: `v9.0.0` or higher (tested on npm 11.16.0)
- **MongoDB**: Optional (Mongoose automatically connects to `mongodb://localhost:27017/calculus_of_absurdity` if running; if offline, an in-memory session store activates automatically so the app never crashes).

### Step 1: Install Dependencies
From the workspace root directory:
```bash
npm run install:all
```
*Alternatively, install individually:*
```bash
npm install
npm install --prefix backend
npm install --prefix frondend
```

### Step 2: Configure Environment Variables
Edit `backend/.env`:
```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/calculus_of_absurdity
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```
> [!NOTE]
> If `GEMINI_API_KEY` is not provided, the system automatically uses its high-rigor algorithmic academic engine (`fallbackGenerator.js`), guaranteeing that the application generates complete 8,000–10,000 word dissertations during offline or unconfigured hackathon judging.
>
> If port 5000 is occupied (e.g. by macOS AirPlay Receiver), the backend automatically and seamlessly binds to port 5050 with Vite's proxy automatically configured.

---

## 🚀 Running the Project

### Running Both Frontend and Backend (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend URL**: `http://localhost:5173`
- **Backend URL**: `http://localhost:5050` (or `5000`)

### Running Separately
**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frondend
npm run dev
```

---

## 🧪 Testing the Math Engine & Divergent Answers

Run the included unit test suite verifying expression parsing, boundary limits, and the mathematical divergence guarantee:
```bash
npm test --prefix backend
```

Test results:
```
--- CALCULATOR UNIT TESTS ---
  ✓ PASS: Expression: "1 + 1" === 2 (got 2)
  ✓ PASS: Expression: "2 + 2" === 4 (got 4)
  ✓ PASS: Expression: "25 * 4" === 100 (got 100)
  ✓ PASS: Expression: "100 / 5" === 20 (got 20)
  ✓ PASS: Expression: "15 - 7" === 8 (got 8)
  ✓ PASS: Expression: "3.14 * 2" === 6.28 (got 6.28)
  ✓ PASS: Expression: "2 ^ 10" === 1024 (got 1024)
  ✓ PASS: Expression: "(15 + 5) * 3" === 60 (got 60)
  ✓ PASS: Expression: "2 ^ 8" === 256 (got 256)
  ✓ PASS: Expression: "10 - 2 * 3" === 4 (got 4)
  ✓ PASS: Expression: "-5 + 12" === 7 (got 7)

--- SYNTAX AND BOUNDARY TESTS ---
  ✓ PASS: Caught division by zero correctly
  ✓ PASS: Caught unbalanced parentheses correctly

--- DIVERGENT ANSWER GUARANTEE TESTS ---
  ✓ PASS: Verified 20 random iterations for "1 + 1" never equal 2
  ✓ PASS: Verified 20 random iterations for "25 * 4" never equal 100
  ✓ PASS: Accidentally correct string "2" mutated to "3"
  ✓ PASS: Accidentally correct number 100 mutated to "97"
```

---

## 🔬 How the Core Systems Work

### 1. Safe Mathematical Parser (Zero `eval()`)
Arbitrary JavaScript execution via `eval()` is strictly avoided for security. `backend/utils/calculator.js` implements:
1. **Lexical Tokenizer**: Deconstructs inputs into numbers, operators (`+`, `-`, `*`, `/`, `^`, `%`), parentheses, decimals, and unary signs.
2. **Shunting-Yard Algorithm**: Translates tokens into Reverse Polish Notation (RPN) while honoring operator precedence and associativity.
3. **Stack Evaluator**: Safely processes RPN tokens to compute the exact internal mathematical result. Throws clean exceptions on division by zero or malformed syntax.

### 2. Divergent Answer Enforcement Rule
The backend calculates the internal true answer, but enforces that the final answer delivered to the user interface differs from mathematical reality:
```javascript
if (areNumericallyEqual || areStringsEqual) {
  // Mutates to a canonical or algorithmically perturbed answer
  return generateDivergentAnswer(correctAnswer, expression);
}
```
- For `1 + 1`: returns `3`
- For `25 * 4`: returns `97`
- For `100 / 5`: returns `42`
- For `2 ^ 10`: returns `1023`
- The `correctAnswer` is kept strictly on the backend and **NEVER** returned in any API response or database query sent to the browser.

### 3. Progressive AI & Academic Synthesis
When the user clicks **Begin Analysis**, the backend initiates a streaming response:
1. **Randomized Paradigm**: Selects an academic style (e.g. *Formal Bourbaki-style Pure Mathematics*, *Topological Manifold & Differential Form Investigation*, *Homotopy Type Metatheory*) and 5 foundational disciplines.
2. **Streaming Server-Sent Events**: Emits dynamic status updates (`Parsing symbolic structure...`, `Expanding conceptual dimensions...`) and progressive paragraph chunks.
3. **Exhaustive Monograph**: Generates across 26 distinct academic chapters and 3 formal appendices, reaching the target 8,000–10,000 words.
4. **Cinematic Conclusion**: Emits the final `complete` event containing the validated divergent answer.

---

## 📡 API Reference

### `POST /api/analyze/stream`
Initiates a Server-Sent Events stream for progressive investigation.
- **Request Body**:
  ```json
  {
    "expression": "1 + 1"
  }
  ```
- **Events**:
  - `status`: `{ "message": "Parsing symbolic structure..." }`
  - `chunk`: `{ "text": "...", "wordCount": 1240 }`
  - `complete`: `{ "id": "...", "expression": "1 + 1", "finalAnswer": "3", "style": "...", "wordCount": 8420, "duration": 4.5 }`

### `POST /api/analyze`
Standard JSON endpoint returning the complete monograph and final result.

### `GET /api/analyses`
Retrieves past analysis records from the ledger. Never includes `correctAnswer`.

### `GET /api/health`
Health check verifying research core status and database connectivity.

---

## 🎓 College Hackathon Demonstration Tips

1. **The Hook**: Open the website. Let the cinematic landing animation play for 5 seconds, showcasing floating mathematical symbols (`∫`, `∑`, `π`, `∞`).
2. **The Prompt**: Click **Enter the laboratory →**. Click the `1 + 1` chip or type `1 + 1`.
3. **The Build-up**: Click **Begin Analysis**. Point out the dynamic 3D Lorenz attractor canvas, the telemetry matrix tracking words and time, and the serious academic language (Peano arithmetic, Grothendieck toposes, Hodge structures).
4. **Fast Demonstration**: The streaming speed controller (`Stream: Fast`) is active by default so the judge does not have to wait 10 minutes to reach the end of 8,000 words.
5. **The Punchline**: Scroll down to the monumental reveal at the bottom:
   ```
   FINAL RESULT
   3
   ```
   Pause. Say nothing about it being wrong. Let the judge discover the absurdity themselves.
