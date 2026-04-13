"use client";

import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              "rounded-2xl border border-stone-200/80 bg-white/95 shadow-lg backdrop-blur-md font-sans",
          },
        }}
      />
    </>
  );
}
