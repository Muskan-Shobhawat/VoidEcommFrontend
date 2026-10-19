import { Suspense } from 'react';
import AuthForm from '@/components/account/AuthForm';

export const metadata = { title: 'Sign in — VOID.' };

export default function Page() {
  return <Suspense><AuthForm mode="login" /></Suspense>;
}
