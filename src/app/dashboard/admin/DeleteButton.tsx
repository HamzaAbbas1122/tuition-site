"use client";

import { useTransition } from "react";

export default function DeleteButton({ 
  action, 
  confirmMessage, 
  className, 
  children 
}: { 
  action: () => Promise<void>; 
  confirmMessage: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => {
        if (confirm(confirmMessage)) {
          startTransition(async () => {
            await action();
          });
        }
      }}
      disabled={isPending}
      className={className || "text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border border-red-100 shadow-sm disabled:opacity-50"}
    >
      {isPending ? "Deleting..." : children}
    </button>
  );
}
