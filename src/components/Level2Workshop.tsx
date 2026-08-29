/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Hammer, Cpu, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, Delete, RotateCcw } from 'lucide-react';
import { audio } from '../utils/audio';

interface Level2Props {
  onSuccess: (scoreBonus: number) => void;
  onFailure: (damage: number) => void;
}

interface ComponentPuzzle {
  id: number;
  name: string;
  role: string;
  answer: string;
  description: string;
  hint: string;
  renderArtwork: () => React.ReactNode;
}

interface LetterTile {
  id: number;
  char: string;
}

export default function Level2Workshop({ onSuccess, onFailure }: Level2Props) {
  const puzzles: ComponentPuzzle[] = [
    {
      id: 1,
      name: "Arduino Uno",
      role: "Central Controller Node",
      answer: "ARDUINO",
      description: "An open-source microcontroller board based on the Microchip ATmega328P, supporting simple compiler firmware.",
      hint: "The most popular blue microcontroller board for beginners.",
      renderArtwork: () => (
        <div className="w-48 h-32 bg-blue-900 border-2 border-blue-400 rounded-xl relative p-3 flex flex-col justify-between shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-fadeIn" id="art-arduino">
          {/* USB Port */}
          <div className="absolute top-4 -left-2 w-6 h-8 bg-zinc-400 border border-zinc-500 rounded-sm" />
          {/* Power Jack */}
          <div className="absolute bottom-3 -left-2 w-8 h-6 bg-black border border-zinc-700 rounded-sm" />
          {/* Main MCU Chip */}
          <div className="absolute right-6 top-10 w-8 h-12 bg-zinc-800 border border-zinc-600 rounded flex flex-col justify-around px-0.5" id="art-arduino-chip">
            <div className="h-0.5 w-full bg-zinc-600" />
            <div className="h-0.5 w-full bg-zinc-600" />
            <div className="h-0.5 w-full bg-zinc-600" />
            <div className="h-0.5 w-full bg-zinc-600" />
          </div>
          {/* Pin Headers */}
          <div className="w-full h-2 bg-black border-b border-zinc-700 flex justify-between px-2" id="art-arduino-header-top">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-zinc-600 rounded-sm" />
            ))}
          </div>
          {/* Board Label */}
          <div className="text-center font-mono text-[9px] text-blue-300 font-black tracking-widest uppercase my-auto" id="art-arduino-lbl">
            ARDUINO UNO
          </div>
          <div className="w-full h-2 bg-black border-t border-zinc-700 flex justify-between px-2" id="art-arduino-header-bot">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-zinc-600 rounded-sm" />
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: "Servo Motor",
      role: "Precise Angular Actuator",
      answer: "SERVO",
      description: "A motor combined with a feedback system to control angular shaft rotation precisely to specified degrees.",
      hint: "It moves to a specific angle and holds it there, commonly used in RC steering.",
      renderArtwork: () => (
        <div className="w-48 h-32 bg-cyan-950 border-2 border-cyan-400 rounded-xl relative flex items-center justify-center p-3 shadow-[0_0_15px_rgba(34,211,238,0.25)] animate-fadeIn" id="art-servo">
          {/* Blue Body */}
          <div className="w-24 h-16 bg-blue-600 border border-blue-400 rounded-md relative flex flex-col justify-end p-1.5 shadow-inner">
            <div className="text-[7px] text-white/50 font-mono text-center mb-0.5">SERVO 9G</div>
            {/* Mounting ears */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-3 bg-blue-500 border border-blue-400 rounded-t-sm" />
            {/* Wires */}
            <div className="absolute -bottom-3 left-4 flex flex-col gap-0.5" id="art-servo-wires">
              <div className="w-8 h-0.5 bg-orange-500" />
              <div className="w-8 h-0.5 bg-red-500" />
              <div className="w-8 h-0.5 bg-amber-800" />
            </div>
          </div>
          {/* White horn/rotor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 flex flex-col items-center" id="art-servo-arm">
            <div className="w-12 h-3 bg-slate-100 border border-slate-300 rounded-full flex justify-around items-center px-1">
              <div className="w-1 h-1 bg-zinc-400 rounded-full" />
              <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
              <div className="w-1 h-1 bg-zinc-400 rounded-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: "Breadboard",
      role: "Solderless Prototyping Board",
      answer: "BREADBOARD",
      description: "A grid of metal-clip connection strips beneath a plastic sheet, used for building solderless circuits.",
      hint: "It shares its name with a wooden board used for slicing baked dough.",
      renderArtwork: () => (
        <div className="w-48 h-32 bg-slate-100 border-2 border-slate-400 rounded-xl relative p-2 flex flex-col justify-between shadow-[0_0_15px_rgba(148,163,184,0.3)] text-zinc-900 animate-fadeIn" id="art-breadboard">
          {/* Power Rail Top */}
          <div className="flex gap-1 justify-center border-b border-rose-400 pb-1" id="art-bread-rail-top">
            <div className="w-full text-center text-[7px] font-mono text-rose-500 tracking-widest font-bold">+++++ POSITIVE POWER +++++</div>
          </div>
          {/* Terminal Grid Holes */}
          <div className="grid grid-cols-8 gap-1.5 py-2 justify-items-center" id="art-bread-holes-grid">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-zinc-400 rounded-sm shadow-inner" />
            ))}
          </div>
          {/* Power Rail Bot */}
          <div className="flex gap-1 justify-center border-t border-blue-400 pt-1" id="art-bread-rail-bot">
            <div className="w-full text-center text-[7px] font-mono text-blue-500 tracking-widest font-bold">----- GROUND NEGATIVE -----</div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      name: "Ultrasonic Sensor",
      role: "Sonar Distancing Ranger",
      answer: "ULTRASONIC",
      description: "The HC-SR04 uses high-frequency sound pulses to measure distance. It emits a chirp and clocks the return echo delay.",
      hint: "It has two 'eyes' and uses high-frequency sound (beyond human hearing).",
      renderArtwork: () => (
        <div className="w-48 h-32 bg-blue-950 border-2 border-cyan-400 rounded-xl relative p-3 flex flex-col justify-between items-center shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-fadeIn" id="art-ultrasonic">
          {/* PCB Base */}
          <div className="w-40 h-16 bg-emerald-800 border border-emerald-500 rounded flex items-center justify-around relative px-2 shadow-inner">
            {/* Eyes (Sonic sensors) */}
            <div className="w-12 h-12 rounded-full bg-zinc-300 border-2 border-zinc-500 flex items-center justify-center font-mono text-[9px] text-zinc-700 font-bold" id="sonic-trans">
              T
            </div>
            <div className="w-12 h-12 rounded-full bg-zinc-300 border-2 border-zinc-500 flex items-center justify-center font-mono text-[9px] text-zinc-700 font-bold" id="sonic-recv">
              R
            </div>
            {/* Connection Pins */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1 bg-black/60 px-1 py-0.5 rounded-t" id="art-sonic-pins">
              <div className="w-1 h-3 bg-yellow-400" />
              <div className="w-1 h-3 bg-yellow-400" />
              <div className="w-1 h-3 bg-yellow-400" />
              <div className="w-1 h-3 bg-yellow-400" />
            </div>
          </div>
          <div className="text-[8px] font-mono text-cyan-300 uppercase tracking-widest font-bold mt-1">HC-SR04 TRANSDUCER</div>
        </div>
      )
    },
    {
      id: 5,
      name: "Motor Driver",
      role: "H-Bridge High-Current Driver",
      answer: "DRIVER",
      description: "Controls the rotational direction and speed of heavy DC motors using pulse-width modulation and an H-bridge design.",
      hint: "Like a chauffeur for motors, it 'drives' the heavy current they need.",
      renderArtwork: () => (
        <div className="w-48 h-32 bg-indigo-950 border-2 border-rose-400 rounded-xl relative p-3 flex flex-col justify-between items-center shadow-[0_0_15px_rgba(244,63,94,0.25)] animate-fadeIn" id="art-driver">
          {/* Red Board */}
          <div className="w-36 h-20 bg-rose-800 border border-rose-500 rounded relative p-2 flex flex-col justify-between items-center shadow-inner">
            {/* Heavy Black Heatsink */}
            <div className="w-16 h-8 bg-zinc-900 border border-zinc-700 rounded flex gap-1 justify-center px-1" id="art-heatsink">
              <div className="w-2 h-full bg-zinc-800 border-r border-zinc-700" />
              <div className="w-2 h-full bg-zinc-800 border-r border-zinc-700" />
              <div className="w-2 h-full bg-zinc-800 border-r border-zinc-700" />
              <div className="w-2 h-full bg-zinc-800 border-r border-zinc-700" />
            </div>
            {/* Connection Terminals */}
            <div className="flex gap-4 justify-around w-full px-2" id="art-terminals">
              <div className="w-5 h-3 bg-cyan-700 border border-cyan-500 rounded-sm" />
              <div className="w-8 h-3 bg-emerald-700 border border-emerald-500 rounded-sm" />
              <div className="w-5 h-3 bg-cyan-700 border border-cyan-500 rounded-sm" />
            </div>
          </div>
          <div className="text-[8px] font-mono text-rose-300 uppercase tracking-widest font-bold">L298N SPEED DRIVER</div>
        </div>
      )
    },
    {
      id: 6,
      name: "Bluetooth Module",
      role: "Wireless Transceiver Link",
      answer: "BLUETOOTH",
      description: "Enables short-range wireless communication between robots and other diagnostic terminals (like the HC-05).",
      hint: "Named after a Viking king, it's the standard for short-range wireless pairing.",
      renderArtwork: () => (
        <div className="w-48 h-32 bg-indigo-950 border-2 border-indigo-400 rounded-xl relative p-3 flex flex-col justify-between items-center shadow-[0_0_15px_rgba(129,140,248,0.3)] animate-fadeIn" id="art-bluetooth">
          {/* Blue module */}
          <div className="w-20 h-24 bg-blue-700 border border-blue-400 rounded relative p-1.5 flex flex-col justify-between items-center shadow-inner">
            {/* Copper antenna traces */}
            <div className="w-full h-4 bg-amber-500/30 rounded border border-amber-500/20 flex flex-col justify-between p-0.5" id="art-antenna">
              <div className="w-full h-0.5 bg-amber-400" />
              <div className="w-3/4 h-0.5 bg-amber-400" />
              <div className="w-1/2 h-0.5 bg-amber-400" />
            </div>
            {/* Main integrated circuit */}
            <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-sm" />
            {/* Header pins */}
            <div className="flex gap-1 bg-black/60 px-1 py-0.5 rounded-t w-full justify-around" id="art-bt-pins">
              <div className="w-0.5 h-2 bg-yellow-400" />
              <div className="w-0.5 h-2 bg-yellow-400" />
              <div className="w-0.5 h-2 bg-yellow-400" />
              <div className="w-0.5 h-2 bg-yellow-400" />
              <div className="w-0.5 h-2 bg-yellow-400" />
              <div className="w-0.5 h-2 bg-yellow-400" />
            </div>
          </div>
        </div>
      )
    }
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [typedWord, setTypedWord] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showLetterRevealed, setShowLetterRevealed] = useState<boolean>(false);
  const [shakeActive, setShakeActive] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Prepare on index change
  useEffect(() => {
    if (puzzles[currentIdx]) {
      setTypedWord('');
      setIsAnswered(false);
      setShowHint(false);
    }
  }, [currentIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered || isFinished) return;
      
      const key = e.key.toUpperCase();
      
      if (key === 'BACKSPACE') {
        setTypedWord(prev => {
          if (prev.length > 0) audio.playBeep(550, 0.05, 'triangle');
          return prev.slice(0, -1);
        });
      } else if (key === 'ENTER') {
        if (typedWord.length === puzzles[currentIdx].answer.length) {
          document.getElementById('l2-verify-btn')?.click();
        }
      } else if (/^[A-Z]$/.test(key)) {
        setTypedWord(prev => {
          if (prev.length < puzzles[currentIdx].answer.length) {
            audio.playBeep(650, 0.05, 'triangle');
            return prev + key;
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, currentIdx, puzzles, typedWord]);

  const currentPuzzle = puzzles[currentIdx];

  const handleVerifyAnswer = () => {
    if (typedWord.length === 0 || isAnswered) return;

    const isCorrect = typedWord === currentPuzzle.answer;
    setIsAnswered(true);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      audio.playSuccess();
    } else {
      setShakeActive(true);
      setTimeout(() => setShakeActive(false), 500);
      onFailure(25); // Deals direct 1 integrity life damage
      audio.playError();
    }
  };

  const handleNext = () => {
    if (currentIdx < puzzles.length - 1) {
      setCurrentIdx(prev => prev + 1);
      audio.playBeep(750, 0.05, 'sine');
    } else {
      // Evaluate identification sequence
      const finalCorrect = correctCount + (typedWord === puzzles[currentIdx].answer ? 1 : 0);
      setIsFinished(true);
      if (finalCorrect === puzzles.length) {
        audio.playPowerRestored();
        setShowLetterRevealed(true);
      } else {
        audio.playError();
      }
    }
  };

  const handleBypassSuccess = () => {
    onSuccess(200); // clear, add 200 points
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setTypedWord('');
    setIsAnswered(false);
    setShowHint(false);
    setCorrectCount(0);
    setIsFinished(false);
    setShowLetterRevealed(false);
    audio.playBeep(440, 0.1, 'sine');
  };

  return (
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5" id="level-2-root">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3" id="level-2-header">
        <div className="flex items-center gap-2" id="level-2-title-group">
          <Hammer className="w-5 h-5 text-cyan-400 animate-pulse" id="l2-hammer-icon" />
          <span className="font-display font-black tracking-wider text-sm uppercase">STAGE 2: COGNITIVE COMPONENT IDENTIFICATION</span>
        </div>
        <div className="text-xs font-mono text-cyan-400 font-bold" id="l2-step-indicator">
          CALIBRATION SCAN {currentIdx + 1} OF {puzzles.length}
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-6 min-h-[340px] justify-center items-center" id="l2-terminal">
        {/* Ambient grids */}
        <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" id="l2-bg-grid" />

        {!isFinished ? (
          <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-3xl relative z-10" id="l2-interactive-box">
            
            {/* Left Column: Visual Artwork Canvas */}
            <div className="flex-1 flex flex-col items-center justify-center w-full" id="l2-artwork-col">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-2 block">X-RAY DIAGNOSTIC SCAN</span>
              <div className="h-40 w-full flex items-center justify-center p-4 bg-black/60 rounded-2xl border border-white/5 shadow-inner" id="l2-art-container">
                {currentPuzzle.renderArtwork()}
              </div>
            </div>

            {/* Right Column: Spelling Input Grid */}
            <div className="flex-1 flex flex-col gap-4 w-full" id="l2-options-col">
              <div className="space-y-1" id="l2-label-box">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">DIAGNOSTIC TELEMETRY CAPTURED</span>
                <h3 className="text-sm font-display font-black text-white uppercase tracking-wider" id="l2-role-heading">
                  ROLE: {currentPuzzle.role}
                </h3>
              </div>

              {/* Empty slot boxes */}
              <div className={`flex flex-wrap gap-1 py-1 ${shakeActive ? 'animate-shake' : ''}`} id="l2-word-slots">
                {currentPuzzle.answer.split('').map((char, idx) => {
                  const filledChar = typedWord[idx];
                  const isSelected = !!filledChar;
                  return (
                    <div
                      key={idx}
                      className={`w-8 h-9 rounded-lg border-2 flex items-center justify-center font-display font-black text-xs md:text-sm transition-all duration-300 ${
                        isAnswered
                          ? typedWord === currentPuzzle.answer
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                            : 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                          : isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.2)]'
                          : 'bg-white/5 border-white/10 text-slate-500'
                      }`}
                      id={`l2-slot-${idx}`}
                    >
                      {filledChar || ''}
                    </div>
                  );
                })}
              </div>
              
              {!isAnswered && (
                 <div className="flex flex-col items-center gap-2 mt-2">
                   <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest animate-pulse block">TYPE ANSWER USING KEYBOARD</span>
                   {!showHint ? (
                     <button onClick={() => setShowHint(true)} className="text-[10px] font-mono text-amber-400/70 hover:text-amber-300 border border-amber-500/30 px-2 py-1 rounded transition-colors uppercase tracking-widest cursor-pointer">
                       Reveal Hint
                     </button>
                   ) : (
                     <div className="text-[11px] font-mono text-amber-400 max-w-sm text-center border border-amber-500/20 bg-amber-500/10 p-2 rounded">
                       <strong>HINT:</strong> {currentPuzzle.hint}
                     </div>
                   )}
                 </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2" id="l2-actions-box">
                {isAnswered && (
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-[10px] text-slate-400 font-medium leading-relaxed animate-fadeIn" id="l2-explanation">
                    <span className="text-cyan-400 font-bold block mb-0.5">COMPONENT LOG:</span>
                    {currentPuzzle.description}
                  </div>
                )}

                <div className="flex justify-end" id="l2-btn-row">
                  {!isAnswered ? (
                    <button
                      onClick={handleVerifyAnswer}
                      disabled={typedWord.length < currentPuzzle.answer.length}
                      className={`btn-primary px-6 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-2 cursor-pointer ${
                        typedWord.length < currentPuzzle.answer.length ? 'opacity-40 cursor-not-allowed hover:shadow-none' : ''
                      }`}
                      id="l2-verify-btn"
                    >
                      <Cpu className="w-3.5 h-3.5 text-cyan-950" id="l2-verify-icon" />
                      DECRYPT COMPONENT
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="btn-primary px-6 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-2 cursor-pointer"
                      id="l2-next-btn"
                    >
                      <span>{currentIdx === puzzles.length - 1 ? "COMPILED RESULTS" : "NEXT SCAN MODULE"}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-950" id="l2-next-icon" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10 p-4" id="l2-finished-panel">
            {correctCount === puzzles.length ? (
              <div className="space-y-4 max-w-md" id="l2-success-card">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce" id="l2-success-icon-box">
                  <CheckCircle className="w-9 h-9 text-emerald-400" id="l2-success-icon" />
                </div>
                <div className="space-y-1" id="l2-success-text">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">ALL IDENTIFIED</span>
                  <h3 className="text-xl font-display font-black text-white">HARDWARE COMPLIANT (6/6 CORRECT)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Excellent physical module analysis! You have completed Sector 2 and retrieved the second password character.
                  </p>
                </div>

                {showLetterRevealed && (
                  <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" id="l2-letter-reveal">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">MAINFRAME BYPASS CIPHER KEY</span>
                    <strong className="text-3xl font-display font-black text-cyan-300" id="l2-revealed-key-char">O</strong>
                    <span className="text-[9px] text-slate-400 font-mono">Character stored to HUD register.</span>
                  </div>
                )}

                <button
                  onClick={handleBypassSuccess}
                  className="btn-primary w-full py-3 rounded-xl text-xs font-display font-black tracking-wider cursor-pointer mt-2"
                  id="l2-success-proceed-btn"
                >
                  TRANSMIT CIPHER & ENTER SECTOR 3
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md" id="l2-fail-card">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse" id="l2-fail-icon-box">
                  <AlertTriangle className="w-9 h-9 text-rose-500" id="l2-fail-icon" />
                </div>
                <div className="space-y-1" id="l2-fail-text">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-black">CALIBRATION ERROR</span>
                  <h3 className="text-xl font-display font-black text-white">MODULE SCAN INCOMPLETE ({correctCount}/6)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Robotics operations require a <strong className="text-rose-400">perfect 100% identification score</strong> of all 6 core components to establish telemetry. Let's trace again!
                  </p>
                </div>

                <div className="flex gap-4 mt-2" id="l2-fail-btn-row">
                  <button
                    onClick={handleRetry}
                    className="btn-secondary w-full py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider cursor-pointer border border-white/10"
                    id="l2-fail-retry-btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5 inline-block mr-1.5" id="l2-retry-icon" />
                    RETRY SCAN COMPLIANCE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
