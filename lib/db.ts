import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  stats: UserStats;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  bestStreak: number;
  totalGuesses: number;
  correctGuesses: number;
  lastPlayed: string | null;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  }
}

export function readUsers(): User[] {
  ensureDataDir();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function writeUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function findUserByEmail(email: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.email === email);
}

export function findUserById(id: string): User | undefined {
  const users = readUsers();
  return users.find((u) => u.id === id);
}

export function createUser(user: User): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

export function updateUserStats(userId: string, won: boolean, guesses: number, correct: number): UserStats {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error('User not found');

  const stats = users[idx].stats;
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.gamesLost++;
    stats.currentStreak = 0;
  }
  stats.totalGuesses += guesses;
  stats.correctGuesses += correct;
  stats.lastPlayed = new Date().toISOString();

  users[idx].stats = stats;
  writeUsers(users);
  return stats;
}

export function getLeaderboard(limit = 20): Pick<User, 'name' | 'stats'>[] {
  const users = readUsers();
  return users
    .filter((u) => u.stats.gamesPlayed > 0)
    .sort((a, b) => {
      const aWinRate = a.stats.gamesWon / Math.max(a.stats.gamesPlayed, 1);
      const bWinRate = b.stats.gamesWon / Math.max(b.stats.gamesPlayed, 1);
      if (bWinRate !== aWinRate) return bWinRate - aWinRate;
      return b.stats.gamesWon - a.stats.gamesWon;
    })
    .slice(0, limit)
    .map((u) => ({ name: u.name, stats: u.stats }));
}
