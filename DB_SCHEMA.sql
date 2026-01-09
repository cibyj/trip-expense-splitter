
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  name text
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id),
  name text
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references trips(id),
  paid_by uuid references participants(id),
  amount numeric,
  description text,
  expense_date date default current_date
);
