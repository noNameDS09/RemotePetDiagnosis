import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col bg-background">
      
      <main className="">
        {children}
      </main>
    </div>
  );
}
