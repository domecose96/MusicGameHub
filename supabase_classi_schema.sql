-- MusicGameHub - Area docente / classi
-- Esegui questo script nell'SQL editor di Supabase prima di usare classi.html.

create extension if not exists pgcrypto;

create table if not exists public.teacher_classes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  school_year text,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.class_students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.teacher_classes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  first_name text not null,
  last_name text not null,
  username text,
  auth_email text,
  must_change_password boolean not null default false,
  email_or_code text,
  note text,
  joined_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.class_students
  add column if not exists username text,
  add column if not exists auth_email text,
  add column if not exists must_change_password boolean not null default false;

create table if not exists public.class_activity (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.teacher_classes(id) on delete cascade,
  student_id uuid references public.class_students(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  subject text not null,
  game_id text not null,
  score integer not null default 0,
  completed boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists teacher_classes_owner_idx on public.teacher_classes(owner_id);
create index if not exists teacher_classes_invite_code_idx on public.teacher_classes(invite_code);
create index if not exists class_students_class_idx on public.class_students(class_id);
create unique index if not exists class_students_username_unique_idx
on public.class_students(lower(username))
where username is not null and username <> '';
create index if not exists class_activity_class_idx on public.class_activity(class_id);
create index if not exists class_activity_student_idx on public.class_activity(student_id);

alter table public.teacher_classes enable row level security;
alter table public.class_students enable row level security;
alter table public.class_activity enable row level security;

grant select, insert, update, delete on public.teacher_classes to authenticated;
grant select, insert, delete on public.class_students to authenticated;
revoke insert on public.class_students from anon;
grant select, insert on public.class_activity to authenticated;

drop policy if exists "Docenti leggono le proprie classi" on public.teacher_classes;
create policy "Docenti leggono le proprie classi"
on public.teacher_classes for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Docenti creano le proprie classi" on public.teacher_classes;
create policy "Docenti creano le proprie classi"
on public.teacher_classes for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Docenti modificano le proprie classi" on public.teacher_classes;
create policy "Docenti modificano le proprie classi"
on public.teacher_classes for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Docenti eliminano le proprie classi" on public.teacher_classes;
create policy "Docenti eliminano le proprie classi"
on public.teacher_classes for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists "Docenti leggono alunni delle proprie classi" on public.class_students;
create policy "Docenti leggono alunni delle proprie classi"
on public.class_students for select
to authenticated
using (
  exists (
    select 1
    from public.teacher_classes c
    where c.id = class_students.class_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Alunni leggono il proprio profilo classe" on public.class_students;
create policy "Alunni leggono il proprio profilo classe"
on public.class_students for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Docenti o invitati aggiungono alunni" on public.class_students;
drop policy if exists "Docenti aggiungono alunni manualmente" on public.class_students;
create policy "Docenti aggiungono alunni manualmente"
on public.class_students for insert
to authenticated
with check (
  exists (
    select 1
    from public.teacher_classes c
    where c.id = class_students.class_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Docenti eliminano alunni delle proprie classi" on public.class_students;
create policy "Docenti eliminano alunni delle proprie classi"
on public.class_students for delete
to authenticated
using (
  exists (
    select 1
    from public.teacher_classes c
    where c.id = class_students.class_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Docenti leggono attività delle proprie classi" on public.class_activity;
create policy "Docenti leggono attività delle proprie classi"
on public.class_activity for select
to authenticated
using (
  exists (
    select 1
    from public.teacher_classes c
    where c.id = class_activity.class_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Alunni registrano attività della propria utenza" on public.class_activity;
create policy "Alunni registrano attività della propria utenza"
on public.class_activity for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.class_students s
    where s.id = class_activity.student_id
      and s.class_id = class_activity.class_id
      and (s.user_id = auth.uid() or s.user_id is null)
  )
);

create or replace function public.get_class_invite(invite_code_input text)
returns table (
  id uuid,
  name text,
  school_year text,
  invite_code text
)
language sql
stable
security definer
set search_path = public
as $$
  select c.id, c.name, c.school_year, c.invite_code
  from public.teacher_classes c
  where c.invite_code = upper(invite_code_input)
  limit 1;
$$;

grant execute on function public.get_class_invite(text) to anon, authenticated;

create or replace function public.join_class_invite(
  invite_code_input text,
  first_name_input text,
  last_name_input text,
  email_or_code_input text default null
)
returns table (
  id uuid,
  class_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_class_id uuid;
  existing_student_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Devi accedere con un account studente prima di entrare nella classe.';
  end if;

  select c.id
    into target_class_id
  from public.teacher_classes c
  where c.invite_code = upper(invite_code_input)
  limit 1;

  if target_class_id is null then
    raise exception 'Codice classe non valido.';
  end if;

  select s.id
    into existing_student_id
  from public.class_students s
  where s.class_id = target_class_id
    and s.user_id = auth.uid()
  limit 1;

  if existing_student_id is not null then
    return query
      select existing_student_id, target_class_id;
    return;
  end if;

  return query
    insert into public.class_students (
      class_id,
      user_id,
      first_name,
      last_name,
      email_or_code,
      joined_at
    )
    values (
      target_class_id,
      auth.uid(),
      first_name_input,
      last_name_input,
      email_or_code_input,
      now()
    )
    returning class_students.id, class_students.class_id;
end;
$$;

revoke all on function public.join_class_invite(text, text, text, text) from public;
revoke all on function public.join_class_invite(text, text, text, text) from anon;
grant execute on function public.join_class_invite(text, text, text, text) to authenticated;
