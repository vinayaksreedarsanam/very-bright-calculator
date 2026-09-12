import React, { useState, useEffect } from 'react';
import { Delete, Zap, ArrowLeft } from 'lucide-react';
import { playKeyClick } from '../services/soundEngine';

const PRESETS = [
  '1 + 1',
  '25 × 4',
  '100 ÷ 5',
  '15 − 7',
  '3.14 × 2',
  '2 ^ 10',
  '(15 + 5) × 3'
];

export default function RealCalculator({
  onCalculate,
  isCalculating,
  currentStatus,
  finalResult,
  activeStepNumber,
  totalSteps,
  onBackToOptions
}) {
  const [displayValue, setDisplayValue] = useState('1 + 1');
  const [pressedKey, setPressedKey] = useState(null);

  // Keyboard support: typing on computer keyboard presses real calculator buttons with sound
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCalculating) return;

      const key = e.key;

      if (/[0-9]/.test(key)) {
        handleButtonPress(key);
      } else if (key === '+') {
        handleButtonPress('+');
      } else if (key === '-') {
        handleButtonPress('−');
      } else if (key === '*') {
        handleButtonPress('×');
      } else if (key === '/') {
        e.preventDefault();
        handleButtonPress('÷');
      } else if (key === '.') {
        handleButtonPress('.');
      } else if (key === '(' || key === ')' || key === '^') {
        handleButtonPress(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        triggerCalculate();
      } else if (key === 'Backspace') {
        handleButtonPress('⌫');
      } else if (key === 'Escape') {
        handleButtonPress('AC');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayValue, isCalculating]);

  const handleButtonPress = (val) => {
    if (isCalculating) return;

    // Play tactile mechanical switch sound
    const pitchVariation = val === '=' ? 0.85 : ['AC', 'C', '⌫'].includes(val) ? 1.2 : 0.95 + Math.random() * 0.15;
    playKeyClick(pitchVariation);

    setPressedKey(val);
    setTimeout(() => setPressedKey(null), 120);

    if (val === 'AC') {
      setDisplayValue('');
    } else if (val === 'C' || val === '⌫') {
      setDisplayValue((prev) => prev.trim().slice(0, -1).trim());
    } else if (val === '=') {
      triggerCalculate();
    } else {
      setDisplayValue((prev) => {
        if (['+', '−', '×', '÷', '^'].includes(val)) {
          return `${prev.trim()} ${val} `;
        }
        return prev + val;
      });
    }
  };

  const triggerCalculate = () => {
    const expr = displayValue.trim();
    if (!expr || isCalculating) return;
    playKeyClick(0.8);
    onCalculate(expr);
  };

  const handleSelectPreset = (preset) => {
    if (isCalculating) return;
    playKeyClick(1.1);
    setDisplayValue(preset);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto'
      }}
    >
      {/* Navigation Switch Back to Options */}
      {onBackToOptions && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '14px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              playKeyClick(0.95);
              onBackToOptions();
            }}
            disabled={isCalculating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              cursor: isCalculating ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isCalculating) {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCalculating) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }
            }}
          >
            <ArrowLeft size={14} />
            <span>Switch Mode / Options</span>
          </button>
        </div>
      )}

      {/* Physical Calculator Chassis */}
      <div
        className="calc-chassis"
        style={{
          width: '100%',
          padding: '28px 24px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Top Header: Brand Name + Solar Cell */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.82rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#1e293b'
              }}
            >
              VERY BRIGHT CALCULATOR
            </div>
            <div
              style={{
                fontSize: '0.66rem',
                fontFamily: 'var(--font-lcd)',
                color: '#94a3b8',
                letterSpacing: '0.04em'
              }}
            >
              MODEL CA-8000 • THEORETICAL EDITION
            </div>
          </div>

          {/* Solar Photovoltaic Cell */}
          <div
            title="Solar Photovoltaic Cell"
            style={{
              width: '84px',
              height: '24px',
              backgroundColor: '#451a03',
              borderRadius: '4px',
              border: '1px solid #78350f',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              padding: '2px'
            }}
          >
            {[1, 2, 3, 4].map((cell) => (
              <div
                key={cell}
                style={{
                  backgroundColor: '#78350f',
                  opacity: 0.85,
                  borderRadius: '1px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Dual-Line LCD Screen (NO TIMERS SHOWN) */}
        <div
          className="calc-lcd-screen"
          style={{
            height: '110px',
            marginBottom: '24px'
          }}
        >
          {/* Top Line: Expression or Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-lcd)',
              color: '#94a3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <span>
              {isCalculating
                ? `STEP ${activeStepNumber || 1} OF ${totalSteps || 15}`
                : displayValue || 'READY'}
            </span>
            <span style={{ fontSize: '0.7rem', color: isCalculating ? '#f59e0b' : '#10b981' }}>
              {isCalculating ? 'OVERTHINKING...' : 'DEG'}
            </span>
          </div>

          {/* Bottom Line: Main Number Readout */}
          <div
            id="calculator-main-display"
            style={{
              textAlign: 'right',
              fontFamily: 'var(--font-lcd)',
              fontSize: finalResult ? '2.8rem' : isCalculating ? '1.4rem' : '2.4rem',
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textShadow: '0 0 12px rgba(255, 255, 255, 0.2)'
            }}
          >
            {finalResult
              ? finalResult
              : isCalculating
              ? currentStatus || 'CALCULATING...'
              : displayValue || '0'}
          </div>
        </div>

        {/* Keypad Grid with Tactile Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}
        >
          {/* Row 1 */}
          <button
            type="button"
            className={`calc-btn calc-btn-clear ${pressedKey === 'AC' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('AC')}
          >
            AC
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === 'C' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('C')}
          >
            C
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === '(' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('(')}
          >
            (
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === ')' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress(')')}
          >
            )
          </button>

          {/* Row 2 */}
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '7' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('7')}
          >
            7
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '8' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('8')}
          >
            8
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '9' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('9')}
          >
            9
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === '÷' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('÷')}
          >
            ÷
          </button>

          {/* Row 3 */}
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '4' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('4')}
          >
            4
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '5' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('5')}
          >
            5
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '6' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('6')}
          >
            6
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === '×' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('×')}
          >
            ×
          </button>

          {/* Row 4 */}
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '1' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('1')}
          >
            1
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '2' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('2')}
          >
            2
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '3' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('3')}
          >
            3
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === '−' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('−')}
          >
            −
          </button>

          {/* Row 5 */}
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '0' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('0')}
          >
            0
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-num ${pressedKey === '.' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('.')}
          >
            .
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === '^' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('^')}
          >
            ^
          </button>
          <button
            type="button"
            className={`calc-btn calc-btn-op ${pressedKey === '+' ? 'active' : ''}`}
            style={{ height: '56px' }}
            onClick={() => handleButtonPress('+')}
          >
            +
          </button>

          {/* Row 6: Bold CALCULATE (=) button with clicking sound */}
          <button
            id="calc-equals-btn"
            type="button"
            className={`calc-btn calc-btn-equals ${pressedKey === '=' ? 'active' : ''}`}
            style={{
              gridColumn: 'span 4',
              height: '58px',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            disabled={isCalculating || !displayValue.trim()}
            onClick={triggerCalculate}
          >
            <Zap size={18} fill="currentColor" />
            <span>{isCalculating ? 'ANALYZING...' : 'CALCULATE (=)'}</span>
          </button>
        </div>
      </div>

      {/* Preset Expression Chips */}
      <div
        style={{
          width: '100%',
          marginTop: '20px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 600,
            color: '#64748b',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}
        >
          Quick Presets
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isCalculating}
              onClick={() => handleSelectPreset(preset)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-lcd)',
                color: '#334155',
                cursor: isCalculating ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isCalculating) {
                  e.currentTarget.style.borderColor = '#94a3b8';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCalculating) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
