alter table public.members alter column invite_code set default '';
alter table public.members alter column member_code set default gen_random_uuid()::text;
alter table public.members add column if not exists confirm_token text not null default encode(gen_random_bytes(24), 'hex');
create unique index if not exists members_email_lower_key on public.members (lower(email));
create unique index if not exists members_confirm_token_key on public.members (confirm_token);

create table public.vouchers (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null unique references public.members(id) on delete cascade,
  code text not null unique,
  rabatt_prozent integer not null default 10,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz,
  redeemed_note text
);
grant select, insert, update, delete on public.vouchers to authenticated;
grant all on public.vouchers to service_role;
alter table public.vouchers enable row level security;
create policy "Admins read vouchers" on public.vouchers for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update vouchers" on public.vouchers for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.signup_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index signup_attempts_ip_time on public.signup_attempts (ip_hash, created_at);
grant all on public.signup_attempts to service_role;
alter table public.signup_attempts enable row level security;

create or replace function public.assign_admin_for_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'info@thegoldencosmetics.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger on_auth_user_owner_admin after insert on auth.users for each row execute function public.assign_admin_for_owner();