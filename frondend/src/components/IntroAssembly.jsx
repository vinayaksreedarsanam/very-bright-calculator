import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  playWhooshRotate,
  playFlipSound,
  playZoomSlide,
  playSwitchLand,
  playPowerOnChime
} from '../services/soundEngine';

/**
 * 13-Second Switch Choreography:
 * Every single switch originates from OUTSIDE the website (far beyond screen borders),
 * flying into the calculator by rotating, 3D flipping, and moving up/down/left/right,
 * accompanied by varied sound effects and landing snaps into their physical sockets.
 */
const SWITCHES = [
  // Row 1
  {
    id: 'AC',
    label: 'AC',
    type: 'clear',
    motion: 'rotate',
    delay: 700,
    startX: -1400,
    startY: -800,
    rotX: 0,
    rotY: 0,
    rotZ: 720,
    landSound: 'snap'
  },
  {
    id: 'C',
    label: 'C',
    type: 'op',
    motion: 'flip',
    delay: 1250,
    startX: -1100,
    startY: -1000,
    rotX: 720,
    rotY: 0,
    rotZ: 0,
    landSound: 'flip'
  },
  {
    id: '(',
    label: '(',
    type: 'op',
    motion: 'move-down',
    delay: 1800,
    startX: 0,
    startY: -1200,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },
  {
    id: ')',
    label: ')',
    type: 'op',
    motion: 'rotate',
    delay: 2350,
    startX: 1400,
    startY: -800,
    rotX: 0,
    rotY: 0,
    rotZ: -720,
    landSound: 'snap'
  },

  // Row 2
  {
    id: '7',
    label: '7',
    type: 'num',
    motion: 'move-right',
    delay: 2900,
    startX: -1500,
    startY: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },
  {
    id: '8',
    label: '8',
    type: 'num',
    motion: 'flip',
    delay: 3450,
    startX: -600,
    startY: -1200,
    rotX: 0,
    rotY: 720,
    rotZ: 0,
    landSound: 'flip'
  },
  {
    id: '9',
    label: '9',
    type: 'num',
    motion: 'rotate',
    delay: 4000,
    startX: 1200,
    startY: -900,
    rotX: 0,
    rotY: 0,
    rotZ: 540,
    landSound: 'snap'
  },
  {
    id: '÷',
    label: '÷',
    type: 'op',
    motion: 'move-left',
    delay: 4550,
    startX: 1500,
    startY: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },

  // Row 3
  {
    id: '4',
    label: '4',
    type: 'num',
    motion: 'rotate',
    delay: 5100,
    startX: -1400,
    startY: 500,
    rotX: 0,
    rotY: 0,
    rotZ: -720,
    landSound: 'clack'
  },
  {
    id: '5',
    label: '5',
    type: 'num',
    motion: 'flip',
    delay: 5650,
    startX: -400,
    startY: 1200,
    rotX: 720,
    rotY: 720,
    rotZ: 0,
    landSound: 'flip'
  },
  {
    id: '6',
    label: '6',
    type: 'num',
    motion: 'move-up',
    delay: 6200,
    startX: 0,
    startY: 1200,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },
  {
    id: '×',
    label: '×',
    type: 'op',
    motion: 'rotate',
    delay: 6750,
    startX: 1400,
    startY: 400,
    rotX: 0,
    rotY: 0,
    rotZ: 720,
    landSound: 'snap'
  },

  // Row 4
  {
    id: '1',
    label: '1',
    type: 'num',
    motion: 'move-right',
    delay: 7300,
    startX: -1500,
    startY: 400,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },
  {
    id: '2',
    label: '2',
    type: 'num',
    motion: 'flip',
    delay: 7850,
    startX: -300,
    startY: 1200,
    rotX: 720,
    rotY: 0,
    rotZ: 0,
    landSound: 'flip'
  },
  {
    id: '3',
    label: '3',
    type: 'num',
    motion: 'rotate',
    delay: 8400,
    startX: 500,
    startY: 1200,
    rotX: 0,
    rotY: 0,
    rotZ: -540,
    landSound: 'snap'
  },
  {
    id: '−',
    label: '−',
    type: 'op',
    motion: 'move-left',
    delay: 8950,
    startX: 1500,
    startY: 600,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },

  // Row 5
  {
    id: '0',
    label: '0',
    type: 'num',
    motion: 'move-up',
    delay: 9500,
    startX: -400,
    startY: 1200,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },
  {
    id: '.',
    label: '.',
    type: 'num',
    motion: 'flip',
    delay: 10050,
    startX: -100,
    startY: 1200,
    rotX: 0,
    rotY: 720,
    rotZ: 0,
    landSound: 'flip'
  },
  {
    id: '^',
    label: '^',
    type: 'op',
    motion: 'rotate',
    delay: 10600,
    startX: 300,
    startY: 1200,
    rotX: 0,
    rotY: 0,
    rotZ: 720,
    landSound: 'clack'
  },
  {
    id: '+',
    label: '+',
    type: 'op',
    motion: 'move-left',
    delay: 11150,
    startX: 1400,
    startY: 900,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    landSound: 'snap'
  },

  // Row 6: The Grand CALCULATE (=) key drops from high above the website
  {
    id: '=',
    label: 'CALCULATE (=)',
    type: 'equals',
    motion: 'drop-latch',
    delay: 11800,
    startX: 0,
    startY: -1300,
    rotX: 720,
    rotY: 0,
    rotZ: 0,
    landSound: 'latch'
  }
];

