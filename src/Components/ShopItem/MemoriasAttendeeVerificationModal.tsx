import React, { useCallback, useEffect, useId, useRef, useState } from 'react';

/** Legacy modal (verificación asistentes); no en flujo de compra actual. */
const MEMORIAS_ATTENDEE_MODAL_TITLE = 'Verifica tu asistencia';
const MEMORIAS_ATTENDEE_MODAL_INTRO =
  'Ingresa el correo electrónico que utilizaste para registrarte en RenaSER 2026.';
const MEMORIAS_ATTENDEE_MODAL_EMAIL_LABEL = 'Correo electrónico';
const MEMORIAS_ATTENDEE_MODAL_CTA = 'Verificar mi asistencia';
const MEMORIAS_ATTENDEE_MODAL_FOOTNOTE =
  'Si encontramos tu registro, podrás continuar con la compra.';
const MEMORIAS_ATTENDEE_VERIFICATION_PENDING_MESSAGE =
  'Recibimos tu solicitud. La verificación automática se activará pronto.';

type MemoriasAttendeeVerificationModalProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
};

const MemoriasAttendeeVerificationModal = ({
  open,
  onClose,
  returnFocusRef,
}: MemoriasAttendeeVerificationModalProps) => {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setSubmitted(false);
    setEmail('');
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    const t = window.setTimeout(() => emailInputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="font-futura w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-[22px] font-semibold leading-snug text-[#1d1d1f]">
            {MEMORIAS_ATTENDEE_MODAL_TITLE}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="rounded-full px-2 py-1 text-[#6e6e73] hover:bg-[#f5f5f7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d4a7a]"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p id={descId} className="mb-4 text-[15px] leading-relaxed text-[#424245]">
              {MEMORIAS_ATTENDEE_MODAL_INTRO}
            </p>
            <label htmlFor="memorias-attendee-email" className="mb-2 block text-[13px] font-medium text-[#1d1d1f]">
              {MEMORIAS_ATTENDEE_MODAL_EMAIL_LABEL}
            </label>
            <input
              ref={emailInputRef}
              id="memorias-attendee-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full rounded-xl border border-[#e5e5ea] px-4 py-3 text-[16px] text-[#1d1d1f] focus:border-[#2d4a7a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d4a7a]/30"
            />
            <p className="mb-5 text-[13px] leading-relaxed text-[#86868b]">
              {MEMORIAS_ATTENDEE_MODAL_FOOTNOTE}
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-[#2d4a7a] px-6 py-3 text-[14px] font-bold tracking-wide text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2d4a7a] focus-visible:ring-offset-2"
            >
              {MEMORIAS_ATTENDEE_MODAL_CTA}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-[15px] leading-relaxed text-[#424245]">
              {MEMORIAS_ATTENDEE_VERIFICATION_PENDING_MESSAGE}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full rounded-full bg-pale-skin px-6 py-3 text-[14px] font-bold tracking-wide text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b8956a] focus-visible:ring-offset-2"
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriasAttendeeVerificationModal;
