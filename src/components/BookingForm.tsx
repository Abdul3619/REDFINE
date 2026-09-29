import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SERVICE_MENU, TIME_SLOTS, type Language, type ServiceId, type Translation } from '../data/content';
import { useLocalStorage } from '../lib/useLocalStorage';
import { BookingError, submitBooking } from '../lib/bookings';

interface Draft {
  name: string;
  email: string;
  phone: string;
  service: ServiceId;
  date: string;
  time: string;
  notes: string;
}

const EMPTY: Draft = { name: '', email: '', phone: '', service: 'signature-cut', date: '', time: '18:00', notes: '' };

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function BookingForm({
  t,
  lang,
  requested,
  serifFont,
}: {
  t: Translation;
  lang: Language;
  requested: { service: ServiceId; n: number } | null;
  serifFont: string;
}) {
  // The draft is kept in localStorage so a half-filled form survives a reload or a later visit.
  const [draft, setDraft, clearDraft, hydrated] = useLocalStorage<Draft>('redfine:booking-draft', EMPTY);
  const [sent, setSent] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [range, setRange] = useState<{ min: string; max: string } | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Date limits depend on the visitor's clock, so they are set after hydration.
  useEffect(() => {
    const today = new Date();
    const max = new Date();
    max.setDate(today.getDate() + 90);
    setRange({ min: isoDate(today), max: isoDate(max) });
  }, []);

  // A "Book" button in the pricing list or a membership card preselects the service.
  useEffect(() => {
    if (requested && hydrated) {
      setDraft((d) => ({ ...d, service: requested.service }));
      setSent(null);
    }
  }, [requested, hydrated, setDraft]);

  useEffect(() => {
    if (sent) doneRef.current?.focus();
  }, [sent]);

  const update = (field: keyof Draft) => (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (range && (draft.date < range.min || draft.date > range.max)) {
      setError(t.form.errorDate);
      errorRef.current?.focus();
      return;
    }
    // Optimistic: show the confirmation straight away and send in the background. If sending fails,
    // the form comes back with everything the visitor typed and an error message.
    const snapshot = draft;
    setSent(snapshot);
    clearDraft();
    try {
      await submitBooking({ ...snapshot, language: lang });
    } catch (err) {
      setDraft(snapshot);
      setSent(null);
      setError(err instanceof BookingError && err.rateLimited ? t.form.errorRateLimited : t.form.errorGeneric);
      requestAnimationFrame(() => errorRef.current?.focus());
    }
  };

  const formatDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-u-ca-gregory' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const field = 'w-full bg-white/5 border border-white/20 focus:border-[#C7B28B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C7B28B]/60 px-4 py-3 text-sm text-white rounded-none';
  const label = 'block text-[11px] uppercase tracking-[0.2em] text-white/70 mb-2';

  if (sent) {
    return (
      <div className="border border-[#C7B28B]/40 bg-black/30 p-8 md:p-12 text-center" role="status">
        <h3 ref={doneRef} tabIndex={-1} className={`text-3xl md:text-4xl font-light ${serifFont} text-[#C7B28B] mb-4 focus:outline-none`}>
          {t.form.doneTitle}
        </h3>
        <p className="text-white/80 mb-2">{t.form.summary(t.services[sent.service].name, formatDate(sent.date), sent.time)}</p>
        <p className="text-white/70 mb-8">{t.form.doneBody}</p>
        <button type="button" onClick={() => setSent(null)} className="press border border-white/30 hover:border-[#C7B28B] hover:text-[#C7B28B] px-8 py-3 text-xs uppercase tracking-widest transition-colors">
          {t.form.bookAnother}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-6">
      {error && (
        <p ref={errorRef} tabIndex={-1} role="alert" className="sm:col-span-2 border border-red-400/60 bg-red-950/40 text-red-100 px-4 py-3 text-sm focus:outline-none">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="booking-name" className={label}>{t.form.name}</label>
        <input id="booking-name" required maxLength={120} autoComplete="name" value={draft.name} onChange={update('name')} className={field} />
      </div>
      <div>
        <label htmlFor="booking-email" className={label}>{t.form.email}</label>
        <input id="booking-email" type="email" required maxLength={254} autoComplete="email" value={draft.email} onChange={update('email')} className={field} dir="ltr" />
      </div>
      <div>
        <label htmlFor="booking-phone" className={label}>{t.form.phone}</label>
        <input id="booking-phone" type="tel" minLength={5} maxLength={30} autoComplete="tel" value={draft.phone} onChange={update('phone')} className={field} dir="ltr" />
      </div>
      <div>
        <label htmlFor="booking-service" className={label}>{t.form.service}</label>
        <select id="booking-service" value={draft.service} onChange={update('service')} className={`${field} bg-[#1a1a1a]`}>
          {SERVICE_MENU.map((s) => (
            <option key={s.id} value={s.id}>
              {t.services[s.id].name} · {s.minutes} {t.minutes} · {s.price} {t.currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="booking-date" className={label}>{t.form.date}</label>
        <input id="booking-date" type="date" required min={range?.min} max={range?.max} value={draft.date} onChange={update('date')} className={`${field} [color-scheme:dark]`} />
      </div>
      <div>
        <label htmlFor="booking-time" className={label}>{t.form.time}</label>
        <select id="booking-time" value={draft.time} onChange={update('time')} className={`${field} bg-[#1a1a1a]`} dir="ltr">
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="booking-notes" className={label}>{t.form.notes}</label>
        <textarea id="booking-notes" rows={3} maxLength={2000} value={draft.notes} onChange={update('notes')} className={field} />
      </div>
      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <p className="text-xs text-white/60">{t.form.draftSaved}</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => { clearDraft(); setError(''); }} className="press px-6 py-4 text-xs uppercase tracking-widest border border-white/20 hover:border-white/50 transition-colors">
            {t.form.clearDraft}
          </button>
          <button type="submit" className="press bg-[#C7B28B] text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all">
            {t.form.submit}
          </button>
        </div>
      </div>
    </form>
  );
}
