/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShieldAlert, Zap, Timer } from 'lucide-react';

interface HUDProps {
  currentLevel: number;
  timeString: string;
  score: number;
  lives?: number;
  energy: number;
  objective: string;
}

export default function HUD({ currentLevel, timeString, score, energy, objective }: HUDProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl text-slate-200 font-sans select-none relative overflow-hidden" id="global-hud">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center" id="hud-grid-row">
        
        {/* Left Segment: Lives & Energy */}
        <div className="flex items-center gap-6 justify-between md:justify-start" id="hud-left-segment">
          <div className="flex flex-col gap-1.5" id="hud-lives-container">
            <span className="text-xs font-display text-white/50 uppercase tracking-[0.2em]" id="hud-lives-lbl">SYSTEM INTEGRITY</span>
            <div className="flex gap-2 items-center" id="hud-hearts-row">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-pulse" />
              <span className="tracking-widest text-xs bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-md font-display font-black flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                <span className="text-sm font-bold leading-none">∞</span> UNLIMITED
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 max-w-[150px]" id="hud-energy-container">
            <div className="flex items-center justify-between" id="hud-energy-lbl-row">
              <span className="text-xs font-display text-white/50 uppercase tracking-[0.2em]" id="hud-energy-lbl">POWER LOAD</span>
              <span className={`text-sm font-mono font-bold ${energy < 30 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} id="hud-energy-percent">
                {energy}%
              </span>
            </div>
            <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/10 p-0.5" id="hud-energy-track">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  energy < 30
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-gradient-to-r from-cyan-400 to-indigo-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
                }`}
                style={{ width: `${energy}%` }}
                id="hud-energy-bar"
              />
            </div>
          </div>
        </div>

        {/* Center Segment: Current Level Objective */}
        <div className="flex flex-col items-center justify-center text-center px-4 py-3 bg-black/40 rounded-xl border border-white/5" id="hud-center-segment">
          <div className="flex items-center gap-2 text-sm text-cyan-400 font-display font-black tracking-widest uppercase mb-1" id="hud-level-badge">
            <span className="w-1.5 h-4 bg-cyan-500 inline-block"></span>
            SECTOR {currentLevel === 7 ? 'FINAL' : currentLevel} // SECURE PASS
          </div>
          <span className="text-sm text-white/85 font-sans tracking-wide truncate max-w-xs md:max-w-md lg:max-w-lg font-medium mb-1.5" id="hud-objective-text">
            {objective}
          </span>
          
          {/* Escape Password Cipher Keys Progress Bar */}
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5" id="hud-cipher-keys-container">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-1.5">CIPHER KEY DECODE:</span>
            {['R', 'O', 'B', 'O', 'T', 'S'].map((letter, idx) => {
              const isUnlocked = currentLevel > idx + 1 || currentLevel === 7;
              return (
                <div
                  key={idx}
                  className={`w-7 h-7 rounded-md border flex items-center justify-center font-display font-black text-xs transition-all duration-300 ${
                    isUnlocked
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.2)]'
                      : 'bg-white/5 border-white/5 text-slate-600'
                  }`}
                  title={isUnlocked ? `Sector ${idx + 1} Letter: ${letter}` : `Sector ${idx + 1} Locked`}
                  id={`hud-cipher-key-${idx}`}
                >
                  {isUnlocked ? letter : '?'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Segment: Score & Countdown */}
        <div className="flex items-center justify-between md:justify-end gap-6" id="hud-right-segment">
          <div className="flex flex-col items-end gap-1" id="hud-score-container">
            <span className="text-[10px] font-display text-white/50 uppercase tracking-[0.2em]" id="hud-score-lbl">CORE SCORE</span>
            <span className="text-lg font-mono font-bold text-cyan-300 drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]" id="hud-score-val">
              {score.toString().padStart(4, '0')}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1" id="hud-timer-container">
            <span className="text-[10px] font-display text-white/50 uppercase tracking-[0.2em]" id="hud-timer-lbl">SELF DESTRUCT T-MINUS</span>
            <div className="flex items-center gap-1.5 text-red-500 font-mono text-lg font-black bg-red-950/20 px-3 py-1 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" id="hud-timer-clock">
              <Timer className="w-4 h-4 animate-spin text-red-500" style={{ animationDuration: '3s' }} id="hud-timer-icon" />
              <span className="tracking-wider drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" id="hud-time-string">{timeString}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
