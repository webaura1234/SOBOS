import { redirect } from 'next/navigation';

export default function HomePage() {
  // Always redirect to dashboard; AuthGuard will handle unauthenticated users client-side
  redirect('/dashboard');
}
