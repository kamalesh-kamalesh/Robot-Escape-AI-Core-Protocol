/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Trophy, User, Calendar, Award, RotateCcw, Send, AlertTriangle } from 'lucide-react';
import { LeaderboardEntry, Rank } from '../types';
import { audio } from '../utils/audio';

interface Level7Props {
  score: number;
  timeRemainingSeconds: number; // to calculate speed bonus
  accuracy: number; // accumulated accuracy percentage
  tabSwitchCount?: number;
  onResetGame: () => void;
}

export default function Level7FinalScene({ score, timeRemainingSeconds, accuracy, tabSwitchCount = 0, onResetGame }: Level7Props) {
  const [teamName, setTeamName] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [overrideInput, setOverrideInput] = useState<string>("");
  const [isCoreOverridden, setIsCoreOverridden] = useState<boolean>(false);

  // Calculate completion duration & timestamp
  const timeElapsedSeconds = Math.max(0, 2400 - timeRemainingSeconds);
  const elapsedMins = Math.floor(timeElapsedSeconds / 60);
  const elapsedSecs = timeElapsedSeconds % 60;
  const formattedDuration = `${elapsedMins.toString().padStart(2, '0')}m ${elapsedSecs.toString().padStart(2, '0')}s`;
  
  const [completionTimestamp] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + 
           ' • ' + now.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
  });

  // Calculate speed bonus: +2 points per remaining second
  const speedBonus = Math.max(0, timeRemainingSeconds * 2);
  const finalScore = score + speedBonus;

  // Evaluate final engineer rank
  const getRank = (finalScoreValue: number): Rank => {
    if (finalScoreValue >= 3000) return 'Legend Engineer';
    if (finalScoreValue >= 2500) return 'Master Engineer';
    if (finalScoreValue >= 2000) return 'Robotics Expert';
    if (finalScoreValue >= 1500) return 'Junior Engineer';
    return 'Trainee';
  };

  const finalRank = getRank(finalScore);

  // Initialize Leaderboard with high quality seed data
  useEffect(() => {
    const rawData = localStorage.getItem('robot_escape_leaderboard');
    if (rawData) {
      setLeaderboard(JSON.parse(rawData));
    } else {
      const defaultLeaderboard: LeaderboardEntry[] = [
        { id: '1', teamName: 'Quantum Coders', timeRemaining: '24:15', timeElapsedSeconds: 945, score: 3250, accuracy: 94, rank: 'Legend Engineer', date: '2026-07-15' },
        { id: '2', teamName: 'Cyber-Viper Team', timeRemaining: '18:40', timeElapsedSeconds: 1280, score: 2640, accuracy: 88, rank: 'Master Engineer', date: '2026-07-14' },
        { id: '3', teamName: 'Byte Sized AI', timeRemaining: '12:10', timeElapsedSeconds: 1670, score: 2180, accuracy: 78, rank: 'Robotics Expert', date: '2026-07-13' }
      ];
      localStorage.setItem('robot_escape_leaderboard', JSON.stringify(defaultLeaderboard));
      setLeaderboard(defaultLeaderboard);
    }
  }, []);

  const handleOverrideCore = () => {
    if (overrideInput.trim().toUpperCase() === "ROBOTS") {
      setIsCoreOverridden(true);
      audio.playPowerRestored(); // victory roar beep sound!
    } else {
      audio.playError();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleOverrideCore();
    }
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    // Convert remaining seconds back to formatted MM:SS
    const minutes = Math.floor(timeRemainingSeconds / 60);
    const seconds = timeRemainingSeconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const newEntry: LeaderboardEntry = {
      id: Math.random().toString(),
      teamName: teamName.trim(),
      timeRemaining: formattedTime,
      timeElapsedSeconds: 2400 - timeRemainingSeconds,
      score: finalScore,
      accuracy: Math.round(accuracy),
      rank: finalRank,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score);
    localStorage.setItem('robot_escape_leaderboard', JSON.stringify(updated));
    setLeaderboard(updated);
    setSubmitted(true);
    audio.playSuccess();
  };

  // Organize top 3 elements for animated podium placement (2nd, 1st, 3rd)
  const getPodiumList = () => {
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    const podium: (LeaderboardEntry | null)[] = [null, null, null]; // 2nd, 1st, 3rd

    if (sorted[0]) podium[1] = sorted[0]; // 1st is center
    if (sorted[1]) podium[0] = sorted[1]; // 2nd is left
    if (sorted[2]) podium[2] = sorted[2]; // 3rd is right

    return podium;
  };

  const podiumData = getPodiumList();

  return (
    <div className="glass-panel p-6 shadow-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-6" id="level-7-root">
      
      {/* 1. Pre-Bypass Core stabilized Input screen */}
      {!isCoreOverridden ? (
        <div className="flex flex-col items-center gap-6 text-center py-6" id="final-override-screen">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.4)] animate-pulse" id="core-status-holo">
            <ShieldCheck className="w-9 h-9 text-emerald-400" id="core-status-icon" />
          </div>

          <div className="space-y-2" id="final-override-info">
            <span className="text-xs text-emerald-400 font-display uppercase tracking-widest font-black">A.R.I.A. SYSTEM OVERRIDE LOCKED</span>
            <h2 className="text-xl font-display font-black text-white tracking-tight">STABILIZE THE COGNITIVE AI CORE</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
              All perimeter shield lasers and power nodes are stable. To completely bypass A.R.I.A.'s self-destruct cycle and escape the laboratory, type the <strong className="text-cyan-400 font-bold">6-character MASTER SECURITY PASSWORD</strong> decyphered by clearing each of the previous sectors.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/60 p-4 rounded-xl border border-white/10 max-w-sm w-full shadow-inner" id="final-input-container">
            <input
              type="text"
              placeholder="ENTER KEYWORD..."
              value={overrideInput}
              onChange={(e) => setOverrideInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-0 outline-none text-center flex-1 font-mono font-black text-lg text-cyan-400 placeholder-slate-700 uppercase tracking-widest"
              id="final-override-input"
            />
            <button
              onClick={handleOverrideCore}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-xs font-display font-black uppercase rounded-xl transition cursor-pointer"
              id="final-override-btn"
            >
              SEND
            </button>
          </div>
        </div>
      ) : (
        /* 2. Victory Score and Leaderboard interface */
        <div className="flex flex-col gap-6" id="final-victory-screen">
          
          {/* Main banner */}
          <div className="text-center space-y-1" id="victory-banner">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto drop-shadow-[0_0_12px_rgba(250,204,21,0.6)] animate-bounce" id="trophy-victory-icon" />
            <span className="text-xs text-yellow-400 font-display font-black tracking-widest uppercase block">MISSION COMPLETED SUCCESSFULLY</span>
            <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase">A.R.I.A. CORE OVERRIDDEN</h2>
            <p className="text-[11px] text-slate-300 font-sans font-medium" id="victory-banner-desc">
              Laboratory security cycle has been terminated. Cognitive parameters locked and safe. Escape pods armed!
            </p>
          </div>

          {/* Dedicated High-Impact Completion Time Box */}
          <div className="bg-emerald-950/30 border-2 border-emerald-400/40 rounded-2xl p-6 text-center shadow-[0_0_35px_rgba(52,211,153,0.2)] relative overflow-hidden flex flex-col items-center justify-center gap-2" id="completion-time-highlight-card">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-emerald-400 font-display font-black text-xs uppercase tracking-[0.25em]">
              <Calendar className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>OFFICIAL TIME OF COMPLETION</span>
            </div>
            
            {/* Increased Font Size & Styled Typography */}
            <div className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-wider text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)] my-1">
              {formattedDuration}
            </div>

            <div className="text-xs md:text-sm font-mono font-bold text-emerald-400/90 tracking-widest bg-emerald-950/60 border border-emerald-400/30 px-4 py-1.5 rounded-lg shadow-inner">
              TIMESTAMP: {completionTimestamp}
            </div>

            {tabSwitchCount > 0 && (
              <div className="mt-2 flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>SECURITY WARNING: {tabSwitchCount} TAB SWITCH(ES) LOGGED DURING SESSION</span>
              </div>
            )}
          </div>

          {/* Metric Stats bento row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="victory-stats-grid">
            
            {/* Accuracy card */}
            <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 text-center" id="card-accuracy">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">ACCURACY RATE</span>
              <span className="text-xl font-display font-black text-indigo-400" id="card-accuracy-val">{Math.round(accuracy)}%</span>
            </div>

            {/* Time remaining speed bonus */}
            <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 text-center" id="card-time-bonus">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">SPEED REWARD (+2/s)</span>
              <span className="text-xl font-display font-black text-cyan-400" id="card-time-bonus-val">+{speedBonus} PTS</span>
            </div>

            {/* Final score */}
            <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 text-center relative overflow-hidden" id="card-total-score">
              <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none animate-pulse" id="total-score-ambient" />
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">FINAL COMPLIED SCORE</span>
              <span className="text-xl font-display font-black text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.3)]" id="card-total-score-val">
                {finalScore}
              </span>
            </div>

            {/* Final Engineering rank badge */}
            <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 text-center flex flex-col items-center justify-center gap-1" id="card-rank">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block leading-none">ENGINEERING RANK</span>
              <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[10px] font-display font-bold text-yellow-400 uppercase tracking-wider animate-pulse" id="rank-badge-box">
                <Award className="w-3.5 h-3.5 text-yellow-400" id="rank-badge-icon" />
                {finalRank}
              </div>
            </div>

          </div>

          {/* Form to submit score */}
          {!submitted && (
            <form onSubmit={handleSubmitScore} className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-3 shadow-inner" id="submit-leaderboard-form">
              <div className="flex items-center gap-2 flex-1 w-full" id="form-input-col">
                <User className="w-4 h-4 text-cyan-400 shrink-0" id="form-user-icon" />
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="ENTER TEAM NAME / ENGINEER CODE..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="bg-transparent border-0 outline-none text-xs font-display tracking-wider text-slate-200 placeholder-slate-600 w-full uppercase"
                  id="form-team-name-input"
                />
              </div>
              <button
                type="submit"
                className="btn-primary cursor-pointer w-full md:w-auto px-5 py-2 rounded-xl text-xs font-display font-black tracking-wider flex items-center justify-center gap-1.5 shrink-0"
                id="form-submit-btn"
              >
                <Send className="w-3.5 h-3.5 text-cyan-950 fill-cyan-950" id="form-send-icon" />
                SUBMIT TELEMETRY REPORT
              </button>
            </form>
          )}

          {/* Leaderboard Section: podium + rest listing */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 border-t border-white/10 pt-5" id="leaderboard-section">
            
            {/* Animated Podium (3 cols) */}
            <div className="lg:col-span-5 bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col items-center justify-between min-h-[220px]" id="leaderboard-podium-column">
              <span className="text-[9px] font-display text-white/50 uppercase tracking-widest text-center">CORE SYSTEM PODIUM</span>
              
              <div className="flex items-end justify-center gap-4 w-full h-[150px] mt-4" id="podium-graphics-row">
                
                {/* 2nd place (Left) */}
                {podiumData[0] && (
                  <div className="flex flex-col items-center" id="podium-2nd-col">
                    <span className="text-[9px] font-display font-bold text-slate-400 text-center uppercase tracking-wider truncate w-16">{podiumData[0].teamName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{podiumData[0].score}</span>
                    <div className="w-14 bg-gradient-to-t from-slate-800 to-slate-700 h-14 border border-slate-600 rounded-t-md flex items-center justify-center text-slate-300 font-black text-md shadow-md mt-1" id="podium-2nd-base">
                      2
                    </div>
                  </div>
                )}

                {/* 1st place (Center) */}
                {podiumData[1] && (
                  <div className="flex flex-col items-center" id="podium-1st-col">
                    <Award className="w-4 h-4 text-yellow-400 animate-pulse" id="podium-1st-award" />
                    <span className="text-[10px] font-display font-black text-yellow-400 text-center uppercase tracking-wider truncate w-20">{podiumData[1].teamName}</span>
                    <span className="text-[11px] font-mono text-yellow-500 font-bold">{podiumData[1].score}</span>
                    <div className="w-16 bg-gradient-to-t from-yellow-700/80 to-yellow-600/60 h-22 border border-yellow-500/40 rounded-t-md flex items-center justify-center text-yellow-400 font-black text-xl shadow-lg shadow-yellow-500/5 mt-1" id="podium-1st-base">
                      1
                    </div>
                  </div>
                )}

                {/* 3rd place (Right) */}
                {podiumData[2] && (
                  <div className="flex flex-col items-center" id="podium-3rd-col">
                    <span className="text-[9px] font-display font-bold text-amber-600 text-center uppercase tracking-wider truncate w-16">{podiumData[2].teamName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{podiumData[2].score}</span>
                    <div className="w-14 bg-gradient-to-t from-amber-900 to-amber-800 h-10 border border-amber-800 rounded-t-md flex items-center justify-center text-amber-700 font-black text-xs shadow-md mt-1" id="podium-3rd-base">
                      3
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Scrollable Leaderboard Listing Table */}
            <div className="lg:col-span-7 flex flex-col gap-2" id="leaderboard-table-column">
              <span className="text-[10px] font-display text-white/50 uppercase tracking-[0.15em] pl-1">HISTORIC OVERRIDES DATABASE</span>
              
              <div className="bg-black/40 border border-white/10 rounded-xl overflow-y-auto max-h-[220px]" id="leaderboard-table-container">
                <table className="min-w-full text-xs text-left text-slate-300 border-collapse" id="leaderboard-table">
                  <thead className="bg-black/50 font-display text-[9px] text-cyan-400 uppercase tracking-widest border-b border-white/10" id="leaderboard-table-thead">
                    <tr>
                      <th className="px-3 py-2 text-center" id="th-rank">POS</th>
                      <th className="px-3 py-2" id="th-team">TEAM NAME</th>
                      <th className="px-3 py-2 text-center" id="th-accuracy">ACCURACY</th>
                      <th className="px-3 py-2 text-center" id="th-time">REMAINING</th>
                      <th className="px-3 py-2 text-right" id="th-score">SCORE</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-400 font-medium" id="leaderboard-table-tbody">
                    {leaderboard.map((entry, index) => {
                      return (
                        <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5 transition-all" id={`tbody-tr-${entry.id}`}>
                          <td className="px-3 py-1.5 text-center font-bold text-slate-500" id={`td-pos-${entry.id}`}>{index + 1}</td>
                          <td className="px-3 py-1.5 font-display font-black uppercase text-slate-200" id={`td-name-${entry.id}`}>{entry.teamName}</td>
                          <td className="px-3 py-1.5 text-center text-indigo-400" id={`td-acc-${entry.id}`}>{entry.accuracy}%</td>
                          <td className="px-3 py-1.5 text-center text-cyan-400" id={`td-time-${entry.id}`}>{entry.timeRemaining}</td>
                          <td className="px-3 py-1.5 text-right font-bold text-yellow-400" id={`td-score-${entry.id}`}>{entry.score}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Reset Action */}
          <div className="flex justify-center border-t border-white/10 pt-4" id="final-footer">
            <button
              onClick={onResetGame}
              className="btn-secondary font-bold text-xs cursor-pointer px-6 py-2 rounded-xl border border-white/10 flex items-center gap-2"
              id="restart-game-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" id="restart-game-icon" />
              INITIATE NEW LAB PROTOCOL RUN
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
