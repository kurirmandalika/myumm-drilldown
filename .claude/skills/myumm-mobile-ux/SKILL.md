---
name: myumm-mobile-ux
description: Panduan UX dan UI untuk membangun layar aplikasi mobile myUMM Student (Expo/React Native). Gunakan setiap kali membuat atau mengubah layar, komponen, navigasi, atau teks antarmuka di project ini.
---

# Panduan UX Mobile — myUMM Student

Panduan ini menerjemahkan kebutuhan UX hasil riset (Worksheet 8, UXR-01 s.d. UXR-08) menjadi aturan desain yang konkret. Ikuti aturan ini setiap kali membangun layar. Bila PRD dan panduan ini bertentangan, **PRD yang menang** untuk *apa* yang dibangun, dan panduan ini menentukan *bagaimana* tampilannya.

## 1. Prinsip utama

1. **Tampilan harus jujur (UXR-03).** Elemen yang bisa ditekan harus terlihat bisa ditekan. Elemen yang hanya informasi tidak boleh terlihat seperti tombol. Ini akar masalah riset: kartu yang terlihat interaktif tetapi statis.
2. **Setiap ketukan dibalas (UXR-02).** Tidak boleh ada ketukan yang "diam".
3. **Tidak ada jalan buntu (UXR-06).** Setiap layar punya jalan keluar dan langkah lanjutan.
4. **Jawaban dalam sedikit langkah (UXR-01, 05).** Informasi utama dicapai dalam 1–2 ketukan.

## 2. Signifier untuk elemen interaktif

- Kartu atau baris yang bisa dibuka **wajib** memiliki ikon chevron "›" di sisi kanan. Kartu ringkasan di Dashboard juga menampilkan teks kecil "Lihat rincian".
- Gunakan `Pressable` dengan style `pressed` yang terlihat jelas: opacity 0.7 atau background lebih gelap, plus `android_ripple` di Android.
- Kartu interaktif: sudut membulat 12, elevasi/bayangan tipis, border 1px.
- Kartu statis (informasi saja): **tanpa** chevron, **tanpa** bayangan, background datar. Jangan bungkus dengan `Pressable`.
- Area sentuh minimal 44×44 pt. Gunakan `hitSlop` bila elemen visualnya kecil.

## 3. Umpan balik dan status sistem

- Umpan balik visual tekan muncul seketika (≤ 100 ms). Jangan menunggu data dimuat.
- Bila pemuatan > 1 detik: tampilkan **skeleton** yang menyerupai bentuk konten (lebih baik dari spinner kosong).
- Cegah navigasi ganda: abaikan ketukan kedua selama navigasi atau pemuatan sedang berjalan.
- Tab aktif dan item terpilih harus jelas: warna + garis bawah/indikator + teks tebal.

## 4. State kosong dan gagal

Setiap list dan layar data wajib menangani 3 kondisi selain sukses:

| Kondisi | Isi wajib |
|---|---|
| Loading | Skeleton |
| Kosong | Judul singkat, 1 kalimat penjelasan, 1 tombol aksi lanjutan |
| Gagal | Penyebab singkat dalam bahasa awam, tombol **"Coba lagi"** |

Contoh teks:
- Kosong (Belum Lulus): **"Tidak ada mata kuliah yang belum lulus"**, "Semua mata kuliah yang pernah kamu ambil sudah lulus." Tombol: "Lihat Riwayat Studi".
- Gagal: **"Data belum bisa dimuat"**, "Periksa koneksi internet kamu, lalu coba lagi." Tombol: "Coba lagi".

Jangan tampilkan kode error teknis ke pengguna.

## 5. Struktur informasi daftar mata kuliah

Urutan informasi dalam satu item (dari paling penting):
1. **Nama mata kuliah** (teks tebal, 16)
2. Kode · SKS · Semester (teks sekunder, 13)
3. Label di kanan: **"Wajib"** (badge), nilai bila ada
4. Chevron "›"

- Urutkan default: mata kuliah wajib dulu, lalu semester terkecil.
- Tampilkan jumlah item di setiap tab, misalnya "Belum Lulus (3)". Angkanya harus sama dengan kartu Dashboard.
- Di atas list tampilkan ringkasan tab aktif, misalnya "3 mata kuliah · 9 SKS".

## 5a. Kegiatan prodi: kesegaran data, tanggal, dan pengingat

**Kesegaran data**
- Setiap layar yang menampilkan kegiatan wajib menampilkan **"Diperbarui [waktu relatif]"** di bawah judul bagian ("Diperbarui baru saja", "Diperbarui 5 menit lalu", "Diperbarui kemarin, 14.20").
- Saat tarik untuk muat ulang, tampilkan indikator refresh bawaan platform. Setelah selesai, perbarui keterangan waktu dan tampilkan toast singkat: "1 kegiatan baru" atau "Sudah yang terbaru".
- Bila memakai data tersimpan karena gagal memuat, tampilkan **banner kuning** di atas list: "Menampilkan data terakhir (diperbarui [waktu]). **Coba lagi**". Jangan sembunyikan data lama hanya karena gagal memuat.

