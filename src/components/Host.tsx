import React, { useState, useEffect } from 'react';
import { Database, Shield, RefreshCw, LogOut, Award, AlertTriangle, PlayCircle, User, Flame } from 'lucide-react';
import { 
  subscribeToTeams, 
  updateTeamProgressInFirebase, 
  deleteTeamFromFirebase, 
  clearAllTeamsFromFirebase,
  TeamData
} from '../lib/firebase';

export function Host({ onLogout }: { onLogout: () => void }) {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase live updates for instant real-time telemetry on the Host page
    const unsubscribe = subscribeToTeams((firebaseTeams) => {
      if (firebaseTeams) {
        // Sort teams by score, level, completion time, creation time
        const sorted = [...firebaseTeams].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.level !== a.level) return b.level - a.level;
          if (a.completedAt && b.completedAt) return a.completedAt - b.completedAt;
          return (a.createdAt || 0) - (b.createdAt || 0);
        });
        setTeams(sorted);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const clearAll = async () => {
    if (confirm("WARNING: This will delete all teams and scores from local state and Firebase. Proceed?")) {
      try {
        await clearAllTeamsFromFirebase();
        setTeams([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateTeam = async (id: string, updates: Partial<TeamData>) => {
    try {
      await updateTeamProgressInFirebase(id, updates);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTeam = async (id: string) => {
    if (confirm("Kick this team?")) {
      try {
        await deleteTeamFromFirebase(id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="glass-panel-heavy p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-900/40 border border-rose-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Shield className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <span className="text-xs text-rose-400 font-display font-black tracking-widest uppercase block mb-1">SECURITY CLEARANCE: OMNI</span>
              <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase leading-none">ADMINISTRATOR CONSOLE</h2>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => setIsLoading(true)} className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              <span className="text-xs">SYNCING</span>
            </button>
            <button onClick={clearAll} className="bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-400 px-4 py-2 rounded-lg text-xs font-display font-black tracking-widest uppercase transition-colors flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              NUKE DATA
            </button>
            <button onClick={onLogout} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-xs font-display font-black tracking-widest uppercase transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              LOGOUT
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="glass-panel overflow-hidden animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display font-bold text-white tracking-widest uppercase">LIVE SQUAD TELEMETRY</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase font-mono text-white/50 tracking-widest">
                  <th className="p-4 border-b border-white/10 w-16 text-center">RANK</th>
                  <th className="p-4 border-b border-white/10">TEAM DESIGNATION</th>
                  <th className="p-4 border-b border-white/10">OPERATIVES</th>
                  <th className="p-4 border-b border-white/10 text-center">SECTOR</th>
                  <th className="p-4 border-b border-white/10 text-center">TIME OF COMPLETION</th>
                  <th className="p-4 border-b border-white/10 text-right">SCORE (PTS)</th>
                  <th className="p-4 border-b border-white/10 text-right">STATUS</th>
                  <th className="p-4 border-b border-white/10 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans divide-y divide-white/5">
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/40 font-mono text-xs">NO ACTIVE TEAMS IN THE MAINFRAME</td>
                  </tr>
                ) : (
                  teams.map((team, idx) => (
                    <tr key={team.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-center">
                        {idx === 0 ? (
                          <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50 flex items-center justify-center mx-auto shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                            <Award className="w-4 h-4 text-yellow-400" />
                          </div>
                        ) : idx === 1 ? (
                          <div className="w-8 h-8 rounded-full bg-slate-400/20 border border-slate-400/50 flex items-center justify-center mx-auto">
                            <span className="font-display font-bold text-slate-300 text-xs">2</span>
                          </div>
                        ) : idx === 2 ? (
                          <div className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700/50 flex items-center justify-center mx-auto">
                            <span className="font-display font-bold text-amber-600 text-xs">3</span>
                          </div>
                        ) : (
                          <span className="font-mono text-white/30 text-xs">{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-4 font-display font-bold tracking-wider text-white">
                        <div className="flex flex-col gap-1">
                          <span>{team.name}</span>
                          {team.tabSwitches && team.tabSwitches > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.5 rounded w-fit">
                              ⚠️ {team.tabSwitches} TAB SWITCH{team.tabSwitches > 1 ? 'ES' : ''}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                            <User className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs text-slate-300">{team.member1}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-black/30 px-2 py-1 rounded-md border border-white/5">
                            <User className="w-3 h-3 text-indigo-400" />
                            <span className="text-xs text-slate-300">{team.member2}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center px-2 py-1 bg-cyan-950/40 border border-cyan-400/30 rounded text-cyan-400 font-mono text-xs">
                          {team.level >= 8 ? 'VICTORY' : team.level >= 7 ? 'FINAL' : team.level}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {team.completedAt ? (
                          <div className="flex flex-col items-center">
                            <span className="font-display font-black text-emerald-400 text-sm tracking-wider">
                              {team.completionTimeFormatted || 'COMPLETED'}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">
                              {new Date(team.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-slate-600">--:--</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-lg text-emerald-400">
                        {team.score.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        {team.completedAt ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded">
                            COMPLETED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded">
                            <PlayCircle className="w-3 h-3 animate-pulse" />
                            IN PROGRESS
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        <button onClick={() => updateTeam(team.id, { score: team.score + 100 })} className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-500/40">
                          +100 PTS
                        </button>
                        <button onClick={() => updateTeam(team.id, { level: Math.min(8, team.level + 1) })} className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-1 rounded hover:bg-cyan-500/40">
                          SKIP LVL
                        </button>
                        <button onClick={() => updateTeam(team.id, { level: 1, score: 0 })} className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded hover:bg-amber-500/40">
                          RESET
                        </button>
                        <button onClick={() => deleteTeam(team.id)} className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-1 rounded hover:bg-rose-500/40">
                          KICK
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
