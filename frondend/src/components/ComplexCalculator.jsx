import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, Sparkles, RotateCcw, ArrowLeft, Zap, CheckCircle2, X } from 'lucide-react';
import { playKeyClick } from '../services/soundEngine';

const COMPLEX_PRESETS = [
  '∫ x² · sin(x) dx',
  'lim (x→0) (tan x - sin x) / x³',
  'd/dx [ln(x² + 1) / e^x]',
  '∑ (n=1 to ∞) [ln(n) / (n² + 1)]',
  'cos(2θ) / (1 + sin(2θ))',
  '∫ e^(-x²) · cos(3x) dx'
];

export default function ComplexCalculator({
  onCalculate,
  isCalculating,
  currentStatus,
  finalResult,
  activeStepNumber,
  totalSteps,
  onBackToOptions
}) {
  const [question, setQuestion] = useState('∫ x² · sin(x) dx');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    playKeyClick(1.1);
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImagePreview(base64);

      // Intelligent filename / heuristic extraction for pre-filling formula
      const name = file.name.toLowerCase();
      if (name.includes('trig') || name.includes('sin') || name.includes('cos')) {
        setQuestion('∫ sin(x) · cos(2x) dx');
      } else if (name.includes('log') || name.includes('ln')) {
        setQuestion('d/dx [ln(x³ + 5) / (x + 1)]');
      } else if (name.includes('limit')) {
        setQuestion('lim (x→0) (e^x - cos x) / x²');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    playKeyClick(0.9);
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleTriggerCalculate = () => {
    if (isCalculating || (!question.trim() && !imagePreview)) return;
    playKeyClick(0.85);
    onCalculate(question.trim(), imagePreview);
  };

  const handleSelectPreset = (preset) => {
    if (isCalculating) return;
    playKeyClick(1.05);
    setQuestion(preset);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto'
      }}
    >
      {/* Navigation Switch Back to Options */}
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

      {/* The Physical Instrument Chassis (Matches the simple calculator interface) */}
      <div
        className="calc-chassis"
        style={{
          width: '100%',
          padding: '26px 22px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Brand Header & Solar Cell */}
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
              COMPLEX OCR RESEARCH CORE • MODEL CA-8000
            </div>
          </div>

          <div
            title="Solar Photovoltaic Cell"
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

        {/* Dual-Line LCD Screen (Zero Timers) */}
        <div
          className="calc-lcd-screen"
          style={{
            height: '110px',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem',
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
                : imagePreview
                ? 'PHOTO QUESTION LOADED'
                : 'COMPLEX EQUATION'}
            </span>
            <span style={{ fontSize: '0.7rem', color: isCalculating ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
              {isCalculating ? 'THEORETICAL DERIVATION' : 'RAD'}
            </span>
          </div>

          <div
            style={{
              textAlign: 'right',
              fontFamily: 'var(--font-lcd)',
              fontSize: finalResult ? '1.85rem' : isCalculating ? '1.25rem' : '1.5rem',
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '0.04em',
              lineHeight: 1.15,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textShadow: '0 0 12px rgba(255, 255, 255, 0.2)'
            }}
          >
            {finalResult
              ? finalResult
              : isCalculating
              ? currentStatus || 'DERIVING...'
              : question || '0'}
          </div>
        </div>

        {/* Photo Upload Area */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={14} color="#ea580c" />
            <span>Upload Photo of Question</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageFile(e.target.files[0]);
              }
            }}
          />

          <div
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragOver ? '#ea580c' : '#cbd5e1'}`,
              borderRadius: '14px',
              backgroundColor: isDragOver ? '#fff7ed' : imagePreview ? '#fafafa' : '#f8fafc',
              padding: imagePreview ? '12px' : '22px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            {imagePreview ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={imagePreview}
                  alt="Uploaded math problem"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedImage ? selectedImage.name : 'Uploaded Question Photo'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#16a34a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>Optical Question Loaded</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#fff7ed',
                    border: '1px solid #fed7aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ea580c'
                  }}
                >
                  <Upload size={20} />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                  Click to browse photo or drag & drop
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Handwritten calculus, textbook problems, PNG or JPG
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Question Formula Text Input / Reader */}
        <div style={{ marginBottom: '18px' }}>
          <label
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
              display: 'block'
            }}
          >
            Mathematical Problem Statement
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isCalculating}
            placeholder="e.g. ∫ x² · sin(x) dx or d/dx [ln(x)]"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.94rem',
              fontFamily: 'var(--font-lcd)',
              color: '#0f172a',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#ea580c')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
          />
        </div>

        {/* Calculate Button with Sound */}
        <button
          type="button"
          disabled={isCalculating || (!question.trim() && !imagePreview)}
          onClick={handleTriggerCalculate}
          style={{
            width: '100%',
            height: '56px',
            backgroundColor: '#ea580c',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '0.04em',
            cursor: isCalculating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-key-calc)',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!isCalculating) e.currentTarget.style.backgroundColor = '#c2410c';
          }}
          onMouseLeave={(e) => {
            if (!isCalculating) e.currentTarget.style.backgroundColor = '#ea580c';
          }}
        >
          <Zap size={20} fill="currentColor" />
          <span>{isCalculating ? 'DERIVING THEOREM...' : 'CALCULATE COMPLEX TASK (=)'}</span>
        </button>
      </div>

      {/* Quick Complex Presets */}
      <div
        style={{
          width: '100%',
          marginTop: '18px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '10px'
          }}
        >
          Quick Complex Examples
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {COMPLEX_PRESETS.map((preset, idx) => (
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
                fontSize: '0.78rem',
                fontFamily: 'var(--font-lcd)',
                color: '#334155',
                cursor: isCalculating ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isCalculating) {
                  e.currentTarget.style.borderColor = '#ea580c';
                  e.currentTarget.style.backgroundColor = '#fff7ed';
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
