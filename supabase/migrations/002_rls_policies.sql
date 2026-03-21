-- supabase/migrations/002_rls_policies.sql

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;
alter table public.saves enable row level security;
alter table public.messages enable row level security;

create policy "Users are viewable by everyone" on public.users for select using (true);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);

create policy "Posts are viewable by everyone" on public.posts for select using (true);
create policy "Admins can create posts" on public.posts for insert
  with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
create policy "Admins can delete own posts" on public.posts for delete using (author_id = auth.uid());

create policy "Likes are viewable by everyone" on public.likes for select using (true);
create policy "Users can like posts" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike posts" on public.likes for delete using (auth.uid() = user_id);

create policy "Comments are viewable by everyone" on public.comments for select using (true);
create policy "Users can comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on public.comments for delete using (auth.uid() = user_id);

create policy "Follows are viewable by everyone" on public.follows for select using (true);
create policy "Users can follow" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on public.follows for delete using (auth.uid() = follower_id);

create policy "Users can see own saves" on public.saves for select using (auth.uid() = user_id);
create policy "Users can save posts" on public.saves for insert with check (auth.uid() = user_id);
create policy "Users can unsave posts" on public.saves for delete using (auth.uid() = user_id);

create policy "Users can read own messages" on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);
create policy "Recipients can mark messages read" on public.messages for update
  using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);
