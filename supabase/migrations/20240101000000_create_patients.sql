-- Create patients table
create table if not exists public.patients (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    full_name text not null,
    email text not null,
    role text not null check (role in ('patient', 'doctor')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.patients enable row level security;

-- Create policies
create policy "Enable insert for authenticated users only"
    on public.patients
    for insert
    with check (auth.uid() = user_id);

create policy "Enable select for users based on user_id"
    on public.patients
    for select
    using (auth.uid() = user_id);