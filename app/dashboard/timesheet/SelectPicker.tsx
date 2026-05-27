"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

export type SelectPickerOption = {
  id: string;
  label: string;
  rightLabel?: string;
  rightLabelClassName?: string;
  isDimmed?: boolean;
};

type SelectPickerProps = {
  id: string;
  name?: string;
  options: SelectPickerOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
  required?: boolean;
};

export default function SelectPicker({
  id,
  name,
  options,
  value,
  onChange,
  placeholder,
  required,
}: SelectPickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const selected = useMemo(
    () => options.find((o) => o.id === value) ?? null,
    [options, value],
  );

  return (
    <div ref={containerRef} className="relative">
      {name ? (
        <input type="hidden" name={name} value={value} required={required} />
      ) : null}

      <button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-left text-white/80 transition hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}{" "}
          {selected?.rightLabel ? (
            <span className={cn(selected.rightLabelClassName)}>{selected.rightLabel}</span>
          ) : null}
        </span>
        <span className="text-white/40">▾</span>
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-white/20 bg-[#070B14] p-2 shadow-xl shadow-black/40"
        >
          {options.map((opt) => {
            const active = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                  opt.isDimmed && "opacity-70",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate">{opt.label}</span>
                  {opt.rightLabel ? (
                    <span
                      className={cn(
                        "shrink-0 text-xs font-medium",
                        opt.rightLabelClassName ?? "text-white/50",
                      )}
                    >
                      {opt.rightLabel}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

