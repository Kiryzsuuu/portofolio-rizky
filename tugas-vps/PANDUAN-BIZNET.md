# Panduan Biznet Gio Cloud — VM Ubuntu + Apache + PHP + Firewall + Personal Page

Provider lokal Indonesia. Bayar pakai Rupiah, server di Indonesia.
Langkah di dalam server (Bagian 2 & 3) sama dengan panduan lain.

> Catatan: Biznet Gio punya beberapa produk. Untuk tugas ini paling cocok
> **NEO Lite** (VPS murah) atau **NEO Virtual Compute**. Nama menu bisa
> sedikit berbeda tergantung versi portal, tapi alurnya sama.

---

## BAGIAN 1 — Membuat VM + Ubuntu (30%)

### 1.1 Daftar & aktivasi akun
1. Buka https://www.biznetgio.com → **Sign Up / Daftar**.
2. Verifikasi email & nomor HP.
3. **Top up saldo / deposit** lewat metode lokal (Transfer Bank / Virtual Account /
   e-wallet). Untuk NEO Lite biaya sangat murah (mulai puluhan ribu/bulan).
   - Cek apakah ada promo/free trial yang sedang berjalan.

### 1.2 Buat VM
1. Login ke **Portal Biznet Gio** (portal.biznetgio.com).
2. Pilih produk **NEO Lite** (atau NEO Virtual Compute) → **Create / Deploy New**.
3. Konfigurasi:
   - **Location / Region:** pilih lokasi Indonesia (mis. Jakarta / Cibitung).
   - **OS / Image:** pilih **Ubuntu 22.04 LTS** (64-bit).
   - **Spec / Plan:** pilih paket terkecil (1-2 vCPU, 1-2 GB RAM sudah cukup
     untuk Apache + PHP).
   - **Storage:** default (20-40 GB).
   - **Hostname:** `tugas-vps` (bebas).
4. **Autentikasi / Password:**
   - Set **root password** (catat baik-baik), ATAU
   - Upload **SSH Key** kalau diminta.
5. Klik **Create / Deploy** → tunggu status **Active / Running** (1-3 menit).

### 1.3 Catat Public IP
Setelah VM aktif, di detail VM akan ada **Public IP Address**.
Contoh: `103.xxx.xxx.xxx`. Catat.

### 1.4 Konfigurasi Firewall portal (lapis 1)
Biznet Gio biasanya punya **Security Group / Firewall** di portal.
Buka pengaturan firewall VM → tambahkan rule **Inbound/Allow**:
| Port | Protocol | Source     | Keterangan |
|------|----------|------------|------------|
| 22   | TCP      | 0.0.0.0/0  | SSH        |
| 80   | TCP      | 0.0.0.0/0  | HTTP       |
| 443  | TCP      | 0.0.0.0/0  | HTTPS      |

> Kalau portal tidak punya firewall terpisah (langsung terbuka), Anda cukup
> mengandalkan UFW di dalam VM (Bagian 2.4).

### 1.5 Login via SSH
Dari komputer Anda (PowerShell / Git Bash):
```bash
ssh root@<PUBLIC_IP>
# contoh: ssh root@103.150.10.20
```
Ketik `yes` lalu masukkan password root.

> Kalau pakai SSH key:
> `ssh -i namakey.pem root@<PUBLIC_IP>`

✅ **Bagian 1 selesai.**

---

## BAGIAN 2 — Apache + PHP + Firewall (50%)

Jalankan di dalam SSH server.

### 2.1 Update sistem
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Apache
```bash
sudo apt install apache2 -y
sudo systemctl enable apache2
sudo systemctl status apache2     # harus "active (running)"
```
Test: buka `http://<PUBLIC_IP>` → muncul "Apache2 Ubuntu Default Page".

### 2.3 Install PHP
```bash
sudo apt install php libapache2-mod-php php-cli php-mysql -y
sudo systemctl restart apache2
php -v
```
Test PHP:
```bash
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
```
Buka `http://<PUBLIC_IP>/info.php` → muncul tabel PHP. Lalu hapus:
```bash
sudo rm /var/www/html/info.php
```

### 2.4 Konfigurasi Firewall UFW (lapis 2 — di dalam VM)
```bash
sudo ufw allow OpenSSH          # WAJIB dulu, biar tidak terkunci dari SSH
sudo ufw allow 'Apache Full'    # port 80 + 443
sudo ufw enable                 # ketik 'y'
sudo ufw status verbose
```

> 💡 Untuk laporan: ada **2 lapis firewall** — Firewall/Security Group di
> portal Biznet Gio (level cloud) + UFW (level OS Ubuntu). Keduanya harus
> mengizinkan port 22/80/443.

✅ **Bagian 2 selesai.**

---

## BAGIAN 3 — Personal Page (20%)

File contoh ada di folder ini: `index.html`.

**Upload via SCP (dari komputer Anda):**
```bash
scp index.html root@<PUBLIC_IP>:/var/www/html/index.html
```

**Atau edit langsung di server:**
```bash
sudo nano /var/www/html/index.html
# tempel isi, simpan: Ctrl+O, Enter, Ctrl+X
```

Set kepemilikan:
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

Buka `http://<PUBLIC_IP>` → halaman personal tampil. 🎉

---

## Checklist laporan / screenshot

- [ ] Screenshot VM status "Active/Running" di portal Biznet Gio
- [ ] Screenshot pengaturan firewall portal (port 22/80/443) — jika ada
- [ ] Screenshot terminal `ssh root@IP` berhasil
- [ ] Screenshot `systemctl status apache2` = active
- [ ] Screenshot `php -v`
- [ ] Screenshot `sudo ufw status verbose`
- [ ] Screenshot halaman personal di browser (URL `http://<IP>` terlihat)

---

## Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Browser timeout di :80 | port 80 belum dibuka di firewall portal | Buka rule HTTP/80 di portal |
| Akses ditolak walau Apache running | UFW memblokir | `sudo ufw allow 'Apache Full'` |
| `.php` ter-download | modul PHP belum aktif | `sudo apt install libapache2-mod-php`; restart apache2 |
| Terkunci setelah `ufw enable` | lupa allow OpenSSH | Pakai console/VNC di portal → `sudo ufw allow OpenSSH` |
| Tak bisa SSH | password salah / port 22 tertutup | Reset password di portal; cek firewall port 22 |
