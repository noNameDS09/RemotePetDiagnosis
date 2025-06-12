import type { ReactNode } from 'react';
import { Header } from './header';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col bg-background">
      <Header />
      <main className="">
        {children}
      </main>
    </div>
  );
}
