/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, HelpCircle, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, ArrowDown } from 'lucide-react';
import { audio } from '../utils/audio';

interface Level3Props {
  onSuccess: (scoreBonus: number) => void;
  onFailure: (damage: number) => void;
}

export default function Level3PowerRoom({ onSuccess, onFailure }: Level3Props) {
  const [activeStage, setActiveStage] = useState<number>(1); // Stages 1 to 4
  const [stage1Chain, setStage1Chain] = useState<string[]>([]);
  const [stage2Chain, setStage2Chain] = useState<string[]>([]);
  const [selectedCalcOption, setSelectedCalcOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showLetterRevealed, setShowLetterRevealed] = useState<boolean>(false);

  // Constants
  const stage1Options = ["LED Module", "12V Battery Source", "Toggle Switch"];
  const stage1Correct = ["12V Battery Source", "Toggle Switch", "LED Module"];

  const stage2Options = ["Servo Actuator", "Regulated Power Supply", "Microcontroller"];
  const stage2Correct = ["Regulated Power Supply", "Microcontroller", "Servo Actuator"];

  // stage 3 calculation options
  const stage3Choices = [
    { text: "50 mA", correct: false },
    { text: "27 mA (0.027A)", correct: true },
    { text: "10 mA", correct: false },
    { text: "100 mA", correct: false }
  ];

  // stage 4 calculation options
  const stage4Choices = [
    { text: "2.0 V", correct: false },
    { text: "9.0 V", correct: false },
    { text: "4.4 V", correct: true },
    { text: "5.0 V", correct: false }
  ];

  const handleStage1Click = (item: string) => {
    if (showFeedback) return;
    if (stage1Chain.includes(item)) {
      setStage1Chain(prev => prev.filter(x => x !== item));
    } else {
      setStage1Chain(prev => [...prev, item]);
    }
    audio.playBeep(600, 0.04, 'triangle');
  };

  const handleStage2Click = (item: string) => {
    if (showFeedback) return;
    if (stage2Chain.includes(item)) {
      setStage2Chain(prev => prev.filter(x => x !== item));
    } else {
      setStage2Chain(prev => [...prev, item]);
    }
    audio.playBeep(620, 0.04, 'triangle');
  };

  const handleSubmitWiringStage = (stageNum: number) => {
    const chain = stageNum === 1 ? stage1Chain : stage2Chain;
    const correct = stageNum === 1 ? stage1Correct : stage2Correct;

    // Check equality
    const isCorrect = chain.length === correct.length && chain.every((val, i) => val === correct[i]);
    setShowFeedback(true);

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
      onFailure(12); // penalize power load
    }
  };

  const handleSubmitCalcStage = (stageNum: number) => {
    if (selectedCalcOption === null) return;
    const choices = stageNum === 3 ? stage3Choices : stage4Choices;
    const isCorrect = choices[selectedCalcOption].correct;
    setShowFeedback(true);

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
      onFailure(15);
    }
  };

  const handleNextStage = () => {
    setShowFeedback(false);
    setSelectedCalcOption(null);
    if (activeStage < 4) {
      setActiveStage(prev => prev + 1);
      audio.playBeep(700, 0.05, 'sine');
    } else {
      setIsFinished(true);
      setShowLetterRevealed(true);
      audio.playPowerRestored();
    }
  };

  const handleRetryAll = () => {
    setActiveStage(1);
    setStage1Chain([]);
    setStage2Chain([]);
    setSelectedCalcOption(null);
    setShowFeedback(false);
    setIsFinished(false);
    setShowLetterRevealed(false);
    audio.playBeep(440, 0.1, 'sine');
  };

  return (
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5" id="level-3-root">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3" id="level-3-header">
        <div className="flex items-center gap-2" id="level-3-title-group">
          <Zap className="w-5 h-5 text-cyan-400" id="l3-zap-icon" />
          <span className="font-display font-black tracking-wider text-sm uppercase">STAGE 3: CIRCUIT LOOP TROUBLESHOOT</span>
        </div>
        <div className="text-xs font-mono text-white/50" id="l3-step-indicator">
          DIAGNOSTIC BLOCK {activeStage} OF 4
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-5 min-h-[340px] justify-center" id="l3-terminal">
        {/* Ambient background grids */}
        <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" id="l3-bg-grid" />

        {!isFinished ? (
          <div className="relative z-10 w-full flex flex-col gap-5 max-w-2xl mx-auto" id="l3-interactive-box">
            
            {/* STAGE 1: SERIES WIRING LOOP */}
            {activeStage === 1 && (
              <div className="space-y-4 animate-fadeIn" id="l3-stage-1">
                <div className="text-center space-y-1" id="s1-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">CIRCUIT ASSEMBLY NODE 01</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    WIRING CHALLENGE: ARRANGE CURRENT LOOP IN SERIES SEQUENCE
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Click the components below in correct sequence representing standard circuit flow, starting from the source battery supply.
                  </p>
                </div>

                {/* Grid Options Selection */}
                <div className="flex flex-wrap justify-center gap-3 py-2" id="s1-options-row">
                  {stage1Options.map((item, idx) => {
                    const isSelected = stage1Chain.includes(item);
                    const position = stage1Chain.indexOf(item) + 1;
                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => handleStage1Click(item)}
                        className={`px-4 py-3 rounded-xl border text-xs font-display font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5'
                        }`}
                        id={`s1-opt-btn-${idx}`}
                      >
                        {isSelected && (
                          <span className="w-5 h-5 rounded-md bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-mono font-black text-[10px]">
                            {position}
                          </span>
                        )}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Connection Chain Display */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2" id="s1-chain-viz">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">ACTIVE POWER CONNECTOR PIPELINE:</span>
                  <div className="flex items-center gap-2 flex-wrap justify-center text-xs font-mono" id="s1-pipeline-row">
                    {stage1Chain.length === 0 ? (
                      <span className="text-slate-500 italic">[Waiting for connection sequence...]</span>
                    ) : (
                      stage1Chain.map((item, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 text-cyan-300 font-bold">
                            {item}
                          </span>
                          {i < stage1Chain.length - 1 && <span className="text-cyan-500 font-black">→</span>}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback Box */}
                {showFeedback && (
                  <div className="p-3 rounded-xl border text-center text-xs font-medium animate-fadeIn" id="s1-feedback">
                    {stage1Chain.length === stage1Correct.length && stage1Chain.every((val, i) => val === stage1Correct[i]) ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5" id="s1-fb-ok">
                        <strong>LOOP COMPLETED successfully:</strong> Battery sources the current, flows through the control Toggle Switch, and safely illuminates the LED diode.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5" id="s1-fb-err">
                        <strong>WIRING BREAK DETECTED:</strong> Current loop cannot form! Current must stream: Battery (Source) → Switch (Control) → LED (Load).
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: ROBOT ACTUATOR CONTROL LOOP */}
            {activeStage === 2 && (
              <div className="space-y-4 animate-fadeIn" id="l3-stage-2">
                <div className="text-center space-y-1" id="s2-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">CIRCUIT ASSEMBLY NODE 02</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    WIRING CHALLENGE: ROBOT ARM POWER AND CONTROL ROUTE
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Arrange the devices in correct sequence representing command power flow to route and actuate the mechanical servo arm safely.
                  </p>
                </div>

                {/* Grid Options Selection */}
                <div className="flex flex-wrap justify-center gap-3 py-2" id="s2-options-row">
                  {stage2Options.map((item, idx) => {
                    const isSelected = stage2Chain.includes(item);
                    const position = stage2Chain.indexOf(item) + 1;
                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => handleStage2Click(item)}
                        className={`px-4 py-3 rounded-xl border text-xs font-display font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 shadow-[0_0_10px_rgba(129,140,248,0.2)]'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5'
                        }`}
                        id={`s2-opt-btn-${idx}`}
                      >
                        {isSelected && (
                          <span className="w-5 h-5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-mono font-black text-[10px]">
                            {position}
                          </span>
                        )}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Connection Chain Display */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2" id="s2-chain-viz">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">ACTIVE ROBOTICS PIPELINE CHAIN:</span>
                  <div className="flex items-center gap-2 flex-wrap justify-center text-xs font-mono" id="s2-pipeline-row">
                    {stage2Chain.length === 0 ? (
                      <span className="text-slate-500 italic">[Waiting for connection sequence...]</span>
                    ) : (
                      stage2Chain.map((item, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 text-indigo-300 font-bold">
                            {item}
                          </span>
                          {i < stage2Chain.length - 1 && <span className="text-indigo-400 font-black">→</span>}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback Box */}
                {showFeedback && (
                  <div className="p-3 rounded-xl border text-center text-xs font-medium animate-fadeIn" id="s2-feedback">
                    {stage2Chain.length === stage2Correct.length && stage2Chain.every((val, i) => val === stage2Correct[i]) ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5" id="s2-fb-ok">
                        <strong>ROUTING STABILIZED:</strong> The Regulated Power Supply feeds voltage to the Arduino MCU chip, which generates safe high-frequency PWM pulses to command the high-precision Servo Actuator.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5" id="s2-fb-err">
                        <strong>SIGNAL ROUTE BREAKDOWN:</strong> Unordered path will short-circuit! Command path must run: Power Supply (Energy Source) → Microcontroller (Logical processing) → Servo Actuator (Actuation target).
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: OHM'S LAW CALCULATION 01 */}
            {activeStage === 3 && (
              <div className="space-y-4 animate-fadeIn" id="l3-stage-3">
                <div className="text-center space-y-1" id="s3-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">ELECTRICAL CALCULATOR NODE 03</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    OHM'S LAW: CURRENT RATE CALCULATION
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    A microcontroller circuit is powered by a <strong className="text-cyan-400">9V Battery</strong> through a safety resistor of <strong className="text-cyan-400">330 Ohms</strong>. What is the current flowing?
                  </p>
                </div>

                {/* Circuit Details Visual Card */}
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-center items-center gap-6 font-mono text-xs text-center max-w-sm mx-auto" id="s3-schematic">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">VOLTAGE (V)</span>
                    <strong className="text-white text-base">9 V</strong>
                  </div>
                  <div className="text-cyan-500 font-bold text-xl">/</div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">RESISTANCE (R)</span>
                    <strong className="text-white text-base">330 Ω</strong>
                  </div>
                  <div className="text-cyan-500 font-bold text-xl">=</div>
                  <div className="space-y-1">
                    <span className="text-cyan-400 block">CURRENT (I)</span>
                    <strong className="text-cyan-300 text-base">? A</strong>
                  </div>
                </div>

                {/* Multiple Choice Choices */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto" id="s3-choices-grid">
                  {stage3Choices.map((choice, idx) => {
                    const isSelected = selectedCalcOption === idx;
                    let cStyle = "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5";

                    if (showFeedback) {
                      if (choice.correct) {
                        cStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        cStyle = "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
                      } else {
                        cStyle = "bg-black/20 border-white/5 text-slate-600 opacity-40 cursor-not-allowed";
                      }
                    } else if (isSelected) {
                      cStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => setSelectedCalcOption(idx)}
                        className={`p-3 rounded-xl border font-display font-bold text-xs tracking-wide transition-all cursor-pointer ${cStyle}`}
                        id={`s3-choice-btn-${idx}`}
                      >
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {showFeedback && (
                  <div className="p-3 rounded-xl border text-center text-xs font-medium animate-fadeIn" id="s3-feedback-box">
                    {selectedCalcOption !== null && stage3Choices[selectedCalcOption].correct ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>CALCULATION VERIFIED:</strong> Current (I) = V / R = 9 / 330 = 0.0272 Amps, which converts precisely to <strong>27 milliamps (mA)</strong>.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>CALCULATION DISCREPANCY:</strong> Invalid current load. Current (I) is solved via dividing Voltage by Resistance (9V / 330Ω = ~27mA).
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4: OHM'S LAW CALCULATION 02 */}
            {activeStage === 4 && (
              <div className="space-y-4 animate-fadeIn" id="l3-stage-4">
                <div className="text-center space-y-1" id="s4-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">ELECTRICAL CALCULATOR NODE 04</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    OHM'S LAW: RESISTOR VOLTAGE DROP
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    A robotics telemetry resistor has a measured value of <strong className="text-cyan-400">220 Ohms</strong>. The loop diagnostics report a current of <strong className="text-cyan-400">0.02 Amps</strong> flowing through it. What is the voltage across the resistor?
                  </p>
                </div>

                {/* Circuit Details Visual Card */}
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex justify-center items-center gap-6 font-mono text-xs text-center max-w-sm mx-auto" id="s4-schematic">
                  <div className="space-y-1">
                    <span className="text-slate-400 block">CURRENT (I)</span>
                    <strong className="text-white text-base">0.02 A</strong>
                  </div>
                  <div className="text-cyan-500 font-bold text-xl">*</div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block">RESISTANCE (R)</span>
                    <strong className="text-white text-base">220 Ω</strong>
                  </div>
                  <div className="text-cyan-500 font-bold text-xl">=</div>
                  <div className="space-y-1">
                    <span className="text-cyan-400 block">VOLTAGE (V)</span>
                    <strong className="text-cyan-300 text-base">? V</strong>
                  </div>
                </div>

                {/* Multiple Choice Choices */}
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto" id="s4-choices-grid">
                  {stage4Choices.map((choice, idx) => {
                    const isSelected = selectedCalcOption === idx;
                    let cStyle = "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5";

                    if (showFeedback) {
                      if (choice.correct) {
                        cStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        cStyle = "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
                      } else {
                        cStyle = "bg-black/20 border-white/5 text-slate-600 opacity-40 cursor-not-allowed";
                      }
                    } else if (isSelected) {
                      cStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => setSelectedCalcOption(idx)}
                        className={`p-3 rounded-xl border font-display font-bold text-xs tracking-wide transition-all cursor-pointer ${cStyle}`}
                        id={`s4-choice-btn-${idx}`}
                      >
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Box */}
                {showFeedback && (
                  <div className="p-3 rounded-xl border text-center text-xs font-medium animate-fadeIn" id="s4-feedback-box">
                    {selectedCalcOption !== null && stage4Choices[selectedCalcOption].correct ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>CALCULATION VERIFIED:</strong> Voltage (V) = I * R = 0.02A * 220Ω = <strong>4.4 Volts (V)</strong>.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>CALCULATION DISCREPANCY:</strong> Invalid voltage potential. Voltage drop is resolved by multiplying Current by Resistance (0.02A * 220Ω = 4.4V).
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls / Actions */}
            <div className="border-t border-white/10 pt-4 flex justify-end" id="l3-actions-bottom">
              {!showFeedback ? (
                <button
                  disabled={
                    (activeStage === 1 && stage1Chain.length < stage1Correct.length) ||
                    (activeStage === 2 && stage2Chain.length < stage2Correct.length) ||
                    ((activeStage === 3 || activeStage === 4) && selectedCalcOption === null)
                  }
                  onClick={() => {
                    if (activeStage === 1 || activeStage === 2) handleSubmitWiringStage(activeStage);
                    else handleSubmitCalcStage(activeStage);
                  }}
                  className={`btn-primary px-6 py-2.5 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-1.5 cursor-pointer ${
                    ((activeStage === 1 && stage1Chain.length < stage1Correct.length) ||
                    (activeStage === 2 && stage2Chain.length < stage2Correct.length) ||
                    ((activeStage === 3 || activeStage === 4) && selectedCalcOption === null))
                      ? 'opacity-40 cursor-not-allowed hover:shadow-none'
                      : ''
                  }`}
                  id="l3-submit-stage-btn"
                >
                  <CheckCircle className="w-3.5 h-3.5" id="l3-submit-icon" />
                  SUBMIT DIAGNOSTIC
                </button>
              ) : (
                <button
                  onClick={handleNextStage}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-1.5 cursor-pointer animate-pulse"
                  id="l3-next-stage-btn"
                >
                  <span>{activeStage === 4 ? "COMPILE ALL UNITS" : "NEXT POWER SECTOR"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-950" id="l3-next-icon" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10 p-4" id="l3-finished-panel">
            <div className="space-y-4 max-w-md animate-scaleUp" id="l3-success-card">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce" id="l3-success-icon-box">
                <CheckCircle className="w-9 h-9 text-emerald-400" id="l3-success-icon" />
              </div>
              <div className="space-y-1" id="l3-success-text">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">POWER MATRIX ONLINE</span>
                <h3 className="text-xl font-display font-black text-white">POWER GRID OVERRIDDEN (4/4 CORRECT)</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  The auxiliary battery power lines are fully configured and functional! Sector 3 has been restored and has decoded its cipher character.
                </p>
              </div>

              {showLetterRevealed && (
                <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" id="l3-letter-reveal">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">MAINFRAME BYPASS CIPHER KEY</span>
                  <strong className="text-3xl font-display font-black text-cyan-300" id="l3-revealed-key-char">B</strong>
                  <span className="text-[9px] text-slate-400 font-mono">Character stored to HUD register.</span>
                </div>
              )}

              <button
                onClick={() => onSuccess(250)}
                className="btn-primary w-full py-3 rounded-xl text-xs font-display font-black tracking-wider cursor-pointer mt-2"
                id="l3-success-proceed-btn"
              >
                TRANSMIT CIPHER & ENTER SECTOR 4
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
