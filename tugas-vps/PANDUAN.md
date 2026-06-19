# Panduan Tugas: VPS Ubuntu + Apache + PHP + Firewall + Personal Page

Panduan langkah demi langkah dari nol sampai halaman personal tampil di browser.

---

## BAGIAN 1 — Membuat VM + Instalasi Ubuntu (30%)

### 1.1 Buat instance di Alibaba Cloud
1. Di halaman trial, pastikan pilihan:
   - **Instance:** `2 cores (vCPU) 4 GiB - Economy Type e` (paling hemat kredit)
   - **Region:** Indonesia (Jakarta)
   - **OS:** **Ubuntu 22.04 64-bit**
   - **Pre-installed applications:** KOSONGKAN (jangan BT-Panel/WordPress/LNMP).
     Tugas menilai instalasi manual, jadi semua diinstall sendiri.
2. Centang Terms of Service → klik **Start free trial**.
3. Tunggu instance selesai dibuat (status: *Running*).

### 1.2 Set password & catat IP
1. Masuk ke **ECS Console** → menu *Instances*.
2. Pilih instance → **More → Password/Key Pair → Reset Password**.
   Buat password root (catat baik-baik).
3. Restart instance jika diminta agar password aktif.
4. Catat **Public IP Address** instance. Contoh: `8.215.xx.xx`.

### 1.3 Buka port di Security Group (firewall lapis 1 — di sisi Alibaba)
1. Instance → tab **Security Groups** → *Configure Rules* → *Inbound*.
2. Tambahkan rule (Add Rule):
   | Port Range | Protocol | Source       | Keterangan |
   |-----------|----------|--------------|------------|
   | 22/22     | TCP      | 0.0.0.0/0    | SSH        |
   | 80/80     | TCP      | 0.0.0.0/0    | HTTP       |
   | 443/443   | TCP      | 0.0.0.0/0    | HTTPS      |

> ⚠️ Tanpa langkah ini, walau Apache jalan, halaman tidak bisa diakses dari internet.

### 1.4 Login ke server via SSH
Dari komputer Anda (PowerShell / Terminal):
```bash
ssh root@<PUBLIC_IP>
# contoh: ssh root@8.215.12.34
```
Ketik `yes` saat ditanya fingerprint, lalu masukkan password root.

✅ **Bagian 1 selesai** — Anda sudah punya Ubuntu server yang bisa di-remote.

---

## BAGIAN 2 — Apache + PHP + Konfigurasi Firewall (50%)

Jalankan semua perintah di bawah **di dalam SSH server**.

### 2.1 Update sistem
```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 Install Apache
```bash
sudo apt install apache2 -y
sudo systemctl enable apache2     # auto-start saat boot
sudo systemctl status apache2     # pastikan "active (running)"
```
Test cepat: buka browser → `http://<PUBLIC_IP>` → muncul halaman *"Apache2 Ubuntu Default Page"*.

### 2.3 Install PHP
```bash
sudo apt install php libapache2-mod-php php-cli php-mysql -y
sudo systemctl restart apache2
php -v                             # cek versi PHP terinstall
```

Test PHP:
```bash
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
```
Buka `http://<PUBLIC_IP>/info.php` → muncul tabel info PHP.
Setelah yakin jalan, **hapus** file ini (alasan keamanan):
```bash
sudo rm /var/www/html/info.php
```

### 2.4 Konfigurasi Firewall UFW (firewall lapis 2 — di dalam VM)
```bash
sudo ufw allow OpenSSH          # JANGAN lupa, biar tidak terkunci dari SSH
sudo ufw allow 'Apache Full'    # buka port 80 + 443
sudo ufw enable                 # ketik 'y' saat konfirmasi
sudo ufw status verbose         # verifikasi rule aktif
```
Output `ufw status` harus menampilkan: OpenSSH, Apache Full = ALLOW.

> 💡 Penjelasan untuk laporan: ada **2 lapis firewall** —
> Security Group (level cloud Alibaba) + UFW (level OS). Keduanya
> harus mengizinkan port yang sama agar layanan bisa diakses.

✅ **Bagian 2 selesai** — web server siap melayani halaman.

---

## BAGIAN 3 — Membuat Personal Page (20%)

### 3.1 Hapus halaman default & buat halaman personal
File personal page contoh sudah ada di folder ini: `index.html`.

Cara upload ke server, pilih salah satu:

**Cara A — SCP (dari komputer Anda, bukan dari SSH):**
```bash
scp index.html root@<PUBLIC_IP>:/var/www/html/index.html
```

**Cara B — Edit langsung di server:**
```bash
sudo nano /var/www/html/index.html
# tempel isi halaman, simpan: Ctrl+O, Enter, lalu Ctrl+X
```

### 3.2 Set kepemilikan file (good practice)
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

### 3.3 Buka di browser
`http://<PUBLIC_IP>` → halaman personal Anda tampil. 🎉

✅ **Bagian 3 selesai.**

---

## Checklist untuk laporan / screenshot

- [ ] Screenshot instance "Running" di console Alibaba
- [ ] Screenshot Security Group rules (port 22/80/443)
- [ ] Screenshot terminal `ssh` berhasil login
- [ ] Screenshot `systemctl status apache2` = active
- [ ] Screenshot `php -v`
- [ ] Screenshot `sudo ufw status verbose`
- [ ] Screenshot halaman personal di browser (dengan URL `http://<IP>` terlihat)

---

## Troubleshooting cepat

| Masalah | Penyebab umum | Solusi |
|---------|---------------|--------|
| Browser timeout / tak bisa akses :80 | Port 80 belum dibuka di Security Group | Tambahkan rule inbound 80 |
| Akses ditolak walau Apache running | UFW memblokir | `sudo ufw allow 'Apache Full'` |
| File `.php` ter-download, bukan dijalankan | modul PHP belum aktif | `sudo apt install libapache2-mod-php` lalu restart apache2 |
| Tak bisa SSH setelah enable UFW | Lupa allow OpenSSH | Login via VNC console Alibaba, jalankan `sudo ufw allow OpenSSH` |
| "Permission denied" buka file web | Kepemilikan salah | `sudo chown -R www-data:www-data /var/www/html` |
