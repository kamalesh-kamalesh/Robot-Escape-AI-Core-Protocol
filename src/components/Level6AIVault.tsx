/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Flame, CheckCircle, Info, Lock, ArrowRight, RefreshCw, Delete, RotateCcw } from 'lucide-react';
import { audio } from '../utils/audio';

interface Level6Props {
  onSuccess: (scoreBonus: number) => void;
  onFailure: (damage: number) => void;
}

interface PuzzleItem {
  id: number;
  laserName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  answer: string;
  explanation: string;
  hint: string;
}

interface LetterTile {
  id: number;
  char: string;
}

export default function Level6AIVault({ onSuccess, onFailure }: Level6Props) {
  const puzzles: PuzzleItem[] = [
    {
      id: 1,
      laserName: "Relay Alpha (Easy)",
      difficulty: "Easy",
      question: "Which component drops electrical resistance as ambient light levels increase?",
      answer: "LDR",
      explanation: "LDR stands for Light Dependent Resistor. Its electrical resistance drops dramatically as light levels increase, making it perfect for light detection.",
      hint: "It's an acronym for Light Dependent Resistor."
    },
    {
      id: 2,
      laserName: "Relay Beta (Easy)",
      difficulty: "Easy",
      question: "Which motor utilizes feedback loops to rotate and lock its shaft precisely to an angle?",
      answer: "SERVO",
      explanation: "Servo motors utilize internal potentiometer feedback loops to rotate and hold their shafts at precise angles (usually between 0° and 180°).",
      hint: "Commonly used in RC vehicles for steering."
    },
    {
      id: 3,
      laserName: "Relay Gamma (Easy)",
      difficulty: "Easy",
      question: "Which beginner microcontroller prototyping board contains safety fuses and an ATmega chip?",
      answer: "ARDUINO",
      explanation: "The Arduino Uno is highly beginner friendly due to its robust safety fuses, rich standard libraries, and massive community tutorials.",
      hint: "The Uno is its most famous model."
    },
    {
      id: 4,
      laserName: "Relay Delta (Medium)",
      difficulty: "Medium",
      question: "According to Ohm's Law, what electrical flow property is represented by the symbol (I)?",
      answer: "CURRENT",
      explanation: "Ohm's Law states that Current (I) = V / R. Current is directly proportional to voltage and inversely proportional to resistance.",
      hint: "It represents the flow of electric charge, like water in a pipe."
    },
    {
      id: 5,
      laserName: "Relay Epsilon (Medium)",
      difficulty: "Medium",
      question: "Ultrasonic HC-SR04 sensors measure distance to barriers using high frequency ____ waves.",
      answer: "SOUND",
      explanation: "Ultrasonic rangers emit acoustic sound waves above the human hearing range and clock the time delay for the echo to bounce back.",
      hint: "It's what we hear, but at a frequency too high for humans."
    },
    {
      id: 6,
      laserName: "Relay Zeta (Medium)",
      difficulty: "Medium",
      question: "What does the letter 'P' stand for in the telemetry abbreviation 'PWM'?",
      answer: "PULSE",
      explanation: "PWM stands for Pulse Width Modulation. It simulates analog levels by rapidly toggling a digital signal between ON (5V) and OFF (0V) states.",
      hint: "Like a heartbeat, it's a short burst of energy."
    },
    {
      id: 7,
      laserName: "Relay Eta (Hard)",
      difficulty: "Hard",
      question: "Which component is required to control speed and direction of heavy motors using transistors?",
      answer: "DRIVER",
      explanation: "Motor Drivers (like the L298N H-Bridge) isolate high power lines and manage the heavy current needs of DC motors using processor signals.",
      hint: "It acts as a 'chauffeur' for the motor's power needs."
    },
    {
      id: 8,
      laserName: "Relay Theta (Hard)",
      difficulty: "Hard",
      question: "What is the name of the symbol (~) marked on Arduino pins that support variable PWM output?",
      answer: "TILDE",
      explanation: "Arduino Uno pins marked with a tilde (~) support PWM, allowing them to output simulated analog duty-cycle voltages.",
      hint: "It's the squiggly line character often found below the Escape key on keyboards."
    },
    {
      id: 9,
      laserName: "Relay Iota (Hard)",
      difficulty: "Hard",
      question: "What force does a resistor introduce in a circuit to restrict current flow?",
      answer: "RESIST",
      explanation: "A resistor's primary job is to resist and limit the flow of current, protecting fragile components like LEDs from electrical damage.",
      hint: "It's the root word of 'resistor'."
    },
    {
      id: 10,
      laserName: "Relay Kappa (Hard)",
      difficulty: "Hard",
      question: "Which sensor provides the best non-contact method to measure distance using ultrasonic chirps?",
      answer: "ULTRASONIC",
      explanation: "An Ultrasonic sensor offers excellent non-contact proximity detection by timing sonar reflections, unaffected by object color or transparency.",
      hint: "Think 'ultra' plus 'sonic'."
    }
  ];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [solvedRelays, setSolvedRelays] = useState<Record<number, boolean>>({});
  const [typedWord, setTypedWord] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showLetterRevealed, setShowLetterRevealed] = useState<boolean>(false);
  const [shakeActive, setShakeActive] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Prepare tile pool on index change
  useEffect(() => {
    if (puzzles[activeIdx]) {
      setTypedWord('');
      setIsAnswered(false);
      setShowHint(false);
    }
  }, [activeIdx]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered || isFinished || solvedRelays[puzzles[activeIdx].id]) return;
      
      const key = e.key.toUpperCase();
      
      if (key === 'BACKSPACE') {
        setTypedWord(prev => {
          if (prev.length > 0) audio.playBeep(550, 0.05, 'triangle');
          return prev.slice(0, -1);
        });
      } else if (key === 'ENTER') {
        if (typedWord.length === puzzles[activeIdx].answer.length) {
          document.getElementById('l6-verify-btn')?.click();
        }
      } else if (/^[A-Z]$/.test(key)) {
        setTypedWord(prev => {
          if (prev.length < puzzles[activeIdx].answer.length) {
            audio.playBeep(650, 0.05, 'triangle');
            return prev + key;
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, activeIdx, puzzles, typedWord, solvedRelays]);

  const currentP = puzzles[activeIdx];

  const handleVerify = () => {
    if (typedWord.length === 0 || isAnswered) return;

    const isCorrect = typedWord === currentP.answer;
    setIsAnswered(true);

    if (isCorrect) {
      audio.playLaser(); // play laser shutdown sound
      const updated = { ...solvedRelays, [currentP.id]: true };
      setSolvedRelays(updated);
    } else {
      setShakeActive(true);
      setTimeout(() => setShakeActive(false), 500);
      audio.playError();
      onFailure(25); // Deals direct 1 integrity life damage
    }
  };

  const handleNext = () => {
    // Check if everything is solved
    const updated = { ...solvedRelays, [currentP.id]: true };
    const allCleared = puzzles.every(p => updated[p.id]);

    if (allCleared) {
      setIsFinished(true);
      setShowLetterRevealed(true);
      audio.playPowerRestored();
    } else {
      // Advance to next unsolved index if available, or just wrap around
      const nextUnsolved = puzzles.findIndex(p => !updated[p.id]);
      if (nextUnsolved !== -1) {
        setActiveIdx(nextUnsolved);
      } else {
        setActiveIdx((activeIdx + 1) % puzzles.length);
      }
      setTypedWord('');
      setIsAnswered(false);
      audio.playBeep(700, 0.05, 'sine');
    }
  };

  const handleBypassSuccess = () => {
    onSuccess(350); // huge points
  };

  const handleRetry = () => {
    setActiveIdx(0);
    setSolvedRelays({});
    setTypedWord('');
    setIsAnswered(false);
    setShowHint(false);
    setIsFinished(false);
    setShowLetterRevealed(false);
    audio.playBeep(440, 0.1, 'sine');
  };

  const totalSolvedCount = Object.keys(solvedRelays).length;

  return (
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5" id="level-6-root">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3" id="level-6-header">
        <div className="flex items-center gap-2" id="level-6-title-group">
          <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" id="l6-shield-icon" />
          <span className="font-display font-black tracking-wider text-sm uppercase">STAGE 6: AI VAULT CRYPTO-LASER GRID</span>
        </div>
        <div className="text-xs font-mono text-cyan-400 font-bold" id="l6-cleared-badge">
          LASERS STABILIZED: {totalSolvedCount} OF {puzzles.length}
        </div>
      </div>

      <p className="text-[11px] text-slate-300 font-sans font-medium" id="l6-level-desc">
        A.R.I.A.'s AI Vault core is protected by <strong className="text-rose-400">10 interlocking security laser relays</strong>. To shut down the grid, click each relay node on the left, read the diagnostics logs, and type the override parameters using your keyboard!
      </p>

      {!isFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="l6-split">
          
          {/* Left: Laser Status Rails */}
          <div className="lg:col-span-4 flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-1" id="l6-lasers-list-col">
            <span className="text-[9px] font-display text-white/40 uppercase tracking-widest block pl-1">INTERLOCKING BARRIERS</span>
            <div className="space-y-1.5" id="l6-lasers-list">
              {puzzles.map((p, idx) => {
                const isSolved = solvedRelays[p.id];
                const isActive = activeIdx === idx;

                let borderStyle = "border-white/5 bg-black/40 text-slate-400";
                if (isActive) borderStyle = "border-cyan-500/50 bg-black/60 text-white shadow-[0_0_10px_rgba(34,211,238,0.15)]";
                else if (isSolved) borderStyle = "border-emerald-500/20 bg-emerald-950/10 text-slate-500";

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveIdx(idx);
                      setTypedWord('');
                      setIsAnswered(false);
                      audio.playBeep(600 + idx * 30, 0.05);
                    }}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition cursor-pointer text-xs ${borderStyle}`}
                    id={`laser-relay-btn-${p.id}`}
                  >
                    <div className="flex flex-col" id={`laser-item-meta-${p.id}`}>
                      <span className="font-display font-bold text-[11px]">{p.laserName}</span>
                      <span className={`text-[8px] font-mono uppercase tracking-wider font-bold mt-0.5 ${
                        p.difficulty === 'Easy' ? 'text-emerald-400' : p.difficulty === 'Medium' ? 'text-yellow-400' : 'text-rose-400'
                      }`}>{p.difficulty}</span>
                    </div>

                    <div className="shrink-0" id={`laser-item-badge-${p.id}`}>
                      {isSolved ? (
                        <span className="text-[8px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          SHUTDOWN
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 animate-pulse">
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Interrogation Panel */}
          <div className="lg:col-span-8 flex flex-col gap-2.5" id="l6-active-panel-col">
            <span className="text-[9px] font-display text-white/40 uppercase tracking-widest block pl-1">TERMINAL CONSOLE</span>
            
            <div className="bg-black/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between min-h-[300px] relative overflow-hidden" id="l6-console-box">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-3" id="l6-q-details">
                <div className="border-b border-white/5 pb-2" id="l6-q-header">
                  <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">TERMINAL DIAGNOSTICS NODE</span>
                  <h4 className="text-xs font-display font-black text-white uppercase tracking-wider">
                    {currentP.laserName.toUpperCase()} // LEVEL: {currentP.difficulty.toUpperCase()}
                  </h4>
                </div>

                <div className="bg-black/40 p-3 rounded-xl border border-white/10" id="l6-q-desc">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                    {currentP.question}
                  </p>
                </div>

                {/* Empty target slots representing length of answer */}
                <div className={`flex flex-wrap justify-center gap-1 py-1.5 ${shakeActive ? 'animate-shake' : ''}`} id="l6-word-slots">
                  {currentP.answer.split('').map((char, idx) => {
                    const filledChar = typedWord[idx];
                    const isSelected = !!filledChar;
                    return (
                      <div
                        key={idx}
                        className={`w-7 h-8 rounded-lg border flex items-center justify-center font-display font-black text-xs md:text-sm transition-all duration-300 ${
                          isAnswered
                            ? typedWord === currentP.answer
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                              : 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                            : isSelected
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.2)]'
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}
                        id={`l6-slot-${idx}`}
                      >
                        {filledChar || ''}
                      </div>
                    );
                  })}
                </div>
                
                {!isAnswered && !solvedRelays[currentP.id] && (
                   <div className="flex flex-col items-center gap-2">
                     <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest animate-pulse block mt-1">TYPE ANSWER USING KEYBOARD</span>
                     {!showHint ? (
                       <button onClick={() => setShowHint(true)} className="text-[10px] font-mono text-amber-400/70 hover:text-amber-300 border border-amber-500/30 px-2 py-1 rounded transition-colors uppercase tracking-widest cursor-pointer">
                         Reveal Hint
                       </button>
                     ) : (
                       <div className="text-[11px] font-mono text-amber-400 max-w-sm text-center border border-amber-500/20 bg-amber-500/10 p-2 rounded">
                         <strong>HINT:</strong> {currentP.hint}
                       </div>
                     )}
                   </div>
                )}

                {isAnswered && (
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-[10px] text-slate-400 font-medium leading-relaxed animate-fadeIn" id="l6-explanation">
                    <span className="text-cyan-400 font-bold block mb-0.5">EXPLANATION MANUAL:</span>
                    {currentP.explanation}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-3 flex justify-end mt-4" id="l6-actions">
                {!isAnswered && !solvedRelays[currentP.id] ? (
                  <button
                    onClick={handleVerify}
                    disabled={typedWord.length < currentP.answer.length}
                    className={`btn-primary px-5 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-1.5 cursor-pointer ${
                      typedWord.length < currentP.answer.length ? 'opacity-40 cursor-not-allowed hover:shadow-none' : ''
                    }`}
                    id="l6-verify-btn"
                  >
                    <Lock className="w-3.5 h-3.5 text-cyan-950" id="l6-verify-icon" />
                    DISARM LASER RELAY
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn-primary px-5 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-1.5 cursor-pointer"
                    id="l6-next-btn"
                  >
                    <span>{totalSolvedCount === puzzles.length ? "FINALIZE MAIN GRID" : "NEXT SECURITY RELAY"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-950" id="l6-next-icon" />
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* Finished Vault Screen */
        <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10 p-4" id="l6-finished-panel">
          <div className="space-y-4 max-w-md animate-scaleUp" id="l6-success-card">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce" id="l6-success-icon-box">
              <CheckCircle className="w-9 h-9 text-emerald-400" id="l6-success-icon" />
            </div>
            <div className="space-y-1" id="l6-success-text">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">VAULT SECURED</span>
              <h3 className="text-xl font-display font-black text-white">LASER BARRIERS SHUTDOWN (10/10 CORRECT)</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Unbelievable STEM diagnostics! You have successfully disabled all 10 high-power laser grids guarding the vault. Retrieve your final decypher letter below!
              </p>
            </div>

            {showLetterRevealed && (
              <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" id="l6-letter-reveal">
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">MAINFRAME BYPASS CIPHER KEY</span>
                <strong className="text-3xl font-display font-black text-cyan-300" id="l6-revealed-key-char">S</strong>
                <span className="text-[9px] text-slate-400 font-mono">Character stored to HUD register.</span>
              </div>
            )}

            <button
              onClick={handleBypassSuccess}
              className="btn-primary w-full py-3 rounded-xl text-xs font-display font-black tracking-wider cursor-pointer mt-2"
              id="l6-success-proceed-btn"
            >
              TRANSMIT CIPHER & DEPLOY CORE STABILIZATION
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
