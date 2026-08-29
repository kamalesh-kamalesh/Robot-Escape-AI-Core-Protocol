/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LeaderboardEntry {
  id: string;
  teamName: string;
  timeRemaining: string; // MM:SS format
  timeElapsedSeconds: number;
  score: number;
  accuracy: number;
  rank: string;
  date: string;
}

export type Rank = 
  | 'Legend Engineer' 
  | 'Master Engineer' 
  | 'Robotics Expert' 
  | 'Junior Engineer' 
  | 'Trainee';

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  category: 'controller' | 'actuator' | 'sensor' | 'utility';
  imagePlaceholder: string;
}

export interface WiringNode {
  id: string;
  name: string;
  expectedOrder: number; // 1: Battery, 2: Switch, 3: Fuse, 4: Motor Driver, 5: Motor
  type: string;
  description: string;
}

export interface LogicBlock {
  id: string;
  type: 'Start' | 'Move' | 'Turn Right' | 'Turn Left' | 'Repeat' | 'If Obstacle' | 'Stop';
  param?: number | string;
}

export interface LevelState {
  score: number;
  completed: boolean;
}
