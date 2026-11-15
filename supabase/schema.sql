-- 내 트리를 꾸며줘 — run once in the Supabase SQL Editor.
-- Safe to run again: everything is "if not exists" / "or replace".
-- Lives in the same Supabase project as the other 향수병 게임즈 apps, in its own tables.
--
-- What gets stored: the tree owner's nickname, a hash of the owner's secret key,
-- each ornament's sender nickname + message, and hashed IPs (for spam limits).
-- Raw IPs and raw owner keys are never stored.

create table if not exists public.trees (
  id text primary key check (id ~ '^[A-Za-z0-9]{8}$'),
  name text not null check (char_length(name) between 1 and 12),
  owner_hash text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ornaments (
  id bigint generated always as identity primary key,
  tree_id text not null references public.trees (id) on delete cascade,
  kind text not null check (kind in ('ball', 'star', 'bell', 'candycane', 'stocking', 'gift', 'snowman', 'gingerbread')),
  author text not null check (char_length(author) between 1 and 10),
  message text not null check (char_length(message) between 1 and 120),
  slot int not null,
  hidden boolean not null default false,
  ip_hash text not null,
  created_at timestamptz not null default now(),
  unique (tree_id, slot)
);

create index if not exists trees_ip_time on public.trees (ip_hash, created_at desc);
create index if not exists ornaments_tree on public.ornaments (tree_id, slot);
create index if not exists ornaments_ip_time on public.ornaments (ip_hash, created_at desc);

-- RLS on with no policies = the public keys can't read or write anything.
alter table public.trees enable row level security;
alter table public.ornaments enable row level security;
revoke all on public.trees, public.ornaments from anon, authenticated;
grant select, insert, update, delete on public.trees, public.ornaments to service_role;


-- New tree. The id and owner hash are made on the server.
create or replace function public.create_tree(
  p_id text,
  p_name text,
  p_owner_hash text,
  p_ip_hash text,
  p_per_ip int default 5,       -- trees per person
  p_window_min int default 60   -- ...per this many minutes
)
returns jsonb
language plpgsql
as $$
declare
  v_recent int;
begin
  perform pg_advisory_xact_lock(hashtext('tree:' || p_ip_hash));

  select count(*) into v_recent
  from public.trees
  where ip_hash = p_ip_hash
    and created_at > now() - make_interval(mins => p_window_min);
  if v_recent >= p_per_ip then
    return jsonb_build_object('ok', false, 'reason', 'ip');
  end if;

  begin
    insert into public.trees (id, name, owner_hash, ip_hash)
    values (p_id, p_name, p_owner_hash, p_ip_hash);
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'taken'); -- random id clash, server retries
  end;

  return jsonb_build_object('ok', true);
end;
$$;


-- Hang one ornament. Slots count up so ornaments never move around.
create or replace function public.add_ornament(
  p_tree text,
  p_kind text,
  p_author text,
  p_message text,
  p_ip_hash text,
  p_per_ip int default 10,      -- ornaments per person
  p_window_min int default 10,  -- ...per this many minutes
  p_max int default 120         -- ornaments per tree
)
returns jsonb
language plpgsql
as $$
declare
  v_recent int;
  v_slot int;
begin
  if not exists (select 1 from public.trees where id = p_tree) then
    return jsonb_build_object('ok', false, 'reason', 'none');
  end if;

  perform pg_advisory_xact_lock(hashtext('orn:' || p_tree));

  select count(*) into v_recent
  from public.ornaments
  where ip_hash = p_ip_hash
    and created_at > now() - make_interval(mins => p_window_min);
  if v_recent >= p_per_ip then
    return jsonb_build_object('ok', false, 'reason', 'ip');
  end if;

  select coalesce(max(slot) + 1, 0) into v_slot from public.ornaments where tree_id = p_tree;
  if v_slot >= p_max then
    return jsonb_build_object('ok', false, 'reason', 'full');
  end if;

  insert into public.ornaments (tree_id, kind, author, message, slot, ip_hash)
  values (p_tree, p_kind, p_author, p_message, v_slot, p_ip_hash);

  return jsonb_build_object('ok', true, 'slot', v_slot);
end;
$$;


-- Everything the tree page needs. Messages only go to the owner, and only after p_open_at.
create or replace function public.get_tree(
  p_tree text,
  p_owner_hash text default null,
  p_open_at timestamptz default '2026-12-25 00:00:00+09'
)
returns jsonb
language sql
stable
as $$
  with t as (
    select id, name, (p_owner_hash is not null and owner_hash = p_owner_hash) as is_owner
    from public.trees
    where id = p_tree
  )
  select case when not exists (select 1 from t) then null else
    jsonb_build_object(
      'name', (select name from t),
      'owner', (select is_owner from t),
      'open', now() >= p_open_at,
      'next', (select coalesce(max(slot) + 1, 0) from public.ornaments where tree_id = p_tree), -- where the next one goes
      'ornaments', coalesce((
        select jsonb_agg(
          jsonb_build_object('id', o.id, 'kind', o.kind, 'author', o.author, 'slot', o.slot, 'at', o.created_at)
          || case when (select is_owner from t) and now() >= p_open_at
               then jsonb_build_object('message', o.message) else '{}'::jsonb end
          order by o.slot)
        from public.ornaments o
        where o.tree_id = p_tree and not o.hidden
      ), '[]'::jsonb)
    )
  end;
$$;


-- Owner takes down an ornament they don't like
create or replace function public.hide_ornament(p_tree text, p_owner_hash text, p_id bigint)
returns boolean
language plpgsql
as $$
declare
  v_count int;
begin
  update public.ornaments o
  set hidden = true
  from public.trees t
  where o.id = p_id and o.tree_id = p_tree and t.id = p_tree and t.owner_hash = p_owner_hash;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;


revoke execute on function public.create_tree(text, text, text, text, int, int) from public, anon, authenticated;
revoke execute on function public.add_ornament(text, text, text, text, text, int, int, int) from public, anon, authenticated;
revoke execute on function public.get_tree(text, text, timestamptz) from public, anon, authenticated;
revoke execute on function public.hide_ornament(text, text, bigint) from public, anon, authenticated;
grant execute on function public.create_tree(text, text, text, text, int, int) to service_role;
grant execute on function public.add_ornament(text, text, text, text, text, int, int, int) to service_role;
grant execute on function public.get_tree(text, text, timestamptz) to service_role;
grant execute on function public.hide_ornament(text, text, bigint) to service_role;
