-- Conversations table
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  type text default 'direct' -- 'direct' or 'group'
);

-- Conversation participants
create table public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid not null,
  user_role text not null
);

-- Messages table (linked to conversations)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid not null,
  sender_role text not null,
  content text not null,
  timestamp timestamptz not null default now(),
  read boolean not null default false
);

create index messages_conversation_id_idx on public.messages (conversation_id);

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
