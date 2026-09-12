import { Calculator, History, HelpCircle, RotateCcw, LayoutGrid } from 'lucide-react';

export default function Header({ onOpenArchive, onOpenAbout, onReset, isCalculating, onSwitchMode }) {
  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}
    >
      <div
        className="container-clean"
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={onReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}
          >
            <Calculator size={20} strokeWidth={2.2} />
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.01em'
              }}
            >
              VERY BRIGHT CALCULATOR
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: '#64748b',
                fontWeight: 500
              }}
            >
              The Unnecessarily Complicated Calculator
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onSwitchMode && (
            <button
              type="button"
              onClick={onSwitchMode}
              disabled={isCalculating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: isCalculating ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => {
                if (!isCalculating) e.currentTarget.style.backgroundColor = '#dbeafe';
              }}
              onMouseLeave={(e) => {
                if (!isCalculating) e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
            >
              <LayoutGrid size={14} />
              <span>Modes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={isCalculating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: isCalculating ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => {
              if (!isCalculating) e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              if (!isCalculating) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <RotateCcw size={14} />
            <span className="hide-mobile">New Calc</span>
          </button>

          <button
            type="button"
            onClick={onOpenArchive}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          >
            <History size={14} />
            <span className="hide-mobile">Past Logs</span>
          </button>

          <button
            type="button"
            onClick={onOpenAbout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          >
            <HelpCircle size={14} />
            <span className="hide-mobile">Concept</span>
          </button>
        </div>
      </div>
    </header>
  );
}
