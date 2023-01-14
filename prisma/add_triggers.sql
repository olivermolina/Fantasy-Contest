-- inserts a row into public."User"
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public."User" (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- update a row in public."User" when the email is updated
create or replace function public.handle_updated_user()
returns trigger as $$
begin
  update public."User"
  set email = new.email
  where id = new.id::text;
  return new;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is updated
drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.handle_updated_user();


-- delete a row from public."User" when the user is deleted
create or replace function public.handle_deleted_user()
returns trigger as $$
begin
  delete from public."User" where id = old.id::text;
  return old;
end;
$$ language plpgsql security definer;

-- trigger the function every time a user is deleted
drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_deleted_user();