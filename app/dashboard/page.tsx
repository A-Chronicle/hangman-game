'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  currentStreak: number;
  bestStreak: number;
  totalGuesses: number;
  correctGuesses: number;
  lastPlayed: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ name: string; stats: Stats }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, lbRes] = await Promise.all([
          fetch('/api/user/stats'),
          fetch('/api/leaderboard'),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }
        if (lbRes.ok) {
          const data = await lbRes.json();
          setLeaderboard(data.leaderboard);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  const winRate = stats ? Math.round((stats.gamesWon / Math.max(stats.gamesPlayed, 1)) * 100) : 0;
  const accuracy = stats ? Math.round((stats.correctGuesses / Math.max(stats.totalGuesses, 1)) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-purple-300/70 mt-2">Welcome back, {session?.user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Games Played" value={stats?.gamesPlayed ?? 0} color="blue" />
          <StatCard label="Games Won" value={stats?.gamesWon ?? 0} color="green" />
          <StatCard label="Win Rate" value={`${winRate}%`} color="purple" />
          <StatCard label="Best Streak" value={stats?.bestStreak ?? 0} color="amber" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Games Lost" value={stats?.gamesLost ?? 0} color="red" />
          <StatCard label="Current Streak" value={stats?.currentStreak ?? 0} color="pink" />
          <StatCard label="Accuracy" value={`${accuracy}%`} color="cyan" />
          <StatCard label="Total Guesses" value={stats?.totalGuesses ?? 0} color="slate" />
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:shadow-2xl hover:shadow-purple-500/50"
          >
            Play Game
          </Link>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-purple-300 mb-6 text-center">Leaderboard</h2>
          {leaderboard.length === 0 ? (
            <p className="text-purple-300/50 text-center">No players yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => {
                const rate = Math.round((entry.stats.gamesWon / Math.max(entry.stats.gamesPlayed, 1)) * 100);
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      i === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      i === 1 ? 'bg-gray-400/10 border border-gray-400/30' :
                      i === 2 ? 'bg-amber-600/10 border border-amber-600/30' :
                      'bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-lg w-8 ${
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-500' : 'text-slate-400'
                      }`}>
                        #{i + 1}
                      </span>
                      <span className="text-white font-medium">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-purple-300">{entry.stats.gamesWon}W</span>
                      <span className="text-red-300">{entry.stats.gamesLost}L</span>
                      <span className="text-emerald-300">{rate}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-600 to-blue-800 border-blue-500/30 shadow-blue-500/20',
    green: 'from-green-600 to-emerald-800 border-green-500/30 shadow-green-500/20',
    purple: 'from-purple-600 to-pink-800 border-purple-500/30 shadow-purple-500/20',
    amber: 'from-amber-600 to-orange-800 border-amber-500/30 shadow-amber-500/20',
    red: 'from-red-600 to-rose-800 border-red-500/30 shadow-red-500/20',
    pink: 'from-pink-600 to-purple-800 border-pink-500/30 shadow-pink-500/20',
    cyan: 'from-cyan-600 to-teal-800 border-cyan-500/30 shadow-cyan-500/20',
    slate: 'from-slate-600 to-slate-800 border-slate-500/30 shadow-slate-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-xl p-4 border shadow-lg`}>
      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  );
}
