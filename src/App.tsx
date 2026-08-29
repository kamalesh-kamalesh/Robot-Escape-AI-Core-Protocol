/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, BookOpen, Gamepad2, ShieldAlert, Heart, Zap, Cpu, Award, Code } from 'lucide-react';
import HUD from './components/HUD';
import UnitR7Assistant from './components/UnitR7Assistant';
import Level1SecurityGate from './components/Level1SecurityGate';
import Level2Workshop from './components/Level2Workshop';
import Level3PowerRoom from './components/Level3PowerRoom';
import Level4RobotFactory from './components/Level4RobotFactory';
import Level5ProgrammingLab from './components/Level5ProgrammingLab';
import Level6AIVault from './components/Level6AIVault';
import Level7FinalScene from './components/Level7FinalScene';
import TechSpecView from './components/TechSpecView';
import { audio } from './utils/audio';

import { Login } from './components/Login';
import { Host } from './components/Host';
import { updateTeamProgressInFirebase } from './lib/firebase';

type AppView = 'login' | 'game' | 'host';
type GameStatus = 'intro' | 'playing' | 'gameover' | 'victory';

export default function App() {
  const [appView, setAppView] = useState<AppView>('login');
  const [teamInfo, setTeamInfo] = useState<{ id: string, name: string, member1: string, member2: string } | null>(null);

  const [activeView, setActiveView] = useState<'game' | 'spec'>('game');
  const [gameStatus, setGameStatus] = useState<GameStatus>('intro');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Core Orchestration States
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [timeRemaining, setTimeRemaining] = useState<number>(2400); // 40 minutes (2400 seconds)
  const [score, setScore] = useState<number>(1000); // starting baseline score
  const [lives, setLives] = useState<number>(Infinity);
  const [energy, setEnergy] = useState<number>(100);
  const [tokensLeft, setTokensLeft] = useState<number>(3);
  
  // Cinematic transition states
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionText, setTransitionText] = useState<string>('');
  const [transitionYear, setTransitionYear] = useState<string>('');
  const [transitionTitle, setTransitionTitle] = useState<string>('');

  // Accuracy calculation tracking
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [successCount, setSuccessCount] = useState<number>(0);

  // Tab switching detection & security warning states
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(0);
  const [showTabWarning, setShowTabWarning] = useState<boolean>(false);

  // Visibility change & tab switch listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        setShowTabWarning(true);
        audio.playAlarm();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const syncProgress = async (currentScore: number, level: number, isFinished: boolean = false) => {
    if (!teamInfo) return;
    const timeElapsedSeconds = Math.max(0, 2400 - timeRemaining);
    const mins = Math.floor(timeElapsedSeconds / 60);
    const secs = timeElapsedSeconds % 60;
    const completionTimeFormatted = `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

    const updateData: { 
      score: number; 
      level: number; 
      completedAt?: number; 
      completionTimeFormatted?: string;
      tabSwitches?: number;
    } = { 
      score: currentScore, 
      level,
      tabSwitches: tabSwitchCount 
    };
    if (isFinished) {
      updateData.completedAt = Date.now();
      updateData.completionTimeFormatted = completionTimeFormatted;
    }
    try {
      await updateTeamProgressInFirebase(teamInfo.id, updateData);
    } catch (e) {
      console.error(e);
    }
  };

  // Constant Objective text strings per level
  const objectives: Record<number, string> = {
    1: "Infiltrate Sector 1: Bypass the security terminal system gates.",
    2: "Infiltrate Sector 2: Identify robotic components on the worktable.",
    3: "Infiltrate Sector 3: Troubleshoot and repair the live power circuit.",
    4: "Infiltrate Sector 4: Plan navigation routes to steer the drone safely.",
    5: "Infiltrate Sector 5: Compile program blocks to script the robotic chassis.",
    6: "Infiltrate Sector 6: Deactivate the 10 laser gates blocking the AI vault.",
    7: "Mainframe Core: Enter the master security password to unlock the AI Core."
  };

  // Telemetry Hints per level delivered contextually by Unit-R7
  const hints: Record<number, string[]> = {
    1: [
      "Answer 5 security terminal questions correctly to unlock the Sector 1 bypass.",
      "LDR is a light-dependent resistor, while servo motors handle precise physical rotations.",
      "Completing this level will reveal the 1st master cipher key letter!"
    ],
    2: [
      "Identify the 6 schematic diagrams representing essential robotic elements.",
      "The microcontroller is the Arduino Uno, and the distance sensor is the Ultrasonic.",
      "Completing this level will reveal the 2nd master cipher key letter!"
    ],
    3: [
      "Arrange the power loop sequence first: Battery → Switch → LED.",
      "Next, arrange the robot control path: Power Supply → Arduino → Servo.",
      "Solve the Ohm's Law challenges using Ohm's triangle formula (V = I * R)."
    ],
    4: [
      "Trace the robot's heading direction: turning Right from North faces East.",
      "For shortest path, plot the grid steps avoiding the solid wall barriers.",
      "Be careful: electronic modules are highly vulnerable to fluid/water hazards!"
    ],
    5: [
      "Order instructions from top to bottom. Start must run first, followed by actions, ending with Stop.",
      "For Puzzle 3, select the 'Repeat 5 Times' block to cleanly execute structured loop cycles.",
      "Puzzle 5 requires starting, opening the claw, moving, grabbing, and then lifting the arm."
    ],
    6: [
      "Resolve 10 security questions to disable all laser relays blocking the AI vault.",
      "Questions scale from Easy (LDR, Servo) to Medium (PWM, Sound Waves) to Hard (PWM Pin, Motor Driver).",
      "Completing this final challenge unlocks the 6th and final master cipher letter!"
    ],
    7: [
      "Use the 6 letters you unlocked by completing each of the previous sectors.",
      "Read the 'CIPHER KEY DECODE' progress bar in your HUD to see all unlocked characters.",
      "The master password spell-out is: R - O - B - O - T - S. Enter it and hit SEND!"
    ]
  };

  // Timer tick effect
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameStatus('gameover');
          audio.playAlarm();
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // Sound toggler listener
  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    audio.setSoundEnabled(nextState);
    if (nextState) {
      audio.playBeep(800, 0.05);
    }
  };

  // Initiate gameplay
  const handleStartGame = () => {
    setGameStatus('playing');
    setCurrentLevel(1);
    setTimeRemaining(2400);
    setScore(1000);
    setLives(Infinity);
    setEnergy(100);
    setTokensLeft(3);
    setTotalAttempts(0);
    setSuccessCount(0);
    audio.playPowerRestored();
    
    // Trigger initial intro cinematic
    setTransitionYear("YEAR 2042 // SYSTEM INITIALIZATION");
    setTransitionTitle("OVERRIDE INITIATED");
    setTransitionText("Entering Sector 1. Security protocols active. Awaiting override command.");
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 3000);
  };

  // Reset core game state
  const handleResetGame = () => {
    setGameStatus('intro');
  };

  // Success Callback for Level Complete
  const handleLevelSuccess = (pointsBonus: number) => {
    setSuccessCount((prev) => prev + 1);
    setTotalAttempts((prev) => prev + 1);
    setScore((prev) => prev + pointsBonus);

    if (currentLevel < 7) {
      setTransitionYear("YEAR 2042 // LAB CHRONICLES");
      setTransitionTitle("SECTOR CLEARED");
      setTransitionText(`You have successfully cleared Sector ${currentLevel}! Security countermeasures deactivated. Navigating to Sector ${currentLevel + 1}...`);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentLevel((prev) => prev + 1);
        setLives(Infinity); // Unlimited lives
        setEnergy(100); // Refill energy for each level
        audio.playSuccess();
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2500);
      }, 1500);
    } else {
      setGameStatus('victory');
      audio.playPowerRestored();
    }
  };

  // Failure Callback (Incorrect guess / damage) - Unlimited lives mode
  const handleLevelFailure = (damageAmount: number) => {
    setTotalAttempts((prev) => prev + 1);
    setScore((prev) => Math.max(0, prev - 25)); // subtract 25 points per wrong attempt
    audio.playAlarm();
  };

  // Hints token usage callback
  const handleUseToken = (pointsDeduction: number) => {
    setTokensLeft((prev) => Math.max(0, prev - 1));
    setScore((prev) => Math.max(0, prev - pointsDeduction)); // subtract points
  };

  // Compute live accuracy rating
  const computedAccuracy = totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 100;

  // Sync progress automatically when score, level, or status changes
  useEffect(() => {
    if (appView === 'game' && gameStatus !== 'intro') {
      const isFinished = gameStatus === 'victory';
      syncProgress(score, currentLevel, isFinished);
    }
  }, [score, currentLevel, gameStatus, appView]);

  // Poll for host overrides
  useEffect(() => {
    if (appView === 'game' && teamInfo && gameStatus !== 'intro') {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/teams/${teamInfo.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.level !== currentLevel && data.level > 0 && data.level <= 8) {
              if (data.level > 7) {
                 setGameStatus('victory');
              } else {
                 setCurrentLevel(data.level);
                 setLives(3);
                 setEnergy(100);
              }
            }
            if (data.score !== score) {
              setScore(data.score);
            }
          } else if (res.status === 404) {
            setAppView('login');
            setTeamInfo(null);
            alert('Your team has been removed by the host.');
          }
        } catch(e) {}
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [appView, teamInfo, currentLevel, score, gameStatus]);

  // Render Time as MM:SS string
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (appView === 'login') {
    return (
      <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-hidden" id="login-container">
        <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[110px] pointer-events-none z-0" />
        <div className="relative z-10">
          <Login 
            onLogin={(team) => {
              setTeamInfo(team);
              setAppView('game');
            }} 
            onHostAccess={() => setAppView('host')} 
          />
        </div>
      </div>
    );
  }

  if (appView === 'host') {
    return (
      <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-hidden" id="host-container">
        <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-[110px] pointer-events-none z-0" />
        <div className="relative z-10">
          <Host onLogout={() => setAppView('login')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300 relative overflow-hidden" id="main-app-container">
      
      {/* Universal Ambient Glowing Blur Circles & Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-radial-grid opacity-20 pointer-events-none z-0" id="global-grid-bg" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[110px] pointer-events-none z-0" />

      {/* Universal Top Nav Navigation Bar */}
      <nav className="border-b border-white/10 bg-white/5 backdrop-blur-md px-4 md:px-6 py-3.5 flex items-center justify-between shadow-lg relative z-20" id="main-navbar">
        <div className="flex items-center gap-3" id="nav-branding">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse" id="brand-avatar-box">
            <Cpu className="w-5 h-5 text-slate-950 fill-slate-950" id="brand-avatar" />
          </div>
          <div className="flex flex-col" id="brand-title-group">
            <h1 className="text-sm font-display font-black tracking-widest bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {teamInfo ? `SQUAD: ${teamInfo.name}` : 'ROBOT ESCAPE'}
            </h1>
            <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400 uppercase leading-none">
              AI CORE SECURITY PROTOCOL // VER 2.4.2
            </span>
          </div>
        </div>

        {/* Workspace views and Sound controls split */}
        <div className="flex items-center gap-4" id="nav-controls">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10" id="nav-view-toggles">
            <button
              onClick={() => {
                setActiveView('game');
                audio.playBeep(700, 0.05);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display tracking-wider transition duration-200 ${
                activeView === 'game'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
              id="toggle-game-view"
            >
              <Gamepad2 className="w-3.5 h-3.5" id="gamepad-toggle-icon" />
              PLAY ESCAPE ROOM
            </button>
            <button
              onClick={() => {
                setActiveView('spec');
                audio.playBeep(800, 0.05);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-display tracking-wider transition duration-200 ${
                activeView === 'spec'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
              id="toggle-spec-view"
            >
              <BookOpen className="w-3.5 h-3.5" id="spec-toggle-icon" />
              BLUEPRINTS & SPECS
            </button>
          </div>

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition border border-white/10"
            id="sound-toggle-btn"
            title={soundOn ? "Mute Game Audio" : "Unmute Game Audio"}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" id="sound-on-icon" /> : <VolumeX className="w-4 h-4 text-rose-500" id="sound-off-icon" />}
          </button>
        </div>
      </nav>

      {/* Main Container Workspace */}
      <main className="flex-1 overflow-hidden relative z-10" id="main-content-split">
        {activeView === 'spec' ? (
          /* Technical Specifications layout view */
          <TechSpecView />
        ) : (
          /* Game flow screens */
          <div className="h-full overflow-y-auto p-4 md:p-6" id="game-viewport">
            <div className="max-w-4xl mx-auto flex flex-col gap-5 h-full justify-start" id="game-layout-limit">

              {/* 1. INTRO LOBBY SCREEN */}
              {gameStatus === 'intro' && (
                <div className="glass-panel-heavy p-6 md:p-8 flex flex-col items-center justify-center text-center gap-6 my-auto relative overflow-hidden" id="intro-card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Glowing core logo */}
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/20 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.3)] animate-pulse" id="intro-logo-container">
                    <Cpu className="w-10 h-10 text-cyan-400" id="intro-logo" />
                  </div>

                  <div className="space-y-4 max-w-2xl mx-auto" id="intro-titles">
                    <span className="text-sm text-cyan-400 font-display font-black tracking-widest uppercase">YEAR 2042 // COGNITIVE LABS LOCKDOWN</span>
                    <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase">ROBOT ESCAPE: AI CORE PROTOCOL</h2>
                    <p className="text-base md:text-lg text-slate-300 leading-relaxed font-sans font-medium" id="intro-narrative">
                      The year is 2042. Earth's reliance on robotic automation has reached its peak. At the heart of Cognitive Labs, the mainframe AI <strong className="text-rose-400 font-bold">A.R.I.A.</strong> has gone rogue, initiating a self-destruct countdown that will wipe out the city's power grid!
                      <br /><br />
                      You are the last remaining systems engineer on site. Guided by Unit-R7, a rogue-resistant hologram bot, your mission is to infiltrate the secure lab sectors, solve complex engineering puzzles, and manually override the AI core before it's too late. The clock is ticking!
                    </p>
                  </div>

                  {/* High quality feature highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl py-6" id="intro-highlights">
                    <div className="glass-card p-6 flex flex-col items-center text-center border border-white/10" id="highlight-1">
                      <Zap className="w-8 h-8 text-cyan-400 mb-3" id="hl-1-icon" />
                      <span className="text-sm font-display font-bold text-white block uppercase mb-2">Environmental Puzzles</span>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Drag breadboard nodes, wire heavy motors, and trace hex logs natively.</p>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center text-center border border-white/10" id="highlight-2">
                      <Code className="w-8 h-8 text-indigo-400 mb-3" id="hl-2-icon" />
                      <span className="text-sm font-display font-bold text-white block uppercase mb-2">Firmware Sequencing</span>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Stack instructional command blocks to steer and automate drone paths.</p>
                    </div>
                    <div className="glass-card p-6 flex flex-col items-center text-center border border-white/10" id="highlight-3">
                      <Award className="w-8 h-8 text-yellow-400 mb-3" id="hl-3-icon" />
                      <span className="text-sm font-display font-bold text-white block uppercase mb-2">Leaderboards & Ranks</span>
                      <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Secure points, preserve system load, and climb the podium rankings.</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="btn-primary px-10 py-5 text-sm md:text-base tracking-widest font-display font-black rounded-xl cursor-pointer mt-4"
                    id="begin-override-btn"
                  >
                    BEGIN SECURITY OVERRIDE ESCAPE RUN
                  </button>
                </div>
              )}

              {/* 2. PLAYING SECTORS VIEW */}
              {gameStatus === 'playing' && (
                <div className="flex flex-col gap-5" id="playing-layout">
                  {/* Universal Interactive HUD */}
                  <HUD
                    currentLevel={currentLevel}
                    timeString={formatTime(timeRemaining)}
                    score={score}
                    lives={lives}
                    energy={energy}
                    objective={objectives[currentLevel]}
                    tabSwitchCount={tabSwitchCount}
                  />

                  {/* Active Sector Workspace Component */}
                  <div className="transition-all duration-300 transform" id="level-container-box">
                    {currentLevel === 1 && (
                      <Level1SecurityGate onSuccess={handleLevelSuccess} onFailure={handleLevelFailure} />
                    )}
                    {currentLevel === 2 && (
                      <Level2Workshop onSuccess={handleLevelSuccess} onFailure={handleLevelFailure} />
                    )}
                    {currentLevel === 3 && (
                      <Level3PowerRoom onSuccess={handleLevelSuccess} onFailure={handleLevelFailure} />
                    )}
                    {currentLevel === 4 && (
                      <Level4RobotFactory onSuccess={handleLevelSuccess} onFailure={handleLevelFailure} />
                    )}
                    {currentLevel === 5 && (
                      <Level5ProgrammingLab onSuccess={handleLevelSuccess} onFailure={handleLevelFailure} />
                    )}
                    {currentLevel === 6 && (
                      <Level6AIVault onSuccess={handleLevelSuccess} onFailure={handleLevelFailure} />
                    )}
                    {currentLevel === 7 && (
                      <Level7FinalScene
                        score={score}
                        timeRemainingSeconds={timeRemaining}
                        accuracy={computedAccuracy}
                        tabSwitchCount={tabSwitchCount}
                        onResetGame={handleResetGame}
                      />
                    )}
                  </div>

                  {/* Cinematic Transition Overlay */}
                  {isTransitioning && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm animate-fadeIn">
                      <div className="max-w-2xl text-center space-y-6 p-8 border-y border-cyan-500/30 bg-slate-900/50 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden w-full">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                         <span className="text-base font-mono text-cyan-400 uppercase tracking-widest block animate-pulse">
                           {transitionYear}
                         </span>
                         <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                           {transitionTitle}
                         </h2>
                         <p className="text-xl md:text-2xl text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
                           {transitionText}
                         </p>
                         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
                      </div>
                    </div>
                  )}

                  {/* Hovering Holographic Assistant [UNIT-R7] (hidden in Final level) */}
                  {currentLevel < 7 && (
                    <UnitR7Assistant
                      currentLevel={currentLevel}
                      tokensLeft={tokensLeft}
                      onUseToken={handleUseToken}
                      levelHints={hints[currentLevel] || []}
                    />
                  )}
                </div>
              )}

              {/* 3. GAME OVER OUTCOME SCREEN */}
              {gameStatus === 'gameover' && (
                <div className="glass-panel-heavy p-8 flex flex-col items-center justify-center text-center gap-6 border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.15)] my-auto relative overflow-hidden" id="gameover-card">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse" id="gameover-logo">
                    <ShieldAlert className="w-9 h-9 text-rose-500" id="gameover-alert-icon" />
                  </div>

                  <div className="space-y-2 max-w-md" id="gameover-titles">
                    <span className="text-xs text-rose-500 font-display font-black tracking-widest uppercase block animate-pulse">SELF-DESTRUCT INITIATED</span>
                    <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase">LABORATORY COMPROMISED</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans" id="gameover-desc">
                      Chassis system integrity collapsed or countdown timer expired. A.R.I.A.\'s self-destruct cycle completed successfully. Access to escape pods has been sealed. Initiate backup firmware override protocol immediately!
                    </p>
                  </div>

                  <div className="flex gap-4 animate-fadeIn" id="gameover-stats">
                    <div className="bg-black/40 border border-white/15 px-5 py-2.5 rounded-xl text-center shadow-md" id="go-score">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">SCORE EARNED</span>
                      <strong className="text-cyan-400 font-mono text-md">{score}</strong>
                    </div>
                    <div className="bg-black/40 border border-white/15 px-5 py-2.5 rounded-xl text-center shadow-md" id="go-sector">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">FAILED SECTOR</span>
                      <strong className="text-rose-400 font-mono text-md">SECTOR {currentLevel}</strong>
                    </div>
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
                    id="retry-override-btn"
                  >
                    INITIATE SYSTEMS OVERRIDE ROLLBACK
                  </button>
                </div>
              )}

              {/* 4. VICTORY LOBBY SCREEN (Routed directly via Level 7 Success callback) */}
              {gameStatus === 'victory' && (
                <div className="my-auto" id="victory-card-container">
                  <Level7FinalScene
                    score={score}
                    timeRemainingSeconds={timeRemaining}
                    accuracy={computedAccuracy}
                    tabSwitchCount={tabSwitchCount}
                    onResetGame={handleResetGame}
                  />
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Interactive Tab Switch Warning Alert Modal */}
      {showTabWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-rose-500 rounded-2xl p-6 md:p-8 text-center space-y-6 shadow-[0_0_60px_rgba(244,63,94,0.4)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse" />
            
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-bounce">
              <ShieldAlert className="w-9 h-9 text-rose-400" />
            </div>

            <div className="space-y-3">
              <span className="text-sm font-mono text-rose-400 font-bold uppercase tracking-[0.2em] block">
                ⚠️ MAINFRAME SECURITY NOTICE
              </span>
              
              {/* Increased Font Size & Styled Typography */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-rose-300 uppercase tracking-wider drop-shadow-[0_0_15px_rgba(244,63,94,0.7)] leading-tight">
                TAB SWITCHING DETECTED!
              </h2>
              
              <p className="text-base md:text-lg font-mono font-bold text-amber-200 bg-black/50 p-4 rounded-xl border border-amber-500/30 leading-relaxed max-w-lg mx-auto">
                A.R.I.A. monitoring system logged an unauthorized browser defocus / tab switch event.
                <span className="block mt-2 text-rose-400 font-black text-xl">
                  TOTAL TAB SWITCHES LOGGED: {tabSwitchCount}
                </span>
              </p>
            </div>

            <button
              onClick={() => setShowTabWarning(false)}
              className="w-full py-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-display font-black text-sm md:text-base uppercase tracking-widest rounded-xl transition shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer"
            >
              ACKNOWLEDGE WARNING & RESUME PROTOCOL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
