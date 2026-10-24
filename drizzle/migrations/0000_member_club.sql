create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read their own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  active boolean not null default true,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.invite_codes to authenticated;
grant all on public.invite_codes to service_role;
alter table public.invite_codes enable row level security;
create policy "Admins manage invite codes" on public.invite_codes for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.members (
  id uuid primary key default gen_random_uuid(),
  vorname text not null,
  email text not null unique,
  member_code text not null unique,
  newsletter boolean not null default false,
  newsletter_token text not null default encode(gen_random_bytes(24), 'hex'),
  newsletter_confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  invite_code text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.members to authenticated;
grant all on public.members to service_role;
alter table public.members enable row level security;
create policy "Admins manage members" on public.members for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.member_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  condition text not null default '',
  code text not null,
  valid_until date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.member_offers to authenticated;
grant all on public.member_offers to service_role;
alter table public.member_offers enable row level security;
create policy "Admins manage offers" on public.member_offers for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Public view without the secret codes
create view public.member_offers_public with (security_invoker = false) as
  select id, title, condition, valid_until from public.member_offers where active and (valid_until is null or valid_until >= current_date);
grant select on public.member_offers_public to anon, authenticated;

-- Redeem an invite code and join (single use, atomic)
create or replace function public.redeem_invite(_code text, _vorname text, _email text, _newsletter boolean)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_invite public.invite_codes%rowtype;
  v_member_code text;
begin
  select * into v_invite from public.invite_codes where code = upper(trim(_code)) and active and used_at is null for update;
  if not found then return null; end if;
  v_member_code := 'TG · ' || lpad(floor(random() * 10000)::text, 4, '0') || ' · ' || lpad(floor(random() * 100)::text, 2, '0');
  insert into public.members (vorname, email, member_code, newsletter, invite_code)
  values (left(trim(_vorname), 80), lower(trim(_email)), v_member_code, coalesce(_newsletter, false), v_invite.code);
  update public.invite_codes set used_at = now() where id = v_invite.id;
  return v_member_code;
end;
$$;
grant execute on function public.redeem_invite(text, text, text, boolean) to anon, authenticated;

-- Members reveal an offer code with their personal member code
create or replace function public.reveal_offer_code(_member_code text, _offer_id uuid)
returns text language sql stable security definer set search_path = public as $$
  select o.code from public.member_offers o
  where o.id = _offer_id and o.active and (o.valid_until is null or o.valid_until >= current_date)
    and exists (select 1 from public.members m where m.member_code = _member_code and m.unsubscribed_at is null)
$$;
grant execute on function public.reveal_offer_code(text, uuid) to anon, authenticated;

-- One-click newsletter unsubscribe via token
create or replace function public.unsubscribe_newsletter(_token text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.members set unsubscribed_at = now(), newsletter = false
  where newsletter_token = _token and unsubscribed_at is null;
  return found;
end;
$$;
grant execute on function public.unsubscribe_newsletter(text) to anon, authenticated;