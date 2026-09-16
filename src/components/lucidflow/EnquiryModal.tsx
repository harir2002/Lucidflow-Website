import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { EnquiryForm } from "./EnquiryForm";
import { useEnquiry } from "./EnquiryProvider";
import { trackFormOpen } from "@/lib/ga4";

export function EnquiryModal() {
  const { isOpen, closeEnquiry, heading } = useEnquiry();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Track form open event for analytics
    trackFormOpen({
      source_section: "form_modal",
    });

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const timeout = window.setTimeout(() => closeButtonRef.current?.focus(), 20);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        closeEnquiry();
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus();
    };
  }, [busy, closeEnquiry, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto px-4 py-6 sm:items-center sm:py-10">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close enquiry form"
        onClick={() => {
          if (!busy) closeEnquiry();
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-2xl border border-white/12 bg-dark-surface shadow-panel"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 id={titleId} className="font-display pr-4 text-xl font-semibold tracking-tight text-light-text sm:text-2xl">
            {heading}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-white/15 text-white"
            aria-label="Close enquiry form"
            onClick={() => {
              if (!busy) closeEnquiry();
            }}
            disabled={busy}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[min(78vh,760px)] overflow-y-auto px-5 py-5 sm:px-6">
          <EnquiryForm onBusyChange={setBusy} />
        </div>
      </div>
    </div>
  );
}
