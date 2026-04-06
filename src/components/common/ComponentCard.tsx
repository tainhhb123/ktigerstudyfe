import { ReactNode } from 'react';

interface ComponentCardProps {
  children: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode; // Thêm prop action là optional
}

export default function ComponentCard({ children, title, desc, action }: ComponentCardProps) {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-lg shadow border border-gray-200 dark:border-white/10">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-white/10">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          {desc && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {desc}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
