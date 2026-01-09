-- Run in Supabase SQL Editor

alter table expenses
add column if not exists description text,
add column if not exists expense_date date default current_date;
