# Ardi Pranata — Pricelist 2026
Website responsif siap GitHub Pages. Booking hanya melalui WhatsApp **089506801472**. Tidak memerlukan backend, API, akun layanan tambahan, atau konfigurasi kalender.

## Fitur
- 16 paket dengan harga dan isi sesuai referensi.
- Burgundy, cream, dan antique gold.
- Batas kerja: Wedding 10 jam; Lamaran, Aqiqah, Ulang Tahun 6 jam; Prewedding 4 jam. Durasi Wisuda dikonfirmasi admin.
- DP minimum Wedding 40%, semua paket lainnya 50%.
- Harga, DP minimum, dan sisa pembayaran dihitung otomatis.
- Tombol kartu paket otomatis mengisi kategori dan paket pada formulir.
- Tanggal dan jam acara mengikuti WIB. Waktu yang sudah lewat ditolak.
- Formulir membuka WhatsApp dengan detail lengkap; klien tetap menekan Kirim di WhatsApp.
- Jika tab WhatsApp diblokir browser, tautan alternatif tampil di bawah tombol.

## Alur booking
1. Klien memilih paket, tanggal, jam, lokasi, dan mengisi identitas.
2. Klien menyetujui ketentuan lalu menekan **Lanjutkan ke WhatsApp**.
3. WhatsApp terbuka dengan pesan yang siap dikirim.
4. Admin mengonfirmasi ketersediaan tanggal serta pembayaran DP melalui WhatsApp.

Website **tidak menampilkan atau memblokir jadwal terbooking secara otomatis**. Tanggal yang dipilih hanya pengajuan, bukan jaminan ketersediaan. Tidak ada penyimpanan booking, verifikasi pembayaran otomatis, atau pengiriman pesan tanpa tindakan klien.

## Upload ke GitHub
1. Ekstrak ZIP. Unggah **seluruh isi** folder proyek ke root repository, termasuk folder tersembunyi `.github`. Jangan hanya mengunggah ZIP.
2. Gunakan branch `main`.
3. Settings → Pages → Source: **GitHub Actions**.
4. Workflow `Deploy pricelist to GitHub Pages` menguji dan memublikasikan website.
5. Lihat alamat website di Settings → Pages, umumnya `https://USERNAME.github.io/NAMA-REPOSITORY/`.
6. Pembaruan berikutnya cukup commit ke `main`.

Alternatif: Settings → Pages → Deploy from a branch → main / root. Website ini tidak membutuhkan build.

## Pengaturan
- `config.js`: nomor WhatsApp dalam format internasional tanpa +, sudah terisi `6289506801472`.
- `packages.js`: seluruh data paket, nominal DP, durasi, format pesan, dan validasi booking.
- `index.html`, `styles.css`, `app.js`: struktur, desain, dan interaksi website.

## Jalankan dan uji lokal
Gunakan Node.js 22 atau lebih baru:
```sh
npm start
npm test
```
Buka http://127.0.0.1:4173. Gunakan server HTTP, bukan membuka HTML melalui file://, karena website menggunakan JavaScript modules.

## Pemeriksaan sebelum digunakan
Coba Wedding Paket 3: harga Rp4.000.000, DP 40% Rp1.600.000, sisa Rp2.400.000, durasi maksimal 10 jam.
Coba Lamaran Paket 1: harga Rp850.000, DP 50% Rp425.000, durasi maksimal 6 jam.
Pastikan pengajuan membuka nomor WhatsApp bisnis yang benar, dan tanggal/jam yang sudah lewat ditolak.

