'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Chevron } from '@/components/icons';

/**
 * Custom styled select dropdown that matches the Forbes Water dark theme.
 *
 * Replaces the native <select> which can't be properly styled in dark mode.
 * Renders a hidden <input> so the value still submits with the form.
 *
 * Keyboard: Enter/Space to open, Escape to close, Arrow keys to navigate.
 */

type Props = {
  name: string;
  placeholder?: string;
  options: string[];
  defaultValue?: string;
};

export function CustomSelect({ name, placeholder = 'Select…', options, defaultValue = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll focused option into view
  useEffect(() => {
    if (open && focusedIdx >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[focusedIdx]) {
        (items[focusedIdx] as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIdx, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIdx(selected ? options.indexOf(selected) : 0);
        } else if (focusedIdx >= 0) {
          setSelected(options[focusedIdx]);
          setOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setFocusedIdx(selected ? options.indexOf(selected) : 0);
        } else {
          setFocusedIdx((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          setFocusedIdx((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Hidden input so the value submits with the form */}
      <input type="hidden" name={name} value={selected} />

      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-listbox`}
        aria-labelledby={`${id}-label`}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setFocusedIdx(selected ? options.indexOf(selected) : 0);
        }}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between rounded-[10px] border px-4 py-3 text-left text-[15px] transition-colors focus:outline-none ${
          open
            ? 'border-accent bg-fill-1'
            : 'border-line bg-fill-1 hover:border-[rgba(255,255,255,.16)]'
        } ${selected ? 'text-text' : 'text-dim'}`}
      >
        <span className="truncate">{selected || placeholder}</span>
        <span
          className={`ml-2 flex-shrink-0 text-dim transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <Chevron />
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          id={`${id}-listbox`}
          ref={listRef}
          role="listbox"
          aria-label="Industry options"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[240px] overflow-auto scrollbar-slim rounded-[14px] border border-[rgba(255,255,255,.10)] bg-ink-raised p-[6px] shadow-[0_20px_50px_-12px_rgba(0,0,0,.7)] [animation:fadeUp_.15s_ease_both]"
        >
          {options.map((option, idx) => {
            const isSelected = option === selected;
            const isFocused = idx === focusedIdx;

            return (
              <li
                key={option}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setFocusedIdx(idx)}
                className={`flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-[10px] text-[14px] transition-colors ${
                  isFocused ? 'bg-fill-3 text-text' : 'text-muted'
                } ${isSelected ? 'font-medium text-text' : ''}`}
              >
                {/* Checkmark */}
                <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center ${isSelected ? 'text-accent' : 'text-transparent'}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M2.5 7.5 L5.5 10.5 L11.5 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{option}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
