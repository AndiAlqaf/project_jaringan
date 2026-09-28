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

### **PENA NGAN ERROR "503 - Tunnel Unavailable" (Localtunnel / loca.lt)**
Jika muncul error **503 - Tunnel Unavailable** saat mengakses URL `loca.lt`:
1. **Penyebab**: Server `npm run dev` di laptop Makassar terhenti / mati, atau koneksi localtunnel terputus.
2. **Solusi 1 (Localtunnel Bypass)**:
   - Pastikan di laptop Makassar `npm run dev` di port 3000 **masih aktif berjalan**.
   - Buka terminal baru di Makassar dan jalankan:
     ```bash
     npx localtunnel --port 3000
     ```
   - Catat IP Publik laptop Makassar (bisa dicek di [ipv4.icanhazip.com](https://ipv4.icanhazip.com)).
   - Saat membuka URL `loca.lt` di Surabaya pertama kali, masukkan IP Publik tersebut jika diminta untuk membuka akses tunnel.

3. **Solusi 2 (ALTERNATIF PALING STABIL TANPA ERROR 503: Cloudflare / Ngrok)**:
   - **Pakai Cloudflare Tunnel (Tanpa Login / Tanpa Akun)**:
     Di terminal laptop Makassar, ketik:
     ```bash
     npx cloudflared tunnel --url http://localhost:3000
     ```
     *(Akan menghasilkan URL HTTPS gratis yang 100% stabil tanpa error 503).*

   - **Pakai Ngrok**:
     ```bash
     npx ngrok http 3000
     ```

---

## 📸 CHECKLIST BUKTI PENGUJIAN UNTUK DOKUMEN LAPORAN MAGANG / SIDANG

Anggota tim di Makassar diharapkan melakukan tangkapan layar (screenshot) sebagai bukti pengerjaan:
- [ ] Screenshot halaman `http://localhost:3000/api/tenda` yang berisi JSON perangkat Wi-Fi kantor.
- [ ] Screenshot Dashboard Topologi `http://localhost:3000` yang menampilkan nama-nama perangkat kantor Makassar.
- [ ] Screenshot hasil **Tes Diagnostik** & **Speedtest Latensi**.
- [ ] Video rekaman singkat layar (layar bergerak saat perangkat HP terhubung/terputus dari Wi-Fi kantor).

---
*Dokumen ini dibuat secara otomatis untuk Kelompok 1 - Perancangan Aplikasi Monitoring Jaringan Kantor Magang.*