**Tanggal dan waktu**
- Format: "Sen, 24 Nov 2026 · 09.00 WIB". Pakai titik untuk jam (09.00), bukan titik dua.
- Di kartu list, tampilkan **blok tanggal** di kiri (angka tanggal besar + nama bulan singkat) supaya mudah dipindai.
- Label waktu relatif sebagai badge: **"Hari ini"** (primer), **"Besok"**, **"Baru"** (biru). Maksimal 1 badge waktu + 1 badge "Baru" per kartu.
- Kelompokkan list per periode dengan header: "Minggu ini", "Minggu depan", "Bulan ini", "Nanti".

**Pengingat**
- Tombol utama di detail: **"Ingatkan saya"** dengan ikon lonceng. Setelah aktif, tombol berubah jadi **"Pengingat aktif · Ubah"** dengan gaya sekunder, supaya statusnya jelas.
- Pilihan waktu pengingat memakai **bottom sheet** dengan radio, bukan dropdown.
- Setelah menyimpan, selalu konfirmasi dengan kalimat yang menyebut **apa dan kapan**: "Kamu akan diingatkan 1 hari sebelum Seminar UX, Sen, 24 Nov 2026."
- Menghapus pengingat tidak perlu dialog konfirmasi. Cukup toast "Pengingat dihapus" dengan aksi **"Batalkan"** selama ±4 detik.
- Kegiatan yang sudah diberi pengingat menampilkan ikon lonceng terisi di list.

**Contoh teks state**
- Kosong (Akan Datang): **"Belum ada kegiatan terjadwal"**, "Kegiatan baru dari prodi akan muncul di sini." Tombol: "Lihat kegiatan selesai".
- Kosong (Kegiatan Saya): **"Belum ada pengingat"**, "Tekan Ingatkan saya di halaman kegiatan agar tidak terlewat." Tombol: "Jelajahi kegiatan".
- Gagal: **"Kegiatan belum bisa dimuat"**, "Periksa koneksi internet kamu, lalu coba lagi." Tombol: "Coba lagi".

## 6. Warna dan status

Status **tidak boleh** dibedakan hanya lewat warna. Selalu sertakan teks/label.

| Peran | Warna | Catatan |
|---|---|---|
| Primer (UMM) | `#8B0000` merah marun | Tombol utama, tab aktif, header |
| Lulus | `#1E7B4F` hijau | Selalu dengan teks "Lulus" |
| Belum Lulus | `#B42318` merah | Selalu dengan teks "Belum Lulus" |
| Sedang Ditempuh | `#1D5FAF` biru | Selalu dengan teks "Sedang Ditempuh" |
| Teks utama | `#1A1A1A` | |
| Teks sekunder | `#5F6368` | |
| Latar | `#F6F6F8`, kartu `#FFFFFF` | |

Kontras teks terhadap latar minimal WCAG AA (4.5:1 untuk teks normal).

## 7. Tipografi dan jarak

- Skala: 24 (judul layar), 18 (judul bagian), 16 (isi utama), 13 (sekunder), 12 (label/badge).
- Jarak dengan kelipatan 4: 4, 8, 12, 16, 24. Padding layar 16.
- Jangan lebih dari 2 tingkat ketebalan font per layar.

## 8. Navigasi

- Navigasi bawah: **Beranda**, **Riwayat Studi**, **Profil**. Selalu terlihat di layar utama.
- Layar turunan (Daftar, Detail) memakai app bar dengan tombol kembali dan judul yang menyebutkan konteks, misalnya "Mata Kuliah".
- Gesture kembali sistem (Android back / swipe iOS) harus berfungsi.

## 9. Istilah (wajib konsisten)

| Pakai | Jangan pakai |
|---|---|
| Lulus | Selesai, Passed |
| Belum Lulus | Gagal, Tidak lulus, Mengulang |
| Sedang Ditempuh | Aktif, Berjalan, On going |
| Riwayat Studi | Transkrip, KHS, History |
| Lihat rincian | Detail, Selengkapnya, More |
| Coba lagi | Retry, Ulangi, Refresh |
| Jadwal Kegiatan Prodi | Agenda, Event, Acara |
| Kegiatan Saya | Kegiatanku, My Events, Tersimpan |
| Ingatkan saya | Remind me, Notifikasi, Alarm |
| Simpan pengingat | Simpan, OK, Set |
| Akan Datang / Selesai | Upcoming / Past, Mendatang / Lampau |
| Diperbarui [waktu] | Last updated, Update terakhir |

Sapa pengguna dengan "kamu". Kalimat pendek, tanpa jargon teknis.

## 10. Aksesibilitas

- Setiap `Pressable` punya `accessibilityRole="button"` dan `accessibilityLabel` yang bermakna, misalnya "Belum Lulus, 3 mata kuliah, lihat rincian".
- Badge status punya label teks, bukan hanya ikon/warna.
- Ukuran teks mengikuti pengaturan sistem (jangan mematikan `allowFontScaling`).

## 11. Checklist sebelum commit

- [ ] Semua elemen yang bisa ditekan punya signifier dan efek tekan
- [ ] Tidak ada elemen statis yang terlihat seperti tombol
- [ ] Layar data menangani loading, kosong, dan gagal
- [ ] Istilah sesuai tabel §9
- [ ] Status tidak hanya dibedakan warna
- [ ] Area sentuh ≥ 44×44 pt
- [ ] Layar kegiatan menampilkan "Diperbarui [waktu]" dan data lama tetap tampil saat gagal memuat
- [ ] Konfirmasi pengingat menyebut apa dan kapan
- [ ] `CHANGELOG.md` diperbarui