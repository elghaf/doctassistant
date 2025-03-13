-- Drop the table if it exists
drop table if exists patients cascade;

-- Create the table with the correct structure
create table patients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  email text not null,
  role text not null check (role in ('patient', 'doctor')),
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table patients enable row level security;

-- Create policies
create policy "Users can view their own patient data"
  on patients for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on patients for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on patients for insert
  with check (auth.uid() = user_id);
