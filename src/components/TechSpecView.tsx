/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Code, Layers, Shield, HelpCircle, Zap, CheckSquare, Copy, Check } from 'lucide-react';
import { audio } from '../utils/audio';

export default function TechSpecView() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const deliverables = [
    {
      title: "1. Game Architecture",
      icon: Layers,
      content: `### Robot Escape: AI Core Protocol — Game Architecture Spec

The system is constructed as a modern offline-first React Single Page Application (SPA). To support scalable and high-performance operation, it utilizes a modular system architecture where levels are isolated components reporting to an orchestrating parent state.

#### 📂 File and Directory Layout
\`\`\`
/
├── public/                 # Static assets (fonts, optional vector illustrations)
├── src/
│   ├── components/         # Game screens & levels
│   │   ├── HUD.tsx         # Universal HUD overlay (Objective, Timer, Lives, Energy)
│   │   ├── UnitR7Assistant.tsx # Hovering helper hologram & hints system
│   │   ├── Level1SecurityGate.tsx  # Terminal Decryptor
│   │   ├── Level2Workshop.tsx      # Robotics Component Matcher
│   │   ├── Level3PowerRoom.tsx     # Circuit Wiring Grid
│   │   ├── Level4RobotFactory.tsx  # Canvas/Grid Retro-Arcade Maze
│   │   ├── Level5ProgrammingLab.tsx # Visual Command Block Sequencer
│   │   ├── Level6AIVault.tsx       # 5-Laser Multi-Discipline Lock
│   │   ├── Level7FinalScene.tsx    # Victory, Podium & Leaderboard
│   │   └── TechSpecView.tsx        # Technical Specification holographic panel
│   ├── utils/
│   │   └── audio.ts        # Custom Web Audio API synthesizer
│   ├── App.tsx             # Main orchestrator state machine & routing
│   ├── index.css           # Global Tailwind CSS custom styles & font imports
│   ├── main.tsx            # React application mounting point
│   └── types.ts            # Type definitions, Ranks, and interfaces
├── metadata.json           # Application config, frame permissions
├── tailwind.config.js      # Theme configurations
└── vite.config.ts          # Build server and path aliases
\`\`\`

#### 🔄 System Data Flow & Modules
1. **State Orchestrator (App.tsx)**:
   - Holds core state: \`currentLevel\` (1-7), \`timeRemaining\` (seconds, starting from 2400), \`score\`, \`lives\` (3), \`energy\` (100%), \`hintsUsed\`, \`gameStatus\` ('intro' | 'playing' | 'gameover' | 'victory'), and \`leaderboard\`.
   - Broadcasts current HUD attributes and listens for state update payloads from child Level Components.
2. **Web Audio Core (audio.ts)**:
   - Encapsulates safe browser synthesizers using native oscillator nodes. Triggers are fired directly by user interaction events or level transition callbacks.
3. **Local Storage Engine**:
   - Persists high scores and local team completion achievements asynchronously. On final stage submission, scores are injected and sorted into \`localStorage.getItem('robot_escape_leaderboard')\`.
`
    },
    {
      title: "2. Level Specifications",
      icon: Shield,
      content: `### Comprehensive Level Design and Mechanics

Each level enforces learning-by-doing, presenting an interactive puzzle rather than basic multiple choice.

| Level | Title | Core Mechanic Type | Objective & Educational Focus | Win/Lose Conditions |
|---|---|---|---|---|
| **1** | **Security Gate** | Decoding Terminal | deciphering hexadecimal, binary, and logic gate keys. | **Win**: Correct security sequence entered. <br>**Lose**: Timer expires or lives reach 0 due to incorrect decryptions. |
| **2** | **Robotics Workshop** | Interactive Board | Drop 7 robotics components onto Breadboard slots to connect a sonar relay. | **Win**: All 7 matched correctly. <br>**Lose**: Slot mismatch limit reached (drains energy). |
| **3** | **Power Room** | Wiring Grid Chain | Establish an electrical chain in strict sequence (Battery → Switch → Fuse → Motor Driver → Motor). | **Win**: Valid sequence path formed. <br>**Lose**: Connecting nodes out of sequence triggers a spark (-25 HP). |
| **4** | **Robot Factory** | Retro Arcade Grid | Guide Unit-R7 drone through a grid of hazard sensors to reach the master console. | **Win**: Reached the console. <br>**Lose**: Collision with energy hazards drains lives. |
| **5** | **Programming Lab** | Block Sequencing | Assemble visual instruction blocks (\`Start\`, \`Move\`, \`Turn\`, \`If Obstacle\`) to escape a structural maze. | **Win**: Code sequence solves the maze path. <br>**Lose**: Robot gets stuck, crashes, or executes infinite loop. |
| **6** | **AI Vault** | 5-Laser Lockout | Resolve 5 distinct multidisciplinary STEM puzzles to disable 5 perimeter defense lasers. | **Win**: All 5 lasers deactivated. <br>**Lose**: Exploding laser limits. |
| **7** | **Final Scene** | Victory Protocol | Core hack, final scoring, rank calculation, and leaderboard database injection. | **Win**: Core stabilized. <br>**Lose**: Manual self-destruct trigger. |
`
    },
    {
      title: "3. Interactive Prototype Spec",
      icon: Code,
      content: `### Interactive Prototype & State Structures

The prototype maintains real-time React states representing logical matrices and component configurations.

#### State Schema Example: Logic Block Sequencing (Level 5)
\`\`\`typescript
interface Level5State {
  availableBlocks: LogicBlock[]; // [ {id: '1', type: 'Move'}, {id: '2', type: 'Turn Right'}... ]
  activeProgram: LogicBlock[];    // User's current stacked sequence
  isRunning: boolean;            // Controls visual robot walkthrough
  robotPosition: { x: number; y: number; dir: 'N' | 'E' | 'S' | 'W' };
  mazeLayout: number[][];        // 0: Empty, 1: Wall, 2: Goal, 3: Hazard
}
\`\`\`

#### State Schema Example: Custom Wiring Nodes (Level 3)
\`\`\`typescript
interface WiringState {
  nodes: {
    id: string;
    label: string;
    connectedTo: string | null;
    order: number; // Correct position index in flow
    placed: boolean;
  }[];
  isComplete: boolean;
  sparksCount: number;
}
\`\`\`

#### State Schema Example: 5-Laser Vault (Level 6)
\`\`\`typescript
interface VaultLaser {
  id: number;
  laserName: string;
  discipline: 'sensor' | 'electronics' | 'programming' | 'vision' | 'sequencing';
  solved: boolean;
  puzzleData: {
    question: string;
    options: string[];
    correctIndex: number;
    visualClue: string;
  };
}
\`\`\`
`
    },
    {
      title: "4. UI/UX Wireframes",
      icon: BookOpen,
      content: `### UI/UX Design and Thematic Specifications

The user interface implements a **Dark Neon Lab** aesthetic, evoking high-security research stations.

#### Color Palette (Tailwind Configurations)
- **Primary Background**: Slate-950 (\`#020617\`) - Pure dark void.
- **Surface Panels**: Slate-900 with slate-800 borders (\`#0f172a\`), decorated with subtle \`backdrop-blur\`.
- **Primary Neon Laser**: Violet-500 (\`#8b5cf6\`) and Fuchsia-500 (\`#d946ef\`) glows.
- **Safety Energy/Power Line**: Cyan-400 (\`#22d3ee\`) and Emerald-400 (\`#34d399\`).
- **Alarms / Sparks**: Rose-500 (\`#f43f5e\`) pulsing lights.

#### Key UI Modules and Layouts
1. **Interactive Glass Card Components**:
   - Every level sits inside a container styled with: \`bg-slate-900/80 border border-slate-700/50 rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.15)]\`.
2. **The Holographic HUD Grid**:
   - Placed globally at the top with sticky positioning:
     - Left Segment: Current Level Indicator with stylized industrial typography (\`font-display\` - Orbitron).
     - Center Segment: Objective Display flashing warning prompts (\`font-accent\` - Rajdhani).
     - Right Segment: Live ticking timer in glowing crimson monospace text.
3. **Micro-Interaction States**:
   - Hovering buttons yields instant scaling and shadow shifts (\`transition duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]\`).
`
    },
    {
      title: "5. Question Banks",
      icon: HelpCircle,
      content: `### Extended Curriculum & Question Bank

The data structures are randomized to provide extensive replayability.

#### Level 1: Security Gate Cryptography Keys
- **Key A**: Decrypt binary \`101010\` to decimal.
  - *Correct*: \`42\`
  - *Hint*: $32 \times 1 + 16 \times 0 + 8 \times 1 + 4 \times 0 + 2 \times 1 + 1 \times 0$
- **Key B**: Logic Gate: What is the output of an AND gate if inputs are A=1 and B=0?
  - *Correct*: \`0\`
  - *Hint*: AND gates require BOTH inputs to be HIGH (1) to output HIGH.

#### Level 6: Multidisciplinary Vault Mix
1. **Sensor Laser (Ultrasonic physics)**:
   - *Question*: An ultrasonic sensor receives an echo after 4ms. Speed of sound is 340m/s. What is the distance?
   - *Correct*: \`0.68m\` (or 68cm)
   - *Formula*: $d = \frac{v \times t}{2}$ (Sound travels to obstacle and back).
2. **Electronics Laser (Resistors)**:
   - *Question*: A resistor color sequence is Brown-Black-Red. What is its Ohm resistance?
   - *Correct*: \`1000 Ohms\` (1k)
   - *Hint*: Brown=1, Black=0, Red=10^2 multiplier.
3. **Programming Laser (Conditionals)**:
   - *Question*: What is the final value of \`x\` if: \`for i in 0..3 { x += i }\` (initial \`x=0\`)?
   - *Correct*: \`6\`
   - *Logic*: $0 + 1 + 2 + 3 = 6$.
4. **Image Recognition Laser (CNN filters)**:
   - *Question*: Which filter kernel is commonly used to detect sharp vertical edges in input matrices?
   - *Correct*: \`Sobel Filter\`
   - *Hint*: Vertical gradients use high-contrast horizontal columns like \`[-1, 0, 1]\`.
5. **Data Packet Sequence Laser**:
   - *Question*: Complete the data pack baud rate sequence: \`1200, 2400, 4800, 9600, ...\`
   - *Correct*: \`19200\`
   - *Logic*: Simple geometric doubling ($9600 \times 2 = 19200$).
`
    },
    {
      title: "6. Animation & FX",
      icon: Zap,
      content: `### Visual Special Effects and Animations Specification

Framer Motion triggers are linked directly to action handlers in the game loop.

#### 🌌 System Triggers & Keyframes
1. **Screen Stagger Entry (App Level)**:
   - **Trigger**: Fired on Level Load.
   - **Animation**: Cards slide upwards from \`y: 30\` to \`y: 0\` with opacity ramping from 0 to 1 over 450ms (\`easeOut\`).
2. **Electro-Spark FX (Power Room Error)**:
   - **Trigger**: Incorrect connection node placed.
   - **Animation**: Screen shake effect along with flash elements pulsing opacity 0% to 100% to 0% in three rapid bursts (120ms total duration).
3. **Laser Pulse Humming (AI Vault)**:
   - **Trigger**: Laser array active.
   - **Animation**: Infinite SVG stroke scaling. Vertical line nodes scale on X-axis from \`scaleX: 1\` to \`scaleX: 1.4\` with an oscillating transition duration of 1.2s (\`yoyo: Infinity\`).
4. **Robot Path Movement (Programming Lab)**:
   - **Trigger**: "Execute Program" clicked.
   - **Animation**: Node-by-node translation of the robot sprite over 300ms intervals, transitioning scale slightly on rotations.
`
    },
    {
      title: "7. Implementation Checklist",
      icon: CheckSquare,
      content: `### Technical Construction Checklist

#### Phase 1: Foundation (Hours 1-3)
- [x] Configure Tailwind CSS custom holographic neon styles in index.css.
- [x] Establish core typing declarations inside types.ts.
- [x] Initialize Web Audio API class inside audio.ts.

#### Phase 2: Core Gameplay Screens (Hours 4-10)
- [x] Build Decryption Gate component with custom terminal command interfaces.
- [x] Assemble drag-and-drop circuit matrix.
- [x] Develop electrical wiring grids with real-time route solvers.
- [x] Build 2D grid/canvas arcade maze with retro obstacle collision physics.
- [x] Structure Visual Logic-Block compiler.

#### Phase 3: Integration & Polish (Hours 11-15)
- [x] Hook global timer ticking thread into parent App.tsx state.
- [x] Formulate scoring algorithm + custom engineering Rank badges.
- [x] Establish permanent local leaderboard databases in LocalStorage.
- [x] Conduct full verification build utilizing compile_applet commands.
`
    }
  ];

  const copyToClipboard = () => {
    try {
      const fullMarkdown = deliverables.map(d => `# ${d.title}\n\n${d.content}`).join('\n\n');
      navigator.clipboard.writeText(fullMarkdown);
      setCopied(true);
      audio.playBeep(1000, 0.1);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Clipboard copy fail fallback
    }
  };

  const ActiveIcon = deliverables[activeTab].icon;

  return (
    <div className="flex flex-col h-full bg-transparent text-slate-100 font-sans border-l border-white/10" id="tech-spec-container">
      {/* Tab Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md relative z-10" id="tech-spec-header">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400 animate-pulse" id="hologram-book-icon" />
          <span className="font-display font-black tracking-wider text-sm bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
            A.R.I.A. CORE PROTOCOL BLUEPRINTS
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl btn-secondary text-xs cursor-pointer font-bold"
          id="copy-spec-button"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" id="copy-success-icon" /> : <Copy className="w-3.5 h-3.5" id="copy-default-icon" />}
          {copied ? "Copied Spec!" : "Copy Spec MD"}
        </button>
      </div>

      {/* Main Spec Interface */}
      <div className="flex flex-1 overflow-hidden" id="tech-spec-body-split">
        {/* Sidebar Nav */}
        <div className="w-1/3 border-r border-white/10 bg-black/30 overflow-y-auto p-2.5 space-y-1.5" id="tech-spec-sidebar">
          {deliverables.map((d, index) => {
            const TabIcon = d.icon;
            const isActive = activeTab === index;
            return (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  audio.playBeep(700 + index * 50, 0.05);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-3 rounded-lg text-left transition duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-lg'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
                id={`spec-tab-btn-${index}`}
              >
                <TabIcon className={`w-4.5 h-4.5 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} id={`spec-tab-icon-${index}`} />
                <span className="text-xs font-display tracking-wide uppercase truncate">{d.title}</span>
              </button>
            );
          })}
        </div>

        {/* Spec Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/10 relative" id="tech-spec-viewer-pane">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-cyan-300 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-xl w-fit border border-cyan-500/20" id="tech-spec-section-badge">
            <ActiveIcon className="w-3.5 h-3.5 animate-pulse text-cyan-400" id="active-spec-icon" />
            SECURED DESIGN FILE // DELIVERABLE {activeTab + 1}
          </div>
          
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans leading-relaxed space-y-4" id="tech-spec-prose-content">
            {deliverables[activeTab].content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={pIdx} className="text-lg font-display text-white font-black tracking-tight pt-2 border-b border-white/10 pb-1.5" id={`p-h3-${pIdx}`}>
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              if (paragraph.startsWith('####')) {
                return (
                  <h4 key={pIdx} className="text-sm font-display text-cyan-300 font-bold tracking-wider uppercase pt-2" id={`p-h4-${pIdx}`}>
                    {paragraph.replace('####', '').trim()}
                  </h4>
                );
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-slate-300" id={`p-ul-${pIdx}`}>
                    {paragraph.split('\n').map((li, liIdx) => (
                      <li key={liIdx} className="text-xs font-sans leading-relaxed">
                        {li.replace('-', '').trim()}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith('```')) {
                const codeLines = paragraph.replace(/```[a-z]*/g, '').trim().split('\n');
                return (
                  <pre key={pIdx} className="bg-black/60 p-4 rounded-xl border border-white/15 text-xs font-mono text-cyan-300 overflow-x-auto my-3 shadow-inner" id={`p-pre-${pIdx}`}>
                    <code>{codeLines.join('\n')}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith('|')) {
                const tableRows = paragraph.split('\n').filter(r => r.trim().startsWith('|'));
                return (
                  <div className="overflow-x-auto my-3" key={pIdx} id={`p-table-container-${pIdx}`}>
                    <table className="min-w-full text-xs text-left text-slate-300 border-collapse border border-white/10 rounded-xl overflow-hidden" id={`p-table-${pIdx}`}>
                      <tbody id={`p-table-tbody-${pIdx}`}>
                        {tableRows.map((row, rIdx) => {
                          const isHeader = rIdx === 0;
                          const isSeparator = row.includes('---|');
                          if (isSeparator) return null;
                          const cells = row.split('|').filter((_, idx) => idx > 0 && idx < row.split('|').length - 1);
                          return (
                            <tr key={rIdx} className={isHeader ? "bg-white/5 border-b border-white/10 font-display text-cyan-300 uppercase tracking-wider font-semibold text-[10px]" : "border-b border-white/5 hover:bg-white/5 transition"} id={`p-tr-${pIdx}-${rIdx}`}>
                              {cells.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 text-xs" dangerouslySetInnerHTML={{ __html: cell.trim().replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/<br>/g, '\n') }} id={`p-td-${pIdx}-${rIdx}-${cIdx}`} />
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <p key={pIdx} className="text-xs leading-relaxed" id={`p-p-${pIdx}`} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-black/60 border border-white/10 px-1.5 py-0.5 rounded text-[11px] text-cyan-400 font-mono">$1</code>') }} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
