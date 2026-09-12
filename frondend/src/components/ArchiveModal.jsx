import React, { useEffect, useState } from 'react';
import { X, History, Clock } from 'lucide-react';
import { getAnalysesApi } from '../services/api';

export default function ArchiveModal({ isOpen, onClose }) {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAnalysesApi()
        .then((data) => {
          setArchives(data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Failed to load archives:', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

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
          maxWidth: '580px',
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
        {/* Modal Header */}
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
            <History size={18} color="#2563eb" />
            <div>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: 0
                }}
              >
                Calculation History Log
              </h3>
              <p
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  margin: 0
                }}
              >
                Previous calculations processed through theoretical reduction
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
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '0.85rem' }}>
              Loading ledger records...
            </div>
          ) : archives.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', fontSize: '0.85rem' }}>
              No calculations recorded yet.
            </div>
          ) : (
            archives.map((item, idx) => (
              <div
                key={item._id || idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-lcd)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  >
                    {item.expression}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginTop: '2px'
                    }}
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      color: '#94a3b8',
                      textTransform: 'uppercase'
                    }}
                  >
                    FINAL RESULT
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-lcd)',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#2563eb'
                    }}
                  >
                    {item.finalAnswer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
