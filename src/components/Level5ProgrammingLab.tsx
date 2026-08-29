/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Code, Terminal, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, Play } from 'lucide-react';
import { audio } from '../utils/audio';

interface Level5Props {
  onSuccess: (scoreBonus: number) => void;
  onFailure: (damage: number) => void;
}

export default function Level5ProgrammingLab({ onSuccess, onFailure }: Level5Props) {
  const [activeStage, setActiveStage] = useState<number>(1); // 1 to 5
  const [stageChain, setStageChain] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showLetterRevealed, setShowLetterRevealed] = useState<boolean>(false);

  // Stages definition
  // STAGE 1: Sequence: Start -> Move -> Stop
  const stage1Options = ["Move", "Stop", "Start"];
  const stage1Correct = ["Start", "Move", "Stop"];

  // STAGE 2: Conditional: IF Obstacle -> Turn Right -> Move Forward
  const stage2Options = ["Move Forward", "IF Obstacle", "Turn Right"];
  const stage2Correct = ["IF Obstacle", "Turn Right", "Move Forward"];

  // STAGE 3: Loop Selection: Which loop matches "Move 5 steps"?
  const stage3Choices = [
    { text: "Repeat 5 Times { Move Forward }", correct: true },
    { text: "Forever { Move }", correct: false }
  ];

  // STAGE 4: Fill Missing: Start -> Move -> ________ -> Stop
  const stage4Choices = [
    { text: "IF Finish Detected", correct: true },
    { text: "IF Battery Low", correct: false },
    { text: "IF Turn Right", correct: false }
  ];

  // STAGE 5: Robotic Arm sequence: Start -> Open Gripper -> Move Forward -> Close Gripper -> Lift Arm
  const stage5Options = ["Move Forward", "Lift Arm", "Start", "Open Gripper", "Close Gripper"];
  const stage5Correct = ["Start", "Open Gripper", "Move Forward", "Close Gripper", "Lift Arm"];

  const handleBlockClick = (block: string) => {
    if (showFeedback) return;
    if (stageChain.includes(block)) {
      setStageChain(prev => prev.filter(x => x !== block));
    } else {
      setStageChain(prev => [...prev, block]);
    }
    audio.playBeep(600, 0.04, 'triangle');
  };

  const handleVerifySequence = (stageNum: number) => {
    const correct = stageNum === 1 ? stage1Correct : stageNum === 2 ? stage2Correct : stage5Correct;
    const isCorrect = stageChain.length === correct.length && stageChain.every((val, i) => val === correct[i]);
    setShowFeedback(true);

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
      onFailure(12);
    }
  };

  const handleVerifyChoice = (stageNum: number) => {
    if (selectedOption === null) return;
    const choices = stageNum === 3 ? stage3Choices : stage4Choices;
    const isCorrect = choices[selectedOption].correct;
    setShowFeedback(true);

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
      onFailure(12);
    }
  };

  const handleNextStage = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    setStageChain([]);
    if (activeStage < 5) {
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
    setStageChain([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsFinished(false);
    setShowLetterRevealed(false);
    audio.playBeep(440, 0.1, 'sine');
  };

  return (
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5" id="level-5-root">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3" id="level-5-header">
        <div className="flex items-center gap-2" id="level-5-title-group">
          <Code className="w-5 h-5 text-cyan-400" id="l5-code-icon" />
          <span className="font-display font-black tracking-wider text-sm uppercase">STAGE 5: FIRMWARE BLOCK COMPILER</span>
        </div>
        <div className="text-xs font-mono text-white/50" id="l5-step-indicator">
          COMPILER THREAD {activeStage} OF 5
        </div>
      </div>

      {/* Main Compiler Workspace */}
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-5 min-h-[355px] justify-center" id="l5-terminal">
        {/* Ambient grids */}
        <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" id="l5-bg-grid" />

        {!isFinished ? (
          <div className="relative z-10 w-full flex flex-col gap-5 max-w-2xl mx-auto" id="l5-interactive-box">
            
            {/* STAGE 1: BASIC CHASSIS ROUTE */}
            {activeStage === 1 && (
              <div className="space-y-4 animate-fadeIn" id="l5-stage-1">
                <div className="text-center space-y-1" id="l5-s1-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">COMPILER THREAD 01</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    PUZZLE 1: ARRANGE BLOCKS FOR FORWARD MOTION
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    The robotic chassis must initialize, advance forward, and cleanly terminate execution. Click the programming blocks in sequence.
                  </p>
                </div>

                {/* Scrambled Blocks Pool */}
                <div className="flex justify-center gap-2.5 py-2" id="l5-s1-pool">
                  {stage1Options.map((block, idx) => {
                    const isSelected = stageChain.includes(block);
                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => handleBlockClick(block)}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                            : 'bg-zinc-800 border-zinc-700 text-slate-300 hover:border-zinc-500'
                        }`}
                        id={`l5-s1-block-${idx}`}
                      >
                        {block}
                      </button>
                    );
                  })}
                </div>

                {/* Compiler Stack Output */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2" id="l5-s1-viz">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">COMPILE SEQUENCE PIPELINE:</span>
                  <div className="flex gap-2 items-center flex-wrap text-xs font-mono" id="l5-s1-pipeline">
                    {stageChain.length === 0 ? (
                      <span className="text-slate-500 italic">[Assemble code blocks...]</span>
                    ) : (
                      stageChain.map((block, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20 text-cyan-300 font-bold">
                            {block}
                          </span>
                          {i < stageChain.length - 1 && <span className="text-cyan-500">→</span>}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="text-center animate-fadeIn text-xs font-medium" id="l5-s1-feedback">
                    {stageChain.length === stage1Correct.length && stageChain.every((v, i) => v === stage1Correct[i]) ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>FIRMWARE COMPILED SUCCESSFULLY:</strong> Start initializes ports, Move sets DC motor PWM values, and Stop halts operations cleanly.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>COMPILER SYNTAX ERROR:</strong> Thread broke down! Execution order must compile: Start → Move → Stop.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: CONDITIONAL OBSTACLE */}
            {activeStage === 2 && (
              <div className="space-y-4 animate-fadeIn" id="l5-stage-2">
                <div className="text-center space-y-1" id="l5-s2-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">COMPILER THREAD 02</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    PUZZLE 2: CONDITIONAL INTERCEPT LOGIC
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Program the logic to handle collision prevention. Arrange blocks so the robot checks for obstacles, turns right to avoid, and then moves forward.
                  </p>
                </div>

                {/* Scrambled Pool */}
                <div className="flex justify-center gap-2.5 py-2" id="l5-s2-pool">
                  {stage2Options.map((block, idx) => {
                    const isSelected = stageChain.includes(block);
                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => handleBlockClick(block)}
                        className={`px-4 py-2 text-xs font-mono font-bold rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_8px_rgba(129,140,248,0.2)]'
                            : 'bg-zinc-800 border-zinc-700 text-slate-300 hover:border-zinc-500'
                        }`}
                        id={`l5-s2-block-${idx}`}
                      >
                        {block}
                      </button>
                    );
                  })}
                </div>

                {/* Pipeline */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2" id="l5-s2-viz">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">ACTIVE PROGRAM BLOCKS:</span>
                  <div className="flex gap-2 items-center flex-wrap text-xs font-mono" id="l5-s2-pipeline">
                    {stageChain.length === 0 ? (
                      <span className="text-slate-500 italic">[Assemble conditional blocks...]</span>
                    ) : (
                      stageChain.map((block, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/20 text-indigo-300 font-bold">
                            {block}
                          </span>
                          {i < stageChain.length - 1 && <span className="text-indigo-400">→</span>}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="text-center animate-fadeIn text-xs font-medium" id="l5-s2-feedback">
                    {stageChain.length === stage2Correct.length && stageChain.every((v, i) => v === stage2Correct[i]) ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>FIRMWARE INTERRUPT COMPILED:</strong> IF Obstacle intercepts the scan, Turn Right deviates, and Move Forward proceeds along the clear lane.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>CONDITIONAL PATH FAILURE:</strong> Crash risk detected! Order must structure: IF Obstacle → Turn Right → Move Forward.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 3: LOOP CHOOSER */}
            {activeStage === 3 && (
              <div className="space-y-4 animate-fadeIn" id="l5-stage-3">
                <div className="text-center space-y-1" id="l5-s3-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">COMPILER THREAD 03</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    PUZZLE 3: ITERATIVE CODE LOOPS
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    To conserve chassis processor cache, a robot needs to travel <strong className="text-cyan-400">exactly 5 forward steps</strong> before halting. Which loop structure compiles this correctly?
                  </p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-2 max-w-md mx-auto py-2" id="l5-s3-options">
                  {stage3Choices.map((choice, idx) => {
                    const isSelected = selectedOption === idx;
                    let bStyle = "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5";

                    if (showFeedback) {
                      if (choice.correct) {
                        bStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        bStyle = "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
                      } else {
                        bStyle = "bg-black/20 border-white/5 text-slate-600 opacity-40 cursor-not-allowed";
                      }
                    } else if (isSelected) {
                      bStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => setSelectedOption(idx)}
                        className={`p-3 rounded-xl border text-left font-mono font-bold text-xs cursor-pointer transition-all ${bStyle}`}
                        id={`l5-s3-choice-${idx}`}
                      >
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="text-center animate-fadeIn text-xs font-medium" id="l5-s3-feedback">
                    {selectedOption !== null && stage3Choices[selectedOption].correct ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>LOOP COMPILER VALID:</strong> 'Repeat 5 Times' loops the instructions precisely 5 times and then falls through to stop execution, satisfying requirements.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>CAUTION: INFINITE LOOP DETECTED:</strong> 'Forever' will trigger infinite forward motion, draining energy and crashing into the perimeter wall.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4: MISSING BLOCK FILLER */}
            {activeStage === 4 && (
              <div className="space-y-4 animate-fadeIn" id="l5-stage-4">
                <div className="text-center space-y-1" id="l5-s4-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">COMPILER THREAD 04</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    PUZZLE 4: FILL THE MISSING CONDITIONAL CODE
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    A drone is programmed to advance forward until it arrives at the landing site, then power down. Fill the missing block:
                  </p>
                </div>

                {/* Schematic Line */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex gap-2 justify-center items-center font-mono text-xs max-w-md mx-auto" id="l5-s4-line">
                  <span className="text-slate-400">Start</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-400">Move</span>
                  <span className="text-slate-600">→</span>
                  <span className="bg-cyan-500/20 px-2 py-1 rounded border-2 border-dashed border-cyan-400/50 text-cyan-300 font-bold animate-pulse">
                    {selectedOption !== null ? stage4Choices[selectedOption].text : "[ MISSING BLOCK ]"}
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-400">Stop</span>
                </div>

                {/* Options Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2" id="l5-s4-options">
                  {stage4Choices.map((choice, idx) => {
                    const isSelected = selectedOption === idx;
                    let bStyle = "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5";

                    if (showFeedback) {
                      if (choice.correct) {
                        bStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]";
                      } else if (isSelected) {
                        bStyle = "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.3)]";
                      } else {
                        bStyle = "bg-black/20 border-white/5 text-slate-600 opacity-40 cursor-not-allowed";
                      }
                    } else if (isSelected) {
                      bStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.25)]";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => setSelectedOption(idx)}
                        className={`p-2.5 rounded-xl border text-center font-mono font-bold text-xs cursor-pointer transition-all ${bStyle}`}
                        id={`l5-s4-choice-${idx}`}
                      >
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="text-center animate-fadeIn text-xs font-medium" id="l5-s4-feedback">
                    {selectedOption !== null && stage4Choices[selectedOption].correct ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>CONDITIONAL INTERRUPT VERIFIED:</strong> Placing 'IF Finish Detected' ensures the controller monitors landing telemetry and shuts motors off at the destination.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>INSUFFICIENT CONDITION:</strong> The drone will either halt pre-emptively or miss the landing pads, leading to terminal diagnostics crash.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STAGE 5: ROBOTIC ARM SEQ */}
            {activeStage === 5 && (
              <div className="space-y-4 animate-fadeIn" id="l5-stage-5">
                <div className="text-center space-y-1" id="l5-s5-intro">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">COMPILER THREAD 05</span>
                  <h3 className="text-sm md:text-base font-display font-black text-white uppercase">
                    PUZZLE 5: ROBOTIC ARM OBJECT SELECTION
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Program the robotic arm sequence to cleanly grab and retrieve a microchip. Order commands from initialization to hoisting.
                  </p>
                </div>

                {/* Scrambled Blocks Pool */}
                <div className="flex flex-wrap justify-center gap-2 py-1" id="l5-s5-pool">
                  {stage5Options.map((block, idx) => {
                    const isSelected = stageChain.includes(block);
                    return (
                      <button
                        key={idx}
                        disabled={showFeedback}
                        onClick={() => handleBlockClick(block)}
                        className={`px-3.5 py-2 text-xs font-mono font-bold rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.2)]'
                            : 'bg-zinc-800 border-zinc-700 text-slate-300 hover:border-zinc-500'
                        }`}
                        id={`l5-s5-block-${idx}`}
                      >
                        {block}
                      </button>
                    );
                  })}
                </div>

                {/* Compiler Stack Output */}
                <div className="bg-black/60 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2" id="l5-s5-viz">
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">COMPILE CODE PIPELINE:</span>
                  <div className="flex gap-1.5 items-center flex-wrap text-xs font-mono justify-center" id="l5-s5-pipeline">
                    {stageChain.length === 0 ? (
                      <span className="text-slate-500 italic">[Assemble action sequence...]</span>
                    ) : (
                      stageChain.map((block, i) => (
                        <React.Fragment key={i}>
                          <span className="bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20 text-emerald-300 font-bold">
                            {block}
                          </span>
                          {i < stageChain.length - 1 && <span className="text-emerald-400">→</span>}
                        </React.Fragment>
                      ))
                    )}
                  </div>
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className="text-center animate-fadeIn text-xs font-medium" id="l5-s5-feedback">
                    {stageChain.length === stage5Correct.length && stageChain.every((v, i) => v === stage5Correct[i]) ? (
                      <div className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 rounded-xl p-2.5">
                        <strong>ROBOTIC ARM COMPILED:</strong> Start → Open Gripper → Move Forward → Close Gripper → Lift Arm represents the correct physical extraction sequence.
                      </div>
                    ) : (
                      <div className="text-rose-400 bg-rose-500/10 border-rose-500/20 rounded-xl p-2.5">
                        <strong>MECHANICAL SEQUENCER ERROR:</strong> Claw jammed! Correct physical order: Start → Open Gripper (prepare) → Move Forward (align) → Close Gripper (grab) → Lift Arm (hoist).
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls / Actions */}
            <div className="border-t border-white/10 pt-4 flex justify-end" id="l5-actions-bottom">
              {!showFeedback ? (
                <button
                  disabled={
                    ((activeStage === 1 || activeStage === 2) && stageChain.length < (activeStage === 1 ? stage1Correct.length : stage2Correct.length)) ||
                    (activeStage === 5 && stageChain.length < stage5Correct.length) ||
                    ((activeStage === 3 || activeStage === 4) && selectedOption === null)
                  }
                  onClick={() => {
                    if (activeStage === 1 || activeStage === 2 || activeStage === 5) handleVerifySequence(activeStage);
                    else handleVerifyChoice(activeStage);
                  }}
                  className={`btn-primary px-6 py-2.5 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-1.5 cursor-pointer ${
                    (((activeStage === 1 || activeStage === 2) && stageChain.length < (activeStage === 1 ? stage1Correct.length : stage2Correct.length)) ||
                    (activeStage === 5 && stageChain.length < stage5Correct.length) ||
                    ((activeStage === 3 || activeStage === 4) && selectedOption === null))
                      ? 'opacity-40 cursor-not-allowed hover:shadow-none'
                      : ''
                  }`}
                  id="l5-submit-stage-btn"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" id="l5-compile-icon" />
                  COMPILE & RUN THREAD
                </button>
              ) : (
                <button
                  onClick={handleNextStage}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-1.5 cursor-pointer animate-pulse"
                  id="l5-next-stage-btn"
                >
                  <span>{activeStage === 5 ? "FINALIZE FIRMWARE" : "NEXT COMPILER THREAD"}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-950" id="l5-next-icon" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10 p-4" id="l5-finished-panel">
            <div className="space-y-4 max-w-md" id="l5-success-card">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce" id="l5-success-icon-box">
                <CheckCircle className="w-9 h-9 text-emerald-400" id="l5-success-icon" />
              </div>
              <div className="space-y-1" id="l5-success-text">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">FIRMWARE COMPLIED</span>
                <h3 className="text-xl font-display font-black text-white">COGNITIVE LOGIC STABLE (5/5 CORRECT)</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  The microprocessor logic registers are synchronized! Sector 5 is fully stable. Retrieve your decrypted cipher key character below.
                </p>
              </div>

              {showLetterRevealed && (
                <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" id="l5-letter-reveal">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">MAINFRAME BYPASS CIPHER KEY</span>
                  <strong className="text-3xl font-display font-black text-cyan-300" id="l5-revealed-key-char">T</strong>
                  <span className="text-[9px] text-slate-400 font-mono">Character stored to HUD register.</span>
                </div>
              )}

              <button
                onClick={() => onSuccess(300)}
                className="btn-primary w-full py-3 rounded-xl text-xs font-display font-black tracking-wider cursor-pointer mt-2"
                id="l5-success-proceed-btn"
              >
                TRANSMIT CIPHER & ENTER SECTOR 6
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
