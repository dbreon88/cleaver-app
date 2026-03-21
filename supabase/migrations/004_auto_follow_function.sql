-- supabase/migrations/004_auto_follow_function.sql

create or replace function public.handle_new_user_follows()
returns trigger as $$
begin
  insert into public.follows (follower_id, following_id)
  select NEW.id, id from public.users where role = 'admin' and id != NEW.id
  on conflict do nothing;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_user_created
  after insert on public.users
  for each row
  when (NEW.role = 'user')
  execute function public.handle_new_user_follows();
