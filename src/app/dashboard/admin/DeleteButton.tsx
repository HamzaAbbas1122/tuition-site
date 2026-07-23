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
      className={className || "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs disabled:opacity-50"}
    >
      {isPending ? "Deleting..." : children}
    </button>
  );
}


