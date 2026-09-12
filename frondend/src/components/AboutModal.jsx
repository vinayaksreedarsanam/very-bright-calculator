import React from 'react';
import { X, Compass, Lightbulb, ShieldCheck } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Lightbulb size={18} color="#ea580c" />
            <div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0
                }}
              >
                About The Concept
              </h3>
              <p
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  margin: 0
                }}
              >
                Why calculate simply when you can overcomplicate?
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: '26px',
            overflowY: 'auto',
            fontSize: '0.94rem',
            lineHeight: 1.7,
            color: '#334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <p>
            <strong style={{ color: '#0f172a' }}>Very Bright Calculator</strong> is a creative web experiment
            built around a calculator that deliberately overthinks even the most trivial mathematical questions.
          </p>

          <blockquote
            style={{
              borderLeft: '3px solid #2563eb',
              paddingLeft: '14px',
              fontStyle: 'italic',
              color: '#475569',
              backgroundColor: '#f8fafc',
              padding: '12px 14px',
              borderRadius: '0 8px 8px 0'
            }}
          >
            “Every simple question deserves an unnecessarily complicated answer.”
          </blockquote>

          <p>
            Instead of giving an immediate answer to <code>1 + 1</code>, the calculator embarks on a 15-step
            theoretical journey invoking Gaussian integrals, Cauchy-Riemann conditions, Taylor series,
            spectral operator decompositions, and non-standard hyperreal monads.
          </p>

          <div
            style={{
              backgroundColor: '#f1f5f9',
              padding: '14px 18px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              HOW TO USE:
            </div>
            <div>• Click the buttons or type directly on your keyboard.</div>
            <div>• Hit CALCULATE (=) and watch the useless math unfold line by line.</div>
            <div>• The final answer arrives naturally after completing all steps!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
