"use client";

import { useEffect, useId, useRef, useState } from "react";

const STYLES = [
  { value: "budget", label: "Budget", hint: "Smart spends" },
  { value: "luxury", label: "Luxury", hint: "Premium stays" },
  { value: "solo", label: "Solo", hint: "Your pace" },
  { value: "couple", label: "Couple", hint: "Romantic" },
  { value: "adventure", label: "Adventure", hint: "Active & bold" },
] as const;

export type TravelStyleValue = (typeof STYLES)[number]["value"];

type TravelStyleSelectProps = {
  value: TravelStyleValue;
  onChange: (value: TravelStyleValue) => void;
};

export default function TravelStyleSelect({ value, onChange }: TravelStyleSelectProps) {
  const id = useId();
  const btnId = `${id}-btn`;
  const menuId = `${id}-menu`;
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const current = STYLES.find((s) => s.value === value) ?? STYLES[0];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        id={btnId}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#0c1829]/12 bg-white/95 px-3 py-2.5 text-left shadow-inner transition hover:border-[#c9a227]/35 focus:border-[#c9a227]/60 focus:outline-none focus:ring-2 focus:ring-[#c9a227]/25"
      >
        <span>
          <span className="block text-sm font-semibold capitalize text-[#0c1829]">{current.label}</span>
          <span className="text-xs text-[#64748b]">{current.hint}</span>
        </span>
        <span className={`text-[#64748b] transition ${open ? "rotate-180" : ""}`} aria-hidden>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-labelledby={btnId}
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-[#0c1829]/10 bg-white py-1 shadow-xl ring-1 ring-black/5"
        >
          {STYLES.map((s) => (
            <li key={s.value} role="option" aria-selected={value === s.value}>
              <button
                type="button"
                className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm transition ${
                  value === s.value
                    ? "bg-[#c9a227]/15 font-medium text-[#0c1829]"
                    : "text-[#334155] hover:bg-[#f8f6f3]"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(s.value);
                  setOpen(false);
                }}
              >
                <span className="capitalize">{s.label}</span>
                <span className="text-xs font-normal text-[#64748b]">{s.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
