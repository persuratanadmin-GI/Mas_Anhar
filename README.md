# Dashboard Hasil Uji PMS

## 1. Siapkan database (Supabase, gratis)
1. Daftar di https://supabase.com lalu buat project baru.
2. Buka **SQL Editor**, tempel isi `setup.sql`, klik **Run**.
3. Buka **Project Settings -> API**. Salin **Project URL** dan **anon public key**.
4. Tempel keduanya ke `config.js`.

## 2. Tayangkan di GitHub Pages
1. Buat repositori baru di GitHub.
2. Unggah `index.html` dan `config.js` (Add file -> Upload files).
3. Settings -> Pages -> Source: "Deploy from a branch", Branch: `main`, folder `/ (root)` -> Save.
4. Tunggu sekitar 1 menit. Alamatnya: https://NAMA-ANDA.github.io/NAMA-REPO/

## Catatan keamanan
- Repositori GitHub Pages gratis bersifat publik, begitu pula isi `config.js`.
  Anon key memang dirancang untuk terlihat publik, tetapi keamanan data
  ditentukan oleh kebijakan (policy) di `setup.sql`.
- Kebijakan bawaan terbuka untuk siapa pun yang tahu alamat halaman.
  Untuk data kerja sebenarnya, tambahkan login (Supabase Auth).
- Tanpa isi `config.js`, aplikasi berjalan lokal: data hanya di browser itu.
