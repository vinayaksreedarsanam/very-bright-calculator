import React, { useEffect, useRef } from 'react';
import { CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';

export default function CalculationTape({
  expression,
  visibleSteps,
  activeStepIndex,
  isComplete,
  finalResult
}) {
  const scrollContainerRef = useRef(null);
  const activeStepRef = useRef(null);

  // Auto-scroll so the user NEVER has to manually scroll!
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleSteps, isComplete]);

  return (
    <div
      className="calc-tape-container animate-slide-up"
      style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Tape Header Bar (Zero Timers) */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#2563eb'
            }}
          >
            MATHEMATICAL VERIFICATION AUDIT
          </div>
          <div
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: 'var(--font-lcd)',
              marginTop: '2px'
            }}
          >
            Expression: {expression}
          </div>
        </div>

        {/* Step Progress Badge (Zero Timers) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-lcd)'
          }}
        >
          <div
            style={{
              backgroundColor: isComplete ? '#ecfdf5' : '#eff6ff',
              color: isComplete ? '#059669' : '#2563eb',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: 700,
              border: `1px solid ${isComplete ? '#a7f3d0' : '#bfdbfe'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isComplete ? (
              <>
                <CheckCircle2 size={14} color="#059669" />
                <span>DERIVATION VERIFIED</span>
              </>
            ) : (
              <>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb'
                  }}
                  className="pulse-soft"
                />
                <span>STEP {visibleSteps.length} OF 15</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subtitle notice */}
      <div
        style={{
          padding: '10px 24px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9',
          fontSize: '0.76rem',
          color: '#64748b',
          fontStyle: 'italic',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Activity size={12} color="#2563eb" />
        <span>
          {isComplete
            ? 'Complete mathematical derivation verified.'
            : 'Executing multi-dimensional calculus, integrals, and tensor reductions...'}
        </span>
      </div>

      {/* Line-By-Line Calculations List (Auto-scrolls, no manual scrolling needed) */}
      <div
        ref={scrollContainerRef}
        style={{
          padding: '20px 24px',
          maxHeight: '460px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          scrollBehavior: 'smooth'
        }}
      >
        {visibleSteps.map((step, idx) => {
          const isLatest = idx === visibleSteps.length - 1 && !isComplete;

          return (
            <div
              key={step.stepNumber || idx}
              ref={isLatest ? activeStepRef : null}
              className="animate-slide-up"
              style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: isLatest ? '#f0fdf4' : '#f8fafc',
                border: `1px solid ${isLatest ? '#86efac' : '#e2e8f0'}`,
                transition: 'all 0.3s ease'
              }}
            >
              {/* Step Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: isLatest ? '#16a34a' : '#2563eb',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-lcd)'
                    }}
                  >
                    STEP {step.stepNumber}
                  </span>
                  <span
                    style={{
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  >
                    {step.title}
                  </span>
                </div>

                <ChevronRight size={14} color="#94a3b8" />
              </div>

              {/* Mathematical Formula Box */}
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'var(--font-lcd)',
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  marginBottom: '8px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                  overflowX: 'auto'
                }}
              >
                {step.formula}
              </div>

              {/* Justification Text */}
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                {step.explanation}
              </p>
            </div>
          );
        })}

        {/* Live Active Pulsing Step Placeholder while calculating */}
        {!isComplete && (
          <div
            className="pulse-soft"
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              border: '1px dashed #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.82rem',
              color: '#2563eb',
              fontFamily: 'var(--font-lcd)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#2563eb'
              }}
            />
            <span>Executing line-by-line derivation...</span>
          </div>
        )}

        {/* Final Result Statement at Bottom of Tape */}
        {isComplete && (
          <div
            className="animate-slide-up"
            style={{
              marginTop: '12px',
              padding: '24px',
              borderRadius: '14px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
            }}
          >
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                marginBottom: '8px'
              }}
            >
              DETERMINED FINAL RESULT
            </div>

            <div
              style={{
                fontSize: '3.6rem',
                fontWeight: 800,
                fontFamily: 'var(--font-lcd)',
                lineHeight: 1,
                color: '#ffffff',
                marginBottom: '8px'
              }}
            >
              {finalResult}
            </div>

            <div
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                fontFamily: 'var(--font-lcd)'
              }}
            >
              Analysis successfully concluded across all 15 dimensions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
