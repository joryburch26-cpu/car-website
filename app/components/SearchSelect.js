"use client";
import { useEffect, useRef, useState } from "react";

// A search bar: type to filter the list, then choose an option.
// options = [{ value, label, search? }]
export default function SearchSelect({ placeholder, options, value, onChange, emptyText }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  // Close the list when the visitor taps somewhere else
  useEffect(() => {
    function handleOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const needle = query.trim().toLowerCase();
  const shown = needle
    ? options.filter((o) => (o.search || o.label).toLowerCase().includes(needle))
    : options;

  function choose(optionValue) {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={wrapRef} className="relative">
      <input
        type="text"
        value={open ? query : selected ? selected.label : ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#81b7db] rounded-full px-5 py-2 text-base text-brand-text outline-none focus:border-[#0171bb] placeholder:text-[#6aaed8]"
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          onClick={() => choose("")}
          aria-label="Clear"
          className="absolute top-1/2 -translate-y-1/2 end-3 text-brand-muted hover:text-[#0171bb] text-xl leading-none"
        >
          ×
        </button>
      )}

      {open && (
        <ul className="absolute z-30 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-[#81b7db] rounded-xl shadow-lg">
          {shown.length === 0 ? (
            <li className="px-4 py-2 text-sm text-brand-muted">{emptyText}</li>
          ) : (
            shown.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => choose(o.value)}
                  className={
                    "w-full text-start px-4 py-2 hover:bg-[#e4f1f9] " +
                    (o.value === value ? "font-semibold text-[#0171bb]" : "text-brand-text")
                  }
                >
                  {o.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
