// Stores appointment requests in Supabase. The public key below can only call submit_redfine_booking();
// it cannot read any bookings. See supabase/migrations/20260929120000_redfine_bookings.sql.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://aqilclozwukdnogqcmsy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_WxRQU6rp23egBw82BowR0Q_87CaKcsS';

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes: string;
  language: 'en' | 'ar';
}

export class BookingError extends Error {
  constructor(message: string, readonly rateLimited = false) {
    super(message);
  }
}

export async function submitBooking(request: BookingRequest): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/submit_redfine_booking`, {
      method: 'POST',
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        p_name: request.name,
        p_email: request.email,
        p_phone: request.phone,
        p_service: request.service,
        p_date: request.date,
        p_time: request.time,
        p_notes: request.notes,
        p_language: request.language,
      }),
    });
  } catch {
    throw new BookingError('network');
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new BookingError(body?.message || `HTTP ${res.status}`, body?.message === 'rate_limited');
  }
}
