# 📡 PANDUAN PENGUJIAN JAUH (REMOTE TESTING GUIDE)
## APLIKASI MONITORING JARINGAN KANTOR (TENDA ROUTER)
**Kolaborasi Tim:** Surabaya (Pengembang Frontend) ⇄ Makassar (Lokasi Router Kantor Magang)  
**Kelompok 1:** Raffi Fadlika • Fatrah Aryadi Abduh • Andi Muh. Al Qaf Wiryawan Fahri  
**Tempat Magang:** PT Primus Indonesia & PT Anugrah Inti Spektra (Makassar)  

---

## 🎯 TUJUAN PENGUJIAN
Dokumen ini dibuat untuk memudahkan anggota tim yang berada di **Makassar** dalam menguji secara langsung aplikasi monitoring jaringan ini dengan **Router Tenda Kantor** riil, kemudian mengirimkan hasilnya ke tim pengembang di **Surabaya**.

---

## 🚀 METODE 1: TESTING LANGSUNG DI LAPTOP MAKASSAR (SUDAH AKTIF)

Laptop di Makassar saat ini telah terhubung ke Wi-Fi Router Tenda kantor:
- **SSID / DNS Suffix:** `www.tendawifi.com`
- **Default Gateway (IP Router):** `192.168.0.1`
- **IP Laptop Makassar:** `192.168.0.243`
- **MAC Router Tenda:** `b4:0f:3b:ef:25:60`

### **Langkah 1: Menjalankan Server Aplikasi**
Server pengujian Next.js telah dijalankan dan aktif di:
👉 **`http://localhost:3000`**

### **Langkah 2: Verifikasi Data Wi-Fi Riil Makassar**
1. Buka browser di laptop Makassar dan akses:
   👉 **`http://localhost:3000/api/tenda`**
2. **Hasil Sukses**: Browser akan mengembalikan JSON riil yang berisi:
   - `Router Tenda Utama (Makassar)` (IP 192.168.0.1, Ping ~7ms)
   - `Laptop Tim Penguji Makassar` (IP 192.168.0.243)
   - `PC / HP Staff Kantor Makassar` (IP 192.168.0.236)
3. Buka Dashboard Utama di:
   👉 **`http://localhost:3000`**
4. Di bagian banner atas, klik tombol **"Muat Data Riil Makassar"**.
5. Dashboard topologi dan seluruh grafik bandwidth akan langsung beralih memvisualisasikan perangkat kantor Makassar secara real-time!

---

## 🌐 METODE 2: MEMBAGIKAN AKSES AGAR TIM SURABAYA BISA MEMBUKA DARI INTERNET

Jika tim di **Surabaya** ingin membuka dashboard monitoring ini dari laptop mereka di Surabaya:

### **Opsi A: Menggunakan Cloudflare Tunnel (PALING DIREKOMENDASIKAN — Tanpa Password & Langsung Buka)**
Perintah yang sedang berjalan di laptop Makassar saat ini:
```bash
npx -y cloudflared tunnel --url http://localhost:3000
```
- Cloudflare akan langsung memberikan URL publik resmi berakhiran `.trycloudflare.com`.
- **Kelebihan:** Tim di Surabaya tinggal klik link tersebut dan dashboard **langsung terbuka** (tanpa perlu mengisi password IP, tanpa akun, dan koneksi HTTPS aman).

### **Opsi B: Menggunakan LocalTunnel**
```bash
npx -y localtunnel --port 3000
```
*(Catatan: Jika memakai LocalTunnel, saat pertama kali dibuka akan meminta Tunnel Password, yaitu IP Publik Makassar: `125.162.211.76`).*

### **Opsi C: Menggunakan Ngrok via NPX**
```bash
npx -y ngrok http 3000
```
*(Catatan: Memerlukan pendaftaran akun gratis di ngrok.com untuk authtoken).*

---

## 📸 CHECKLIST BUKTI PENGUJIAN UNTUK DOKUMEN LAPORAN MAGANG / SIDANG

Anggota tim di Makassar diharapkan melakukan tangkapan layar (screenshot) sebagai bukti pengerjaan:
- [x] Terhubung ke Router Tenda kantor Makassar (`192.168.0.1` / `www.tendawifi.com`).
- [ ] Buka dan screenshot respons JSON di browser: `http://localhost:3000/api/tenda`.
- [ ] Screenshot Dashboard Topologi `http://localhost:3000` saat tombol **"Muat Data Riil Makassar"** aktif.
- [ ] Jalankan tombol **TES DIAGNOSTIK** pada header dan screenshot hasil ping router & speedtest.
- [ ] Rekam video singkat interaksi dashboard saat mengaktifkan QoS / Limit Bandwidth pada perangkat.

---
*Dokumen ini diperbarui untuk Kelompok 1 - Perancangan Aplikasi Monitoring Jaringan Kantor Tempat Magang (Makassar ⇄ Surabaya).*
