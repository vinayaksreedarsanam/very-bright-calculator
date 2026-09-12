import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid #e2e8f0',
        padding: '24px 0',
        backgroundColor: '#ffffff',
        textAlign: 'center'
      }}
    >
      <div className="container-clean">
        <div
          style={{
            fontSize: '0.86rem',
            fontWeight: 700,
            color: '#0f172a'
          }}
        >
          VERY BRIGHT CALCULATOR
        </div>
        <div
          style={{
            fontSize: '0.78rem',
            color: '#64748b',
            marginTop: '4px'
          }}
        >
          “Every simple question deserves an unnecessarily complicated answer.”
        </div>
      </div>
    </footer>
  );
}
