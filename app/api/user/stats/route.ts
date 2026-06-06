import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { findUserById, updateUserStats } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = findUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ stats: user.stats, name: user.name, email: user.email });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { won, guesses, correct } = await req.json();
    const stats = updateUserStats(session.user.id, won, guesses, correct);
    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