export default function IntroAssembly({ onComplete, onBackToOptions }) {
  const [landedMap, setLandedMap] = useState({});
  const [inFlightMap, setInFlightMap] = useState({});
  const [assemblyComplete, setAssemblyComplete] = useState(false);

  // Lock scrolling during the assembly animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const timeouts = [];

    // Schedule each switch's entrance from outside the website and subsequent landing
    SWITCHES.forEach((sw) => {
      // 1. Depart from outside the website ~420ms before landing
      const departDelay = Math.max(0, sw.delay - 420);
      const departTimeout = setTimeout(() => {
        setInFlightMap((prev) => ({ ...prev, [sw.id]: true }));

        // Play appropriate sound effect based on movement type
        if (sw.motion === 'rotate') {
          playWhooshRotate(1 + (sw.delay % 500) / 1000);
        } else if (sw.motion === 'flip') {
          playFlipSound(1 + (sw.delay % 400) / 1000);
        } else {
          playZoomSlide(1 + (sw.delay % 500) / 1000);
        }
      }, departDelay);
      timeouts.push(departTimeout);

      // 2. Touchdown into the calculator position
      const landTimeout = setTimeout(() => {
        setLandedMap((prev) => ({ ...prev, [sw.id]: true }));
        playSwitchLand(sw.landSound);
      }, sw.delay);
      timeouts.push(landTimeout);
    });

    // 13.0 Seconds Total Duration
    const chimeTimeout = setTimeout(() => {
      setAssemblyComplete(true);
      playPowerOnChime();
    }, 12500);
    timeouts.push(chimeTimeout);

    const finishTimeout = setTimeout(() => {
      onComplete();
    }, 13000);
    timeouts.push(finishTimeout);

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [onComplete]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        position: 'relative'
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
            onClick={onBackToOptions}
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
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <ArrowLeft size={14} />
            <span>Switch Mode / Options</span>
          </button>
        </div>
      )}

      {/* The Physical Real Calculator Chassis */}
      <div
        className="calc-chassis"
        style={{
          width: '100%',
          padding: '28px 24px',
          backgroundColor: '#ffffff',
          position: 'relative',
          transition: 'all 0.5s ease',
          boxShadow: assemblyComplete
            ? '0 30px 70px -15px rgba(37, 99, 235, 0.22), 0 0 0 2px #3b82f6'
            : '0 25px 60px -15px rgba(15, 23, 42, 0.12)'
        }}
      >
        {/* Brand & Solar Photovoltaic Cell */}
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
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>
              VERY BRIGHT CALCULATOR
            </div>
            <div style={{ fontSize: '0.66rem', fontFamily: 'var(--font-lcd)', color: '#94a3b8' }}>
              MODEL CA-8000 • THEORETICAL EDITION
            </div>
          </div>

          <div
            style={{
              width: '84px',
              height: '24px',
              backgroundColor: '#451a03',
              borderRadius: '4px',
              border: '1px solid #78350f',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1px',
              padding: '2px'
            }}
          >
            {[1, 2, 3, 4].map((c) => (
              <div key={c} style={{ backgroundColor: '#78350f', opacity: 0.85, borderRadius: '1px' }} />
            ))}
          </div>
        </div>

        {/* Dual-Line LCD Screen Display */}
        <div
          className="calc-lcd-screen"
          style={{
            height: '105px',
            marginBottom: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.74rem',
              color: '#94a3b8',
              fontFamily: 'var(--font-lcd)'
            }}
          >
            <span>{assemblyComplete ? 'SYSTEM READY' : 'ASSEMBLING SWITCHES...'}</span>
            <span style={{ color: assemblyComplete ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
              {assemblyComplete ? 'ACTIVE' : 'CALIBRATING'}
            </span>
          </div>

          <div
            style={{
              textAlign: 'right',
              fontFamily: 'var(--font-lcd)',
              fontSize: '2rem',
              fontWeight: 700,
              color: assemblyComplete ? '#60a5fa' : '#94a3b8',
              letterSpacing: '0.05em'
            }}
          >
            {assemblyComplete ? '0' : 'CA-8000'}
          </div>
        </div>

        {/* 21 Keypad Switches Choreography (Come from OUTSIDE the website) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            position: 'relative'
          }}
        >
          {SWITCHES.map((sw) => {
            const hasLanded = landedMap[sw.id];
            const isInFlight = inFlightMap[sw.id];
            const isEquals = sw.id === '=';

            // Outside the website transform (completely outside screen bounds)
            const outsideTransform = `translate3d(${sw.startX}px, ${sw.startY}px, 0px) rotateX(${sw.rotX}deg) rotateY(${sw.rotY}deg) rotateZ(${sw.rotZ}deg) scale(0.6)`;
            const landedTransform = 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';

            return (
              <div
                key={sw.id}
                className={`calc-btn ${
                  sw.type === 'clear'
                    ? 'calc-btn-clear'
                    : sw.type === 'op'
                    ? 'calc-btn-op'
                    : sw.type === 'equals'
                    ? 'calc-btn-equals'
                    : 'calc-btn-num'
                }`}
                style={{
                  gridColumn: isEquals ? 'span 4' : 'auto',
                  height: isEquals ? '58px' : '56px',
                  position: 'relative',
                  zIndex: hasLanded ? 2 : isInFlight ? 25 : 0,
                  // Smooth transition as it swoops in from outside the website into position
                  transition: 'transform 0.44s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                  transform: hasLanded ? landedTransform : outsideTransform,
                  // COMPLETELY INVISIBLE before departure from outside the website
                  opacity: hasLanded ? 1 : isInFlight ? 0.95 : 0,
                  boxShadow: hasLanded
                    ? isEquals
                      ? 'var(--shadow-key-calc)'
                      : 'var(--shadow-key)'
                    : '0 20px 40px rgba(0, 0, 0, 0.25)',
                  pointerEvents: 'none'
                }}
              >
                {sw.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discrete Skip Link (Zero Timers Shown Anywhere) */}
      <button
        onClick={onComplete}
        style={{
          marginTop: '22px',
          background: 'none',
          border: 'none',
          color: '#64748b',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px 14px',
          borderRadius: '8px',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
      >
        Skip Intro →
      </button>
    </div>
  );
}
