import React, { useState, useEffect, useRef } from 'react';
import ModeSelection from './components/ModeSelection';
import IntroAssembly from './components/IntroAssembly';
import InteractiveBackground from './components/InteractiveBackground';
import Header from './components/Header';
import RealCalculator from './components/RealCalculator';
import ComplexCalculator from './components/ComplexCalculator';
import CalculationTape from './components/CalculationTape';
import ArchiveModal from './components/ArchiveModal';
import AboutModal from './components/AboutModal';
import Footer from './components/Footer';
import { fetchCalculationSteps, fetchComplexCalculationSteps } from './services/api';
import { playStepSound, playKeyClick } from './services/soundEngine';

export default function App() {
  // Current application mode: 'mode-selection' (initial) | 'simple' | 'complex'
  const [mode, setMode] = useState('mode-selection');

  // Simple Mode Intro Assembly State
  const [showSimpleIntro, setShowSimpleIntro] = useState(false);

  // Calculation states
  const [expression, setExpression] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [activeStepNumber, setActiveStepNumber] = useState(0);
  const [totalSteps, setTotalSteps] = useState(15);
  const [currentStatus, setCurrentStatus] = useState('');
  const [finalResult, setFinalResult] = useState('');

  // Modal states
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const stepIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, []);

  const handleSelectMode = (selectedMode) => {
    handleReset();
    setMode(selectedMode);
    if (selectedMode === 'simple') {
      setShowSimpleIntro(true);
    } else {
      setShowSimpleIntro(false);
    }
  };

  const handleSwitchMode = () => {
    if (isCalculating) return;
    playKeyClick(0.95);
    handleReset();
    setMode('mode-selection');
  };

  // Simple Calculation Handler
  const handleStartSimpleCalculation = async (expr) => {
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);

    setExpression(expr);
    setIsCalculating(true);
    setIsComplete(false);
    setVisibleSteps([]);
    setActiveStepNumber(1);
    setCurrentStatus('PARSING AXIOMS...');
    setFinalResult('');

    try {
      const data = await fetchCalculationSteps(expr);
      const allSteps = data.steps || [];
      setTotalSteps(allSteps.length);

      let stepIndex = 0;
      // Line-by-line pacing: every 950ms a new line is displayed (total duration: ~14.5s > 10s)
      stepIntervalRef.current = setInterval(() => {
        if (stepIndex < allSteps.length) {
          const currentStep = allSteps[stepIndex];
          setVisibleSteps((prev) => [...prev, currentStep]);
          setActiveStepNumber(currentStep.stepNumber);
          setCurrentStatus(currentStep.title.toUpperCase());
          playStepSound();
          stepIndex++;
        } else {
          clearInterval(stepIntervalRef.current);

          setTimeout(() => {
            setFinalResult(data.finalAnswer);
            setIsComplete(true);
            setIsCalculating(false);
            setCurrentStatus('FINAL DETERMINATION');
          }, 800);
        }
      }, 950);
    } catch (err) {
      console.warn('Calculation error:', err);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setIsCalculating(false);
      setCurrentStatus('ERROR IN SYNTAX');
    }
  };

  // Complex Calculation Handler (with photo/question)
  const handleStartComplexCalculation = async (questionText, imageBase64) => {
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);

    setExpression(questionText);
    setIsCalculating(true);
    setIsComplete(false);
    setVisibleSteps([]);
    setActiveStepNumber(1);
    setCurrentStatus('OPTICAL TENSOR PARSING...');
    setFinalResult('');

    try {
      const data = await fetchComplexCalculationSteps(questionText, imageBase64);
      const allSteps = data.steps || [];
      setTotalSteps(allSteps.length);

      let stepIndex = 0;
      // Line-by-line pacing: every 950ms a new line is displayed (total duration: ~14.5s > 10s)
      stepIntervalRef.current = setInterval(() => {
        if (stepIndex < allSteps.length) {
          const currentStep = allSteps[stepIndex];
          setVisibleSteps((prev) => [...prev, currentStep]);
          setActiveStepNumber(currentStep.stepNumber);
          setCurrentStatus(currentStep.title.toUpperCase());
          playStepSound();
          stepIndex++;
        } else {
          clearInterval(stepIntervalRef.current);

          setTimeout(() => {
            setFinalResult(data.finalAnswer);
            setIsComplete(true);
            setIsCalculating(false);
            setCurrentStatus('FINAL DETERMINATION');
          }, 800);
        }
      }, 950);
    } catch (err) {
      console.warn('Complex calculation error:', err);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setIsCalculating(false);
      setCurrentStatus('DERIVATION DISRUPTION');
    }
  };

  const handleReset = () => {
    if (isCalculating) return;
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);

    setExpression('');
    setIsCalculating(false);
    setIsComplete(false);
    setVisibleSteps([]);
    setActiveStepNumber(0);
    setCurrentStatus('');
    setFinalResult('');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Interactive Multi-Colored Animated Cloud Background (Light Theme with Mouse Glimpling Audio) */}
      <InteractiveBackground />

      {/* Top Header */}
      <Header
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onReset={handleReset}
        isCalculating={isCalculating}
        onSwitchMode={mode !== 'mode-selection' ? handleSwitchMode : null}
      />

      {/* Main Content Area */}
      <main
        className="container-clean"
        style={{
          flex: 1,
          padding: mode === 'mode-selection' ? '40px 20px 60px 20px' : '32px 20px 60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: mode === 'mode-selection' ? 'center' : 'flex-start',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* VIEW 1: Top-Level Mode Selection (Option 1 vs Option 2) */}
        {mode === 'mode-selection' && (
          <ModeSelection onSelectMode={handleSelectMode} />
        )}

        {/* VIEW 2: Simple Calculation (Physical Calculator + Tape) */}
        {mode === 'simple' && (
          showSimpleIntro ? (
            <IntroAssembly
              onComplete={() => setShowSimpleIntro(false)}
              onBackToOptions={handleSwitchMode}
            />
          ) : (
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: visibleSteps.length > 0 ? 'minmax(320px, 440px) minmax(320px, 560px)' : '1fr',
                justifyContent: 'center',
                gap: '36px',
                alignItems: 'start',
                transition: 'all 0.4s ease'
              }}
              className="main-calculator-layout"
            >
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <RealCalculator
                  onCalculate={handleStartSimpleCalculation}
                  isCalculating={isCalculating}
                  currentStatus={currentStatus}
                  finalResult={finalResult}
                  activeStepNumber={activeStepNumber}
                  totalSteps={totalSteps}
                  onBackToOptions={handleSwitchMode}
                />
              </div>

              {visibleSteps.length > 0 && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <CalculationTape
                    expression={expression}
                    visibleSteps={visibleSteps}
                    activeStepIndex={activeStepNumber}
                    isComplete={isComplete}
                    finalResult={finalResult}
                  />
                </div>
              )}
            </div>
          )
        )}

        {/* VIEW 3: Complex Calculations (Photo Upload / OCR / Presets + Tape) */}
        {mode === 'complex' && (
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: visibleSteps.length > 0 ? 'minmax(320px, 460px) minmax(320px, 560px)' : '1fr',
              justifyContent: 'center',
              gap: '36px',
              alignItems: 'start',
              transition: 'all 0.4s ease'
            }}
            className="main-calculator-layout"
          >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <ComplexCalculator
                onCalculate={handleStartComplexCalculation}
                isCalculating={isCalculating}
                currentStatus={currentStatus}
                finalResult={finalResult}
                activeStepNumber={activeStepNumber}
                totalSteps={totalSteps}
                onBackToOptions={handleSwitchMode}
              />
            </div>

            {visibleSteps.length > 0 && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <CalculationTape
                  expression={expression}
                  visibleSteps={visibleSteps}
                  activeStepIndex={activeStepNumber}
                  isComplete={isComplete}
                  finalResult={finalResult}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <ArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Footer */}
      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .main-calculator-layout {
            grid-template-columns: 1fr !important;
          }
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
