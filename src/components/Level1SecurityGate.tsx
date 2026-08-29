/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Key, RefreshCw, AlertTriangle, CheckCircle, HelpCircle, ArrowRight, Delete, RotateCcw } from 'lucide-react';
import { audio } from '../utils/audio';

interface Level1Props {
  onSuccess: (scoreBonus: number) => void;
  onFailure: (damage: number) => void;
}

interface Question {
  id: number;
  text: string;
  answer: string;
  explanation: string;
  hint: string;
}

interface LetterTile {
  id: number;
  char: string;
}

export default function Level1SecurityGate({ onSuccess, onFailure }: Level1Props) {
  const questions: Question[] = [
    {
      id: 1,
      text: "Which sensor is used to measure physical distance by timing sound reflections?",
      answer: "ULTRASONIC",
      explanation: "Ultrasonic sensors (like the HC-SR04) measure distance by emitting high-frequency sound waves and timing their reflection echo.",
      hint: "It uses sound waves beyond human hearing, much like a bat."
    },
    {
      id: 2,
      text: "Which open-source microcontroller board is most widely used by beginners?",
      answer: "ARDUINO",
      explanation: "The Arduino Uno is the industry standard prototyping microcontroller for beginners due to its simplicity and robust community.",
      hint: "Its name sounds Italian and it's heavily associated with the Uno model."
    },
    {
      id: 3,
      text: "Which feedback-driven motor is specifically designed to rotate precisely to an angle?",
      answer: "SERVO",
      explanation: "Servo motors use feedback control to rotate and lock their output shafts to precise angular positions (usually 0 to 180 degrees).",
      hint: "It shares its name with a term used in tennis for starting a point, minus the 'e'."
    },
    {
      id: 4,
      text: "In the abbreviation 'LED' (Light Emitting Diode), what does the letter 'D' stand for?",
      answer: "DIODE",
      explanation: "LED stands for Light Emitting Diode. It is a semiconductor light source that emits light when electrical current flows through it.",
      hint: "It is an electronic component that only allows current to flow in one direction."
    },
    {
      id: 5,
      text: "Which variable resistor sensor drops resistance as ambient light levels increase?",
      answer: "LDR",
      explanation: "LDR stands for Light Dependent Resistor (or photoresistor). Its electrical resistance decreases as the incident light intensity increases.",
      hint: "It's a three-letter acronym standing for Light Dependent Resistor."
    },
    {
      id: 6,
      text: "Which chemical storage device serves as the primary electrical power source?",
      answer: "BATTERY",
      explanation: "A battery converts stored chemical energy into electrical energy, serving as the electrical power source for autonomous robotic circuits.",
      hint: "AA, AAA, and Li-ion are common types of this."
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

  // Run on question change to prepare
  useEffect(() => {
    if (questions[currentIdx]) {
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
        if (typedWord.length === questions[currentIdx].answer.length) {
          document.getElementById('l1-verify-btn')?.click();
        }
      } else if (/^[A-Z]$/.test(key)) {
        setTypedWord(prev => {
          if (prev.length < questions[currentIdx].answer.length) {
            audio.playBeep(650, 0.05, 'triangle');
            return prev + key;
          }
          return prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, isFinished, currentIdx, questions, typedWord]);

  const currentQ = questions[currentIdx];

  const handleVerifyAnswer = () => {
    if (typedWord.length === 0 || isAnswered) return;

    const isCorrect = typedWord === currentQ.answer;
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
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      audio.playBeep(750, 0.05, 'sine');
    } else {
      // Evaluate quiz
      const finalCorrect = correctCount + (typedWord === questions[currentIdx].answer ? 1 : 0);
      setIsFinished(true);
      if (finalCorrect >= 5) {
        audio.playPowerRestored();
        setShowLetterRevealed(true);
      } else {
        audio.playError();
      }
    }
  };

  const handleBypassSuccess = () => {
    onSuccess(150); // reward score points
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
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5" id="level-1-root">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3" id="level-1-header">
        <div className="flex items-center gap-2" id="level-1-title-group">
          <Key className="w-5 h-5 text-cyan-400 animate-pulse" id="l1-key-icon" />
          <span className="font-display font-black tracking-wider text-sm uppercase">STAGE 1: TERMINAL DECRYPTION SEQUENCE</span>
        </div>
        <div className="text-xs font-mono text-cyan-400 font-bold" id="l1-step-indicator">
          SECURITY NODE {currentIdx + 1} OF {questions.length}
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-6 min-h-[300px] justify-center animate-fadeIn" id="l1-terminal">
        {/* Ambient grids */}
        <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" id="l1-bg-grid" />

        {!isFinished ? (
          <div className="flex flex-col gap-5 relative z-10" id="l1-interactive-quiz">
            {/* Question Text */}
            <div className="space-y-2 text-center" id="l1-question-box">
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.2em] block">SECURE BYPASS DIAGNOSTIC LOG</span>
              <h3 className="text-sm md:text-base font-display font-black text-white leading-snug px-4" id="l1-question-text">
                {currentQ.text}
              </h3>
            </div>

            {/* Empty target letter slots representing length */}
            <div className={`flex flex-wrap justify-center gap-1.5 py-4 ${shakeActive ? 'animate-shake' : ''}`} id="l1-word-slots">
              {currentQ.answer.split('').map((char, idx) => {
                const filledChar = typedWord[idx];
                const isSelected = !!filledChar;
                return (
                  <div
                    key={idx}
                    className={`w-10 h-11 md:w-12 md:h-13 rounded-lg border-2 flex items-center justify-center font-display font-black text-sm md:text-lg transition-all duration-300 ${
                      isAnswered
                        ? typedWord === currentQ.answer
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                          : 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                        : isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                    id={`l1-slot-${idx}`}
                  >
                    {filledChar || ''}
                  </div>
                );
              })}
            </div>
            
            {!isAnswered && (
               <div className="text-center flex flex-col items-center gap-2">
                 <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest animate-pulse">TYPE ANSWER USING KEYBOARD</span>
                 {!showHint ? (
                   <button onClick={() => setShowHint(true)} className="text-[10px] font-mono text-amber-400/70 hover:text-amber-300 border border-amber-500/30 px-2 py-1 rounded transition-colors uppercase tracking-widest cursor-pointer">
                     Reveal Hint
                   </button>
                 ) : (
                   <div className="text-[11px] font-mono text-amber-400 max-w-sm border border-amber-500/20 bg-amber-500/10 p-2 rounded">
                     <strong>HINT:</strong> {currentQ.hint}
                   </div>
                 )}
               </div>
            )}

            {/* Explanation & Action Box */}
            <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-4" id="l1-actions">
              {isAnswered && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-[11px] text-slate-300 max-w-xl w-full text-center leading-relaxed font-medium mb-2 animate-fadeIn" id="l1-explanation">
                  <strong className={typedWord === currentQ.answer ? "text-emerald-400 block mb-1 font-black" : "text-rose-400 block mb-1 font-black"}>
                    {typedWord === currentQ.answer ? "DECRYPTION SUCCESSFUL" : "FIREWALL BLOCK DETECTED // LIFE DECREASED"}
                  </strong>
                  {currentQ.explanation}
                </div>
              )}

              <div className="flex gap-4" id="l1-btn-row">
                {!isAnswered ? (
                  <button
                    onClick={handleVerifyAnswer}
                    disabled={typedWord.length < currentQ.answer.length}
                    className={`btn-primary px-6 py-2.5 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-2 cursor-pointer ${
                      typedWord.length < currentQ.answer.length ? 'opacity-40 cursor-not-allowed hover:shadow-none' : ''
                    }`}
                    id="l1-verify-btn"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-950" id="l1-verify-icon" />
                    TRANSMIT CIPHER WORD
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-2 cursor-pointer"
                    id="l1-next-btn"
                  >
                    <span>{currentIdx === questions.length - 1 ? "COMPILE BYPASS VERDICT" : "NEXT SECURITY BYPASS"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-950" id="l1-next-icon" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10 p-4" id="l1-finished-panel">
            {correctCount >= 5 ? (
              <div className="space-y-4 max-w-md" id="l1-success-card">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce" id="l1-success-icon-box">
                  <CheckCircle className="w-9 h-9 text-emerald-400" id="l1-success-icon" />
                </div>
                <div className="space-y-1" id="l1-success-text">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">DIAGNOSTICS STABLE</span>
                  <h3 className="text-xl font-display font-black text-white">FIREWALL BYPASSED ({correctCount}/6 CORRECT)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    You have successfully bypassed the terminal guard! The mainframe security layer has leaked its first bypass character code.
                  </p>
                </div>

                {showLetterRevealed && (
                  <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" id="l1-letter-reveal">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">MAINFRAME BYPASS CIPHER KEY</span>
                    <strong className="text-3xl font-display font-black text-cyan-300" id="l1-revealed-key-char">R</strong>
                    <span className="text-[9px] text-slate-400 font-mono">Character stored to HUD register.</span>
                  </div>
                )}

                <button
                  onClick={handleBypassSuccess}
                  className="btn-primary w-full py-3 rounded-xl text-xs font-display font-black tracking-wider cursor-pointer mt-2"
                  id="l1-success-proceed-btn"
                >
                  TRANSMIT CIPHER & ENTER SECTOR 2
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-w-md" id="l1-fail-card">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse" id="l1-fail-icon-box">
                  <AlertTriangle className="w-9 h-9 text-rose-500" id="l1-fail-icon" />
                </div>
                <div className="space-y-1" id="l1-fail-text">
                  <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-black">BYPASS FAILURE</span>
                  <h3 className="text-xl font-display font-black text-white">FIREWALL SECURED ({correctCount}/6 CORRECT)</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    You need to match at least <strong className="text-cyan-400">5 correct answers</strong> to decypher the gate sequence. System load has been penalized. Try again!
                  </p>
                </div>

                <div className="flex gap-4 mt-2" id="l1-fail-btn-row">
                  <button
                    onClick={handleRetry}
                    className="btn-secondary w-full py-2.5 rounded-xl text-xs font-display font-bold uppercase tracking-wider cursor-pointer border border-white/10"
                    id="l1-fail-retry-btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5 inline-block mr-1.5" id="l1-retry-icon" />
                    RETRY TERMINAL BYPASS
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
