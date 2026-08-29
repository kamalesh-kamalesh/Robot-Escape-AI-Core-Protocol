import React, { useState } from 'react';
import { Cpu, Users, ArrowRight } from 'lucide-react';
import { saveTeamToFirebase } from '../lib/firebase';

interface LoginProps {
  onLogin: (team: { id: string, name: string, member1: string, member2: string }) => void;
  onHostAccess: () => void;
}

export function Login({ onLogin, onHostAccess }: LoginProps) {
  const [teamName, setTeamName] = useState('');
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [hostPassword, setHostPassword] = useState('');
  const [isHostMode, setIsHostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTeamName(val);
    if (val.toLowerCase() === 'host') {
      setIsHostMode(true);
      setError('');
    } else {
      setIsHostMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isHostMode) {
      if (hostPassword === 'bavya') {
        onHostAccess();
      } else {
        setError('ACCESS DENIED: Incorrect administrator password.');
      }
      return;
    }

    if (!teamName || !member1 || !member2) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, member1, member2 })
      });
      
      if (!response.ok) {
        throw new Error('Failed to register team');
      }
      
      const team = await response.json();
      await saveTeamToFirebase(team);
      onLogin(team);
    } catch (err: any) {
      setError(err.message || 'Connection error. Try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="glass-panel-heavy p-8 max-w-md w-full relative overflow-hidden animate-fadeIn">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-cyan-900/40 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-4">
            <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <span className="text-sm text-cyan-400 font-display font-black tracking-widest uppercase mb-2">SYSTEM ACCESS</span>
          <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase">TEAM REGISTRATION</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono text-center rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-mono text-cyan-300/80 uppercase tracking-widest pl-1">Team Name</label>
            <input 
              type="text" 
              value={teamName}
              onChange={handleTeamNameChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-sans focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all placeholder:text-white/20"
              placeholder="e.g. Cyber Squad"
            />
          </div>

          {isHostMode ? (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-xs font-mono text-rose-300/80 uppercase tracking-widest pl-1">Admin Password</label>
              <input 
                type="password" 
                value={hostPassword}
                onChange={(e) => setHostPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-sans focus:outline-none focus:border-rose-400 focus:bg-rose-950/20 transition-all placeholder:text-white/20"
                placeholder="Enter password"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-xs font-mono text-indigo-300/80 uppercase tracking-widest pl-1">Member 1</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={member1}
                    onChange={(e) => setMember1(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white font-sans focus:outline-none focus:border-indigo-400 focus:bg-indigo-950/20 transition-all placeholder:text-white/20 text-sm"
                    placeholder="Name"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-mono text-indigo-300/80 uppercase tracking-widest pl-1">Member 2</label>
                <div className="relative">
                  <Users className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={member2}
                    onChange={(e) => setMember2(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-white font-sans focus:outline-none focus:border-indigo-400 focus:bg-indigo-950/20 transition-all placeholder:text-white/20 text-sm"
                    placeholder="Name"
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-xl mt-6 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed ${isHostMode ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/40' : 'btn-primary'}`}
          >
            {isLoading ? 'INITIALIZING...' : (isHostMode ? 'ACCESS OVERRIDE' : 'INITIALIZE SEQUENCE')}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-[10px] text-white/30 font-mono">Tip: Type "host" as Team Name to access control panel.</p>
        </div>
      </div>
    </div>
  );
}
