import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface Team {
  id: string;
  name: string;
  member1: string;
  member2: string;
  score: number;
  level: number;
  completedAt?: number;
  createdAt: number;
}

const teams: Record<string, Team> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Register a new team
  app.post("/api/teams", (req, res) => {
    const { name, member1, member2 } = req.body;
    if (!name || !member1 || !member2) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newTeam: Team = {
      id,
      name,
      member1,
      member2,
      score: 0,
      level: 1,
      createdAt: Date.now()
    };
    
    teams[id] = newTeam;
    res.json(newTeam);
  });

  // Update team progress
  app.put("/api/teams/:id/progress", (req, res) => {
    const { id } = req.params;
    const { score, level, isFinished } = req.body;
    
    if (!teams[id]) {
      return res.status(404).json({ error: "Team not found" });
    }
    
    if (score !== undefined) teams[id].score = score;
    if (level !== undefined) teams[id].level = level;
    if (isFinished && !teams[id].completedAt) {
      teams[id].completedAt = Date.now();
    }
    
    res.json(teams[id]);
  });

  // Get specific team for client polling
  app.get("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    if (!teams[id]) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(teams[id]);
  });

  // Host override team
  app.put("/api/teams/:id/override", (req, res) => {
    const { id } = req.params;
    const { score, level } = req.body;
    if (!teams[id]) {
      return res.status(404).json({ error: "Team not found" });
    }
    if (score !== undefined) teams[id].score = score;
    if (level !== undefined) teams[id].level = level;
    res.json(teams[id]);
  });

  // Delete single team
  app.delete("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    if (!teams[id]) {
      return res.status(404).json({ error: "Team not found" });
    }
    delete teams[id];
    res.json({ success: true });
  });

  // Get all teams for host leaderboard
  app.get("/api/teams", (req, res) => {
    const allTeams = Object.values(teams).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.level !== a.level) return b.level - a.level;
      if (a.completedAt && b.completedAt) return a.completedAt - b.completedAt;
      return a.createdAt - b.createdAt;
    });
    res.json(allTeams);
  });

  // Clear all teams (Host function)
  app.delete("/api/teams", (req, res) => {
    for (const key in teams) delete teams[key];
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
