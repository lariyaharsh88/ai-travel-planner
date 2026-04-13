"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DESTINATION_SUGGESTIONS } from "@/lib/destination-suggestions";

type DestinationComboboxProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

const shell =
  "relative flex w-full items-center gap-2 rounded-2xl border border-stone-200/90 bg-white px-3 py-2.5 shadow-inner transition focus-within:border-[#FF6B35]/55 focus-within:ring-2 focus-within:ring-[#FF6B35]/20";

export default function DestinationCombobox({
  id: idProp,
  value,
  onChange,
  required,
}: DestinationComboboxProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const listId = `${id}-list`;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const filtered = (() => {
    const q = value.trim().toLowerCase();
    if (!q) return DESTINATION_SUGGESTIONS.slice(0, 8);
    return DESTINATION_SUGGESTIONS.filter((d) => d.toLowerCase().includes(q)).slice(0, 10);
  })();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  const pick = (destination: string) => {
    onChange(destination);
    close();
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter") && filtered.length) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    }
    if (e.key === "Enter" && filtered[highlighted]) {
      e.preventDefault();
      pick(filtered[highlighted]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div className={shell}>
        <span className="text-stone-400" aria-hidden>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.2-5.2m2.2-5.3a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            />
          </svg>
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search city or region…"
          className="min-w-0 flex-1 bg-transparent py-1 text-sm text-stone-900 outline-none placeholder:text-stone-400"
          onKeyDown={onKeyDown}
        />
        {value ? (
          <button
            type="button"
            className="rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
            aria-label="Clear destination"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>

      {open && filtered.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-2xl border border-stone-200/90 bg-white py-1 shadow-xl ring-1 ring-black/5"
        >
          {filtered.map((item, index) => (
            <li key={item} role="option" aria-selected={value === item}>
              <button
                type="button"
                className={`flex w-full items-start px-3 py-2 text-left text-sm transition ${
                  index === highlighted
                    ? "bg-[#FF6B35]/10 text-stone-900"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
                onMouseEnter={() => setHighlighted(index)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
