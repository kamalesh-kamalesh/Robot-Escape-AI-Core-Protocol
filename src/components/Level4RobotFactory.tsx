/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ShieldAlert, CheckCircle, AlertTriangle, RefreshCw, ArrowRight, Shield, Radar } from 'lucide-react';
import { audio } from '../utils/audio';

interface Level4Props {
  onSuccess: (scoreBonus: number) => void;
  onFailure: (damage: number) => void;
}

interface NavPuzzle {
  id: number;
  title: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export default function Level4RobotFactory({ onSuccess, onFailure }: Level4Props) {
  const [activeStage, setActiveStage] = useState<number>(1); // Stages 1 to 4
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showLetterRevealed, setShowLetterRevealed] = useState<boolean>(false);

  const puzzles: NavPuzzle[] = [
    {
      id: 1,
      title: "ROTATIONAL STEER HEADING",
      question: "Drone R7 is currently hovering and facing North. Its flight controller registers a 'TURN 90° RIGHT' command. What is its new orientation heading?",
      options: ["West (270°)", "South (180°)", "East (90°)", "North-East (45°)"],
      correctIdx: 2,
      explanation: "A 90° clockwise rotation from North (0°) directs the heading vector directly to East (90°)."
    },
    {
      id: 2,
      title: "ENVIRONMENTAL HAZARD INTEGRITY",
      question: "Drone chassis must undergo outdoor high-humidity deployments. What is the standard design choice to protect internal telemetry lines from sudden water hazards?",
      options: ["Conductive copper plating", "Hermetically sealed IP67 waterproof casing", "Open ventilation vents", "Exposed terminal ribbon fibers"],
      correctIdx: 1,
      explanation: "An IP67 rated dust and waterproof enclosure prevents moisture molecules from breaching and short-circuiting electrical contacts."
    },
    {
      id: 3,
      title: "RADAR GRID SHORTEST PATH ANALYSIS",
      question: "Analyze the 5x5 navigation array below. The drone starts at coordinates (0,0) and needs to arrive at (4,4). A solid wall barrier blocks column 2 from row 0 to 3. What is the shortest move sequence (Up, Down, Left, Right) to reach the target?",
      options: ["6 steps", "8 steps", "10 steps", "12 steps"],
      correctIdx: 1,
      explanation: "To route around the vertical wall at column 2, the shortest path moves down to the bottom corridor: (0,0) → (0,4) → (4,4), totaling exactly 8 moves."
    },
    {
      id: 4,
      title: "GPS SIGNAL FAILURE RECOVERY",
      question: "During factory flight, primary GPS signals are blocked by thick concrete walls. Which relative distance-ranging sensor can map surface walls and obstacles to navigate?",
      options: ["Photoresistor LDR", "Analog Temperature Thermistor", "LiDAR Laser Ranging Scanner", "Linear Servo Actuator"],
      correctIdx: 2,
      explanation: "LiDAR (Light Detection and Ranging) shoots rapid laser pulses to map physical surroundings, creating real-time 3D point cloud obstacles."
    }
  ];

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedIdx(idx);
    audio.playBeep(650, 0.05, 'triangle');
  };

  const handleVerify = () => {
    if (selectedIdx === null) return;
    const isCorrect = selectedIdx === puzzles[activeStage - 1].correctIdx;
    setShowFeedback(true);

    if (isCorrect) {
      audio.playSuccess();
    } else {
      audio.playError();
      onFailure(12); // penalize
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedIdx(null);
    if (activeStage < 4) {
      setActiveStage(prev => prev + 1);
      audio.playBeep(720, 0.05, 'sine');
    } else {
      setIsFinished(true);
      setShowLetterRevealed(true);
      audio.playPowerRestored();
    }
  };

  const handleRetry = () => {
    setActiveStage(1);
    setSelectedIdx(null);
    setShowFeedback(false);
    setIsFinished(false);
    setShowLetterRevealed(false);
    audio.playBeep(440, 0.1, 'sine');
  };

  const currentP = puzzles[activeStage - 1];

  return (
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5" id="level-4-root">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3" id="level-4-header">
        <div className="flex items-center gap-2" id="level-4-title-group">
          <Compass className="w-5 h-5 text-cyan-400" id="l4-compass-icon" />
          <span className="font-display font-black tracking-wider text-sm uppercase">STAGE 4: COGNITIVE NAVIGATION FLIGHT</span>
        </div>
        <div className="text-xs font-mono text-white/50" id="l4-step-indicator">
          TELEMETRY UNIT {activeStage} OF 4
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col gap-5 min-h-[350px] justify-center" id="l4-terminal">
        {/* Ambient grids */}
        <div className="absolute inset-0 bg-radial-grid opacity-10 pointer-events-none" id="l4-bg-grid" />

        {!isFinished ? (
          <div className="relative z-10 w-full flex flex-col md:flex-row gap-6 max-w-3xl mx-auto" id="l4-interactive-box">
            
            {/* Left Column: Visual Asset Render */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black/60 rounded-2xl border border-white/5" id="l4-visual-col">
              
              {activeStage === 1 && (
                <div className="flex flex-col items-center gap-4 animate-fadeIn" id="v-heading-box">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">DRONE GYROSCOPE COORDINATE</span>
                  <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 relative flex items-center justify-center" id="compass-wheel">
                    <div className="absolute -top-1 font-mono text-[9px] text-rose-400 font-bold">N</div>
                    <div className="absolute -right-1 font-mono text-[9px] text-slate-400 font-bold">E</div>
                    <div className="absolute -bottom-1 font-mono text-[9px] text-slate-400 font-bold">S</div>
                    <div className="absolute -left-1 font-mono text-[9px] text-slate-400 font-bold">W</div>
                    {/* Steer Needle */}
                    <div className="w-1.5 h-16 bg-gradient-to-t from-transparent via-cyan-400 to-rose-400 rounded-full transition-all duration-500 transform" style={{ transform: selectedIdx === 2 ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Heading vector angle.</span>
                </div>
              )}

              {activeStage === 2 && (
                <div className="flex flex-col items-center gap-4 animate-fadeIn" id="v-shield-box">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">WATER INTRUSION TEST</span>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-900 to-indigo-950 border-2 border-cyan-400 flex items-center justify-center relative overflow-hidden" id="hull-box">
                    <Shield className="w-10 h-10 text-cyan-300 animate-pulse" />
                    {/* CSS Water lines */}
                    <div className="absolute inset-x-0 bottom-0 h-4 bg-cyan-500/20" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">IP67 Enclosure Sealed.</span>
                </div>
              )}

              {activeStage === 3 && (
                <div className="flex flex-col items-center gap-3 animate-fadeIn" id="v-grid-box">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">5x5 COORDINATE NAVIGATION ARRAY</span>
                  <div className="grid grid-cols-5 gap-1 bg-black/40 p-2 rounded-xl border border-white/5" id="navigation-grid">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const x = i % 5;
                      const y = Math.floor(i / 5);
                      const isStart = x === 0 && y === 0;
                      const isEnd = x === 4 && y === 4;
                      // Wall column 2 rows 0 to 3
                      const isWall = x === 2 && y <= 3;
                      
                      let cellStyle = "bg-white/5 border border-white/5";
                      if (isStart) cellStyle = "bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-[8px] font-black";
                      else if (isEnd) cellStyle = "bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-[8px] font-black";
                      else if (isWall) cellStyle = "bg-rose-500/20 border border-rose-500/50";

                      return (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[7px] font-mono ${cellStyle}`}
                          title={`(${x},${y})`}
                        >
                          {isStart ? "S" : isEnd ? "E" : isWall ? "█" : ""}
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-mono text-rose-300 text-center">█ Solid barrier at Column 2</span>
                </div>
              )}

              {activeStage === 4 && (
                <div className="flex flex-col items-center gap-3 animate-fadeIn" id="v-radar-box">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">LASER LiDAR FREQUENCY SCAN</span>
                  <div className="w-24 h-24 bg-black border-2 border-emerald-500 rounded-full flex items-center justify-center relative overflow-hidden" id="radar-circle">
                    <Radar className="w-12 h-12 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
                    <div className="absolute inset-0 bg-radial-grid opacity-20" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Reflective laser tracking.</span>
                </div>
              )}

            </div>

            {/* Right Column: Information & Options Stack */}
            <div className="flex-2 flex flex-col gap-4 w-full" id="l4-options-col">
              <div className="space-y-1" id="l4-lbl-box">
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block">TELEMETRY COMPILATION NODE</span>
                <h3 className="text-sm font-display font-black text-white uppercase tracking-wider" id="l4-puzzle-heading">
                  {currentP.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium" id="l4-question-text">
                  {currentP.question}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 w-full" id="l4-options-stack">
                {currentP.options.map((option, idx) => {
                  const isSelected = selectedIdx === idx;
                  let btnStyle = "bg-black/40 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20";
                  
                  if (showFeedback) {
                    if (idx === currentP.correctIdx) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]";
                    } else {
                      btnStyle = "bg-black/20 border-white/5 text-slate-500 opacity-40 cursor-not-allowed";
                    }
                  } else if (isSelected) {
                    btnStyle = "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showFeedback}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-display font-bold tracking-wide transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                      id={`l4-option-btn-${idx}`}
                    >
                      <span>{option}</span>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300' : 'border-white/10 text-transparent'
                      }`} id={`l4-option-dot-${idx}`}>
                        •
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-4 flex flex-col gap-2" id="l4-actions-box">
                {showFeedback && (
                  <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-[10px] text-slate-400 font-medium leading-relaxed animate-fadeIn" id="l4-explanation">
                    <span className="text-cyan-400 font-bold block mb-0.5">GUIDANCE CALIBRATION:</span>
                    {currentP.explanation}
                  </div>
                )}

                <div className="flex justify-end" id="l4-btn-row">
                  {!showFeedback ? (
                    <button
                      onClick={handleVerify}
                      disabled={selectedIdx === null}
                      className={`btn-primary px-6 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-2 cursor-pointer ${
                        selectedIdx === null ? 'opacity-40 cursor-not-allowed hover:shadow-none' : ''
                      }`}
                      id="l4-verify-btn"
                    >
                      <Radar className="w-3.5 h-3.5 text-cyan-950 animate-pulse" id="l4-verify-icon" />
                      SUBMIT GUIDANCE VECTOR
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="btn-primary px-6 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center gap-2 cursor-pointer"
                      id="l4-next-btn"
                    >
                      <span>{activeStage === 4 ? "COMPILED VECTORS" : "NEXT GUIDANCE UNIT"}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-950" id="l4-next-icon" />
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Finished Screen */
          <div className="flex flex-col items-center justify-center text-center gap-4 relative z-10 p-4" id="l4-finished-panel">
            <div className="space-y-4 max-w-md" id="l4-success-card">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce" id="l4-success-icon-box">
                <CheckCircle className="w-9 h-9 text-emerald-400" id="l4-success-icon" />
              </div>
              <div className="space-y-1" id="l4-success-text">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black">ROUTES CONFIRMED</span>
                <h3 className="text-xl font-display font-black text-white">AUTONOMOUS STEER ENGAGED (4/4 CORRECT)</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Flight controls compiled perfectly! The drone has maneuvered safely through Sector 4 and leaked its security cipher key letter.
                </p>
              </div>

              {showLetterRevealed && (
                <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse" id="l4-letter-reveal">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">MAINFRAME BYPASS CIPHER KEY</span>
                  <strong className="text-3xl font-display font-black text-cyan-300" id="l4-revealed-key-char">O</strong>
                  <span className="text-[9px] text-slate-400 font-mono">Character stored to HUD register.</span>
                </div>
              )}

              <button
                onClick={() => onSuccess(250)}
                className="btn-primary w-full py-3 rounded-xl text-xs font-display font-black tracking-wider cursor-pointer mt-2"
                id="l4-success-proceed-btn"
              >
                TRANSMIT CIPHER & ENTER SECTOR 5
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
