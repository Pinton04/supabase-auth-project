-- Create 'profiles' table linked to Supabase Auth Users
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);
