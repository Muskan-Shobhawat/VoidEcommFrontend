import { Suspense } from 'react';
import AuthForm from '@/components/account/AuthForm';

export const metadata = { title: 'Create account — VOID.' };

export default function Page() {
  return <Suspense><AuthForm mode="signup" /></Suspense>;
}
