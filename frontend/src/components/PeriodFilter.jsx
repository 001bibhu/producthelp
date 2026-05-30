import { useEffect, useRef, useState } from "react";

export const PERIOD_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

export default function PeriodFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected =
    PERIOD_OPTIONS.find((opt) => opt.value === value) ?? PERIOD_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function selectOption(nextValue) {
    onChange(nextValue);
    setOpen(false);
  }

  return (
    <div className={`period-filter ${open ? "period-filter--open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="period-filter-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.label}</span>
        <span className="period-filter-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <ul className="period-filter-menu" role="listbox" aria-label="Date range">
          {PERIOD_OPTIONS.map((opt) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className={`period-filter-option ${
                  opt.value === value ? "period-filter-option--active" : ""
                }`}
                onClick={() => selectOption(opt.value)}
              >
                {opt.label}
                {opt.value === value && (
                  <span className="period-filter-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
