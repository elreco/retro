alter table public.cards
  add column if not exists origin_column_id uuid references public.columns(id) on delete set null;

update public.cards
set origin_column_id = column_id
where origin_column_id is null;
