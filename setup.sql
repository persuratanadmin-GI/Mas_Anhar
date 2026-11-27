-- Jalankan di Supabase: SQL Editor -> New query -> Run
create table if not exists pms_hasil_uji (
  id text primary key,
  data jsonb not null,
  updated bigint not null default 0
);
alter table pms_hasil_uji enable row level security;

-- PERHATIAN: kebijakan ini mengizinkan SIAPA PUN yang memegang link + anon key
-- untuk membaca dan menulis. Cocok untuk uji coba. Untuk data kerja, gunakan
-- login (Supabase Auth) dan ganti "anon" menjadi "authenticated".
create policy "baca"   on pms_hasil_uji for select to anon using (true);
create policy "tambah" on pms_hasil_uji for insert to anon with check (true);
create policy "ubah"   on pms_hasil_uji for update to anon using (true) with check (true);
create policy "hapus"  on pms_hasil_uji for delete to anon using (true);
