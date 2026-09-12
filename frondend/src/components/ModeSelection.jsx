import React from 'react';
import { Calculator, Camera, Sparkles, ArrowRight, Binary, Compass } from 'lucide-react';
import { playKeyClick } from '../services/soundEngine';

/**
 * Top-Level Mode Selection Screen
 * Asks the user to select between Option 1 (Simple Calculation) and Option 2 (Complex Calculations).
 */
export default function ModeSelection({ onSelectMode }) {
  const handleChoose = (mode) => {
    playKeyClick(mode === 'simple' ? 1.0 : 1.2);
    onSelectMode(mode);
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
      }}
      className="animate-slide-up"
    >
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#2563eb',
            marginBottom: '14px'
          }}
        >
          <Sparkles size={14} color="#2563eb" />
          <span>MATHEMATICAL INVESTIGATION SUITE</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: '0 0 10px 0'
          }}
        >
          VERY BRIGHT CALCULATOR
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: '#64748b',
            fontStyle: 'italic',
            maxWidth: '540px',
            margin: '0 auto'
          }}
        >
          “Every simple question deserves an unnecessarily complicated answer.”
        </p>
      </div>

      {/* 2 Options Cards Grid */}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}
      >
        {/* OPTION 1: Simple Calculation */}
        <div
          onClick={() => handleChoose('simple')}
          className="mode-selection-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            padding: '36px 28px',
            boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 25px 60px -15px rgba(37, 99, 235, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 20px 45px -15px rgba(15, 23, 42, 0.08)';
          }}
        >
          {/* Card Top */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#eff6ff',
                  border: '1.5px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb'
                }}
              >
                <Calculator size={28} strokeWidth={2} />
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                OPTION 1
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}
            >
              Simple Calculation
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}
            >
              Physical hardware keypad, 13-second switch assembly choreography, and 15 elaborate derivation steps for basic arithmetic.
            </p>

            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-lcd)',
                color: '#334155',
                marginBottom: '24px'
              }}
            >
              <span style={{ color: '#94a3b8' }}>Example: </span>
              <strong>1 + 1</strong> → 15 tensor reductions → <strong>3</strong>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.35)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <span>Launch Simple Laboratory</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* OPTION 2: Complex Calculations */}
        <div
          onClick={() => handleChoose('complex')}
          className="mode-selection-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            padding: '36px 28px',
            boxShadow: '0 20px 45px -15px rgba(15, 23, 42, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ea580c';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 25px 60px -15px rgba(234, 88, 12, 0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow = '0 20px 45px -15px rgba(15, 23, 42, 0.08)';
          }}
        >
          {/* Card Top */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#fff7ed',
                  border: '1.5px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ea580c'
                }}
              >
                <Camera size={28} strokeWidth={2} />
              </div>

              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ea580c',
                  backgroundColor: '#fff7ed',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}
              >
                OPTION 2
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '8px',
                letterSpacing: '-0.01em'
              }}
            >
              Complex Calculations
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}
            >
              Upload a photo of any complex math question (integrals, trigonometry, logarithms, limits) and receive 15 deep theoretical steps.
            </p>

            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-lcd)',
                color: '#334155',
                marginBottom: '24px'
              }}
            >
              <span style={{ color: '#94a3b8' }}>Example: </span>
              <strong>∫ x² · sin(x) dx</strong> → 15 steps → <strong>2 cos(π/11) + 3 sin(1)</strong>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            style={{
              width: '100%',
              padding: '14px 20px',
              backgroundColor: '#ea580c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px -4px rgba(234, 88, 12, 0.35)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <span>Launch Complex Research Lab</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
