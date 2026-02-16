-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS Table (Links to auth.users)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  image text,
  plan text default 'FREE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Users policies
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- QUIZZES Table
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  published boolean default false not null,
  author_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on quizzes
alter table public.quizzes enable row level security;

-- Quizzes policies
create policy "Quizzes viewable by author" on public.quizzes
  for select using (auth.uid() = author_id);

create policy "Users can insert their own quizzes." on public.quizzes
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own quizzes." on public.quizzes
  for update using (auth.uid() = author_id);
  
create policy "Users can delete their own quizzes." on public.quizzes
  for delete using (auth.uid() = author_id);


-- QUESTIONS Table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null
);

-- Enable RLS on questions
alter table public.questions enable row level security;

-- Questions policies (inherits simplified access for now, ideally strictly controlled via quiz author)
create policy "Questions viewable by author" on public.questions for select using (
    exists ( select 1 from public.quizzes where id = quiz_id and author_id = auth.uid() )
);
create policy "Authored questions insert" on public.questions for insert with check (
    exists ( select 1 from public.quizzes where id = quiz_id and author_id = auth.uid() )
);
create policy "Authored questions update" on public.questions for update using (
    exists ( select 1 from public.quizzes where id = quiz_id and author_id = auth.uid() )
);
create policy "Authored questions delete" on public.questions for delete using (
    exists ( select 1 from public.quizzes where id = quiz_id and author_id = auth.uid() )
);

-- CHOICES Table
create table public.choices (
  id uuid default uuid_generate_v4() primary key,
  text text not null,
  is_correct boolean default false not null,
  question_id uuid references public.questions(id) on delete cascade not null
);

-- Enable RLS on choices
alter table public.choices enable row level security;

-- Choices policies
create policy "Choices viewable by author" on public.choices for select using (
    exists ( 
        select 1 from public.questions q
        join public.quizzes z on q.quiz_id = z.id
        where q.id = question_id and z.author_id = auth.uid()
    )
);
create policy "Authored choices insert" on public.choices for insert with check (
    exists ( 
        select 1 from public.questions q
        join public.quizzes z on q.quiz_id = z.id
        where q.id = question_id and z.author_id = auth.uid()
    )
);
create policy "Authored choices update" on public.choices for update using (
    exists ( 
        select 1 from public.questions q
        join public.quizzes z on q.quiz_id = z.id
        where q.id = question_id and z.author_id = auth.uid()
    )
);
create policy "Authored choices delete" on public.choices for delete using (
    exists ( 
        select 1 from public.questions q
        join public.quizzes z on q.quiz_id = z.id
        where q.id = question_id and z.author_id = auth.uid()
    )
);

-- Trigger to handle new user signup automatically
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, name, image)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'image');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
