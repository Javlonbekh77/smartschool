import type React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center mb-4">
      <h1 className="text-lg font-semibold md:text-2xl font-headline">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        {children}
      </div>
    </div>
  );
}
