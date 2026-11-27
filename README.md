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

## Fitur upload foto -> nilai terisi otomatis
Klik "Upload foto nilai" (semua baris), tombol kamera di baris, atau tombol kamera di kolom R/S/T.
Angka masuk ke Nilai akhir, satuan otomatis disesuaikan (mis. 3.69 GΩ -> 3690 MΩ). "Urungkan" membatalkan.

### Mode AI (disarankan, akurat untuk layar digital/7-segmen)
Mode dasar (Tesseract) TIDAK bisa membaca layar 7-segmen seperti megger. Pasang pembaca AI:
1. console.anthropic.com -> API Keys -> Create Key. Isi saldo (Billing) dan atur batas pengeluaran bulanan.
2. Supabase -> Edge Functions -> Secrets -> tambah `ANTHROPIC_API_KEY` = key tadi.
3. Supabase -> Edge Functions -> Deploy a new function -> Via Editor -> nama `baca-foto`.
   Tempel isi `supabase/functions/baca-foto/index.ts` -> Deploy.
   Di pengaturan function, matikan "Verify JWT" (agar bisa dipanggil dari halaman web).
4. Pastikan `ocrUrl` di `config.js` terisi, lalu unggah `index.html` dan `config.js` ke GitHub.

Catatan biaya/keamanan: tiap foto = 1 panggilan AI berbayar (sekitar beberapa sen dolar). Siapa pun yang tahu
alamat halaman bisa memicu panggilan itu. Atur batas pengeluaran di console.anthropic.com dan tambahkan login bila perlu.
Foto dikirim ke Anthropic untuk dibaca, tidak disimpan oleh dashboard ini.

Tanpa `ocrUrl`, dashboard memakai Tesseract.js di browser (gratis, tetapi tidak andal untuk layar alat digital).
