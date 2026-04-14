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
        offset={{ top: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
        toastOptions={{
          classNames: {
            toast:
              "rounded-2xl border border-stone-200/70 bg-white/[0.97] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)] backdrop-blur-xl font-sans text-[0.9375rem]",
          },
        }}
      />
    </>
  );
}
