/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Cpu, HelpCircle, MessageSquare } from 'lucide-react';
import { audio } from '../utils/audio';

interface UnitR7AssistantProps {
  currentLevel: number;
  tokensLeft: number;
  onUseToken: (deduction: number) => void;
  levelHints: string[];
}

export default function UnitR7Assistant({ currentLevel, tokensLeft, onUseToken, levelHints }: UnitR7AssistantProps) {
  const [hintIndex, setHintIndex] = useState<number>(-1);
  const [message, setMessage] = useState<string>("Greetings, Engineer. I am Unit-R7, your holographic technical assistant. Access to the A.R.I.A. central mainframe has been locked down. Let's stabilize the protocols!");
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Standard dialog entries for Unit-R7 when level changes
  const levelGreetings: Record<number, string> = {
    1: "We are at the security perimeter. The gate system requires a decrypted digital key. We must analyze binary patterns and logic gate inputs to override the lockout!",
    2: "The workshop is in disarray. We need to mount our electronic circuit components onto the breadboard correctly to register the ultrasonic proximity handler.",
    3: "Warning: Direct power line failure in sector 3! To prevent fires, establish the serial wiring path: from Battery through the Switch and Fuse to the Motor Driver, then onto the main Motor.",
    4: "A.R.I.A. has activated defensive energy barriers. Control my drone chassis using the arrow keys to bypass these short-circuit grids. Drive to the terminal!",
    5: "We must write a control sequence for Unit-R7 to traverse this hazardous maze! Assemble the logic blocks in sequence, then fire up the execution command.",
    6: "A.R.I.A.'s vault perimeter is secured by five laser defense lines. Each line is connected to a specific STEM sub-discipline puzzle. Deactivate all five to disable the lasers!",
    7: "Mainframe access accomplished! Complete the override command to bypass A.R.I.A.'s self-destruct protocol and secure the laboratory!"
  };

  useEffect(() => {
    // Reset hints and update greeting on level changes
    setHintIndex(-1);
    const greeting = levelGreetings[currentLevel] || "Mainframe security override in progress. Be careful, Engineer!";
    setMessage(greeting);
  }, [currentLevel]);

  useEffect(() => {
    // Typewriter effect
    setTypewriterText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setTypewriterText((prev) => prev + message.charAt(i));
        // Soft click sound for typing effect every few characters
        if (i % 3 === 0) {
          audio.playBeep(900, 0.02, 'sine');
        }
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [message]);

  const handleRequestHint = () => {
    if (tokensLeft <= 0) {
      setMessage("Unit-R7: Access Error. All 3 of our AI security tokens have been exhausted! You will have to crack this on your own, Engineer.");
      audio.playError();
      return;
    }

    const nextIndex = hintIndex + 1;
    if (nextIndex < levelHints.length) {
      setHintIndex(nextIndex);
      setMessage(`Unit-R7 Clue: ${levelHints[nextIndex]}`);
      onUseToken(20); // deduct 20 points for hint usage
      audio.playBeep(1200, 0.1, 'sine');
    } else {
      setMessage("Unit-R7: I have provided all the telemetry analysis available for this level. Study the circuit details carefully!");
      audio.playError();
    }
  };

  return (
    <div className="glass-panel p-5 shadow-2xl backdrop-blur-xl border border-white/10 flex gap-4 items-start relative overflow-hidden" id="unit-r7-panel">
      {/* Laser line effect */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" id="unit-r7-laser-stripe" />

      {/* Robot Hologram Avatar */}
      <div className="flex flex-col items-center gap-2 shrink-0" id="unit-r7-avatar-col">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/20 flex items-center justify-center relative shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-bounce" style={{ animationDuration: '4s' }} id="unit-r7-holo-orb">
          {/* Scan Line effect inside Avatar */}
          <div className="absolute w-full h-0.5 bg-cyan-400 opacity-60 animate-bounce" style={{ animationDuration: '2s' }} id="avatar-scan-line" />
          <Cpu className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" id="cpu-icon" />
        </div>
        <span className="text-[11px] font-display font-bold text-cyan-400 tracking-wider" id="avatar-name">UNIT-R7 [HOLO]</span>
      </div>

      {/* Dialog Bubble */}
      <div className="flex-1 flex flex-col gap-3" id="unit-r7-dialog-col">
        <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 min-h-[72px]" id="unit-r7-bubble">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400/80 uppercase tracking-[0.2em] mb-1.5" id="telemetry-lbl-row">
            <MessageSquare className="w-3 h-3 text-cyan-400" id="msg-bubble-icon" />
            INCOMING TRANSMISSION // ENCRYPTED
          </div>
          <p className="text-xs text-white/90 font-sans leading-relaxed font-medium" id="dialog-text">
            {typewriterText}
          </p>
        </div>

        {/* Hints Control bar */}
        <div className="flex items-center justify-between gap-4" id="unit-r7-hints-bar">
          <div className="flex items-center gap-2.5" id="tokens-counter-col">
            <span className="text-[10px] font-display text-white/50 uppercase tracking-[0.15em]" id="tokens-lbl">AI ASSIST TOKENS</span>
            <div className="flex gap-1.5" id="tokens-dots">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                    i < tokensLeft
                      ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]'
                      : 'bg-black/60 border-white/10'
                  }`}
                  id={`token-dot-${i}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleRequestHint}
            disabled={isTyping || tokensLeft <= 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-display text-xs tracking-wider border transition-all duration-200 ${
              isTyping || tokensLeft <= 0
                ? 'opacity-40 cursor-not-allowed bg-white/5 border-white/10 text-white/30'
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/60 active:scale-95 cursor-pointer font-bold'
            }`}
            id="ask-hint-button"
          >
            <HelpCircle className="w-3.5 h-3.5" id="ask-hint-icon" />
            REQUEST TELEMETRY HINT (-20 PTS)
          </button>
        </div>
      </div>
    </div>
  );
}
