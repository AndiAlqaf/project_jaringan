# 📡 PANDUAN PENGUJIAN JAUH (REMOTE TESTING GUIDE)
## APLIKASI MONITORING JARINGAN KANTOR (TENDA ROUTER)
**Kolaborasi Tim:** Surabaya (Pengembang Frontend) ⇄ Makassar (Lokasi Router Kantor Magang)  
**Kelompok 1:** Raffi Fadlika • Fatrah Aryadi Abduh • Andi Muh. Al Qaf Wiryawan Fahri  
**Tempat Magang:** PT Primus Indonesia & PT Anugrah Inti Spektra (Makassar)  

---

## 🎯 TUJUAN PENGUJIAN
Dokumen ini dibuat untuk memudahkan anggota tim yang berada di **Makassar** dalam menguji secara langsung aplikasi monitoring jaringan ini dengan **Router Tenda Kantor** riil, kemudian mengirimkan hasilnya ke tim pengembang di **Surabaya**.

---

## 🚀 METODE 1: TESTING LANGSUNG DI MAKASSAR (SANGAT DIREKOMENDASIKAN)

Anggota tim di Makassar cukup menjalankan proyek ini di laptopnya sendiri saat terhubung ke Wi-Fi/LAN kantor.

### **Langkah 1: Persiapan File Proyek di Laptop Makassar**
1. Terima folder proyek `project_jaringan` dari tim Surabaya (via GitHub / Google Drive / ZIP).
2. Buka folder `project_jaringan` menggunakan **VS Code** atau Terminal/Command Prompt di laptop Makassar.

### **Langkah 2: Install & Jalankan Aplikasi**
1. Buka Terminal di VS Code, lalu ketik:
   ```bash
   npm install
   ```
2. Setelah selesai install, jalankan server pengujian:
   ```bash
   npm run dev
   ```
3. Aplikasi akan aktif di alamat: `http://localhost:3000`

### **Langkah 3: Menghubungkan ke Wi-Fi / LAN Router Tenda Kantor**
1. Pastikan Laptop di Makassar terhubung ke **Wi-Fi atau Kabel LAN Router Tenda** kantor magang.
2. Buka Command Prompt (CMD) di laptop Makassar, ketik:
   ```cmd
   ipconfig
   ```
3. Catat alamat **Default Gateway** (biasanya `192.168.0.1` atau `192.168.1.1`).
4. Jika IP Router Tenda di kantor adalah `192.168.0.1`, tidak perlu ubah apa-apa.
   *(Jika IP Router Tenda beda, misal `192.168.1.1`, buka file `src/app/api/tenda/route.ts` line 10 dan ubah IP-nya).*

### **Langkah 4: Verifikasi Data Wi-Fi Riil Makassar**
1. Buka browser di laptop Makassar dan akses:
   👉 **`http://localhost:3000/api/tenda`**
2. **Hasil Sukses**: Browser akan menampilkan daftar perangkat HP, Laptop, & PC pegawai di kantor Makassar yang sedang aktif terhubung ke router Tenda!
3. Buka halaman utama:
   👉 **`http://localhost:3000`**
4. Tampilan dashboard **NETPULSE MAXIMALIST** akan secara otomatis memvisualisasikan perangkat Wi-Fi riil kantor Makassar pada topologi interaktif!

---

## 🌐 METODE 2: MENINGKATKAN KONEKSI AGAR TIM SURABAYA BISA AKSES ROUTER MAKASSAR (DENGAN NGROK / TAILSCALE)

Jika tim di **Surabaya** ingin bisa mengakses data Router Tenda di Makassar secara langsung dari jarak jauh lewat internet:

### **Opsi A: Menggunakan Ngrok (Tanpa Setting Router)**
1. Anggota tim di Makassar menginstall **Ngrok** (gratis di [ngrok.com](https://ngrok.com)).
2. Di laptop Makassar (saat `npm run dev` aktif), ketik di terminal:
   ```bash
   ngrok http 3000
   ```
3. Ngrok akan memberikan URL Publik (Contoh: `https://abcd-123.ngrok-free.app`).
4. Anggota tim di Makassar mengirimkan URL tersebut ke tim di **Surabaya**.
5. Tim di Surabaya dapat membuka URL Ngrok tersebut di browser Surabaya dan melihat monitoring Wi-Fi kantor Makassar secara **Real-time dari jarak jauh**!

### **Opsi B: Menggunakan Tailscale / Mesh Network**
1. Anggota tim Surabaya & Makassar menginstall aplikasi gratis **Tailscale** di laptop masing-masing.
2. Kedua laptop dihubungkan dalam satu jaringan virtual private Tailscale.
3. Tim di Surabaya bisa mengakses `http://[IP-Tailscale-Makassar]:3000` kapan saja!

---

## 📸 CHECKLIST BUKTI PENGUJIAN UNTUK DOKUMEN LAPORAN MAGANG / SIDANG

Anggota tim di Makassar diharapkan melakukan tangkapan layar (screenshot) sebagai bukti pengerjaan:
- [ ] Screenshot halaman `http://localhost:3000/api/tenda` yang berisi JSON perangkat Wi-Fi kantor.
- [ ] Screenshot Dashboard Topologi `http://localhost:3000` yang menampilkan nama-nama perangkat kantor Makassar.
- [ ] Screenshot hasil **Tes Diagnostik** & **Speedtest Latensi**.
- [ ] Video rekaman singkat layar (layar bergerak saat perangkat HP terhubung/terputus dari Wi-Fi kantor).

---
*Dokumen ini dibuat secara otomatis untuk Kelompok 1 - Perancangan Aplikasi Monitoring Jaringan Kantor Magang.*
