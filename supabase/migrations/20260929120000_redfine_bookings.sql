-- RedFine appointment requests.
-- Lives in the portfolio's Supabase project (aqilclozwukdnogqcmsy), next to the Voltway quote requests.
--
-- Security model (same as Voltway's quote form): the table has RLS enabled with no policies and no grants for
-- anon/authenticated, so the public site key can never read bookings. The site can only call
-- submit_redfine_booking(), which validates the input, applies a simple rate limit and inserts one row.
-- View bookings in the Supabase table editor.

create table if not exists public.redfine_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) between 5 and 30),
  service text not null check (char_length(service) between 1 and 60),
  preferred_date date not null,
  preferred_time text not null check (char_length(preferred_time) between 1 and 20),
  notes text check (notes is null or char_length(notes) <= 2000),
  language text not null default 'en' check (language in ('en', 'ar')),
  created_at timestamptz not null default now()
);

create index if not exists redfine_bookings_created_at_idx on public.redfine_bookings (created_at desc);

alter table public.redfine_bookings enable row level security;
revoke all on public.redfine_bookings from anon, authenticated;

create or replace function public.submit_redfine_booking(
  p_name text, p_email text, p_phone text, p_service text, p_date date, p_time text, p_notes text, p_language text
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_id uuid;
begin
  if p_date is null or p_date < current_date or p_date > current_date + 90 then
    raise exception 'invalid_date';
  end if;

  -- Basic spam protection: at most 5 requests per email and 100 in total per hour.
  if (select count(*) from redfine_bookings where lower(email) = v_email and created_at > now() - interval '1 hour') >= 5
     or (select count(*) from redfine_bookings where created_at > now() - interval '1 hour') >= 100 then
    raise exception 'rate_limited';
  end if;

  insert into redfine_bookings (name, email, phone, service, preferred_date, preferred_time, notes, language)
  values (
    btrim(coalesce(p_name, '')), v_email, nullif(btrim(coalesce(p_phone, '')), ''), btrim(coalesce(p_service, '')),
    p_date, btrim(coalesce(p_time, '')), nullif(btrim(coalesce(p_notes, '')), ''), coalesce(p_language, 'en')
  )
  returning id into v_id;
  return v_id;
end $$;

revoke all on function public.submit_redfine_booking(text, text, text, text, date, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_redfine_booking(text, text, text, text, date, text, text, text) to anon, authenticated, service_role;
