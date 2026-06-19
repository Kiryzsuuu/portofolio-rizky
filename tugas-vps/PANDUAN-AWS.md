# Panduan AWS EC2 — VM Ubuntu + Apache + PHP + Firewall + Personal Page

Khusus untuk AWS. Untuk langkah di dalam server (Bagian 2 & 3), sama dengan
[PANDUAN.md](PANDUAN.md) — di sini ditulis ulang lengkap agar satu file utuh.

---

## BAGIAN 1 — Membuat VM (EC2) + Ubuntu (30%)

### 1.1 Persiapan akun
1. Daftar / login di https://aws.amazon.com → **Console**.
2. Pastikan akun aktif (verifikasi kartu + nomor HP). Free tier otomatis aktif
   12 bulan untuk akun baru.

### 1.2 Pilih Region
Di kanan atas console, pilih region **Asia Pacific (Jakarta) ap-southeast-3**
(atau Singapore ap-southeast-1 jika Jakarta tak muncul).

### 1.3 Launch Instance
1. Buka layanan **EC2** → tombol **Launch instance**.
2. **Name:** `tugas-vps` (bebas).
3. **Application and OS Images (AMI):**
   - Pilih **Ubuntu** → **Ubuntu Server 22.04 LTS** (pastikan ada label
     "Free tier eligible").
4. **Instance type:**
   - Pilih **t2.micro** atau **t3.micro** (label "Free tier eligible").
5. **Key pair (login):** — PENTING untuk SSH
   - Klik **Create new key pair**
   - Name: `tugas-key`
   - Type: **RSA**, Format: **.pem** (untuk Linux/Mac/Git Bash) atau
     **.ppk** (jika pakai PuTTY di Windows).
   - Klik **Create** → file `tugas-key.pem` otomatis terdownload.
     **SIMPAN file ini, tidak bisa didownload ulang!**
6. **Network settings** → klik **Edit**, lalu centang:
   - ✅ Allow SSH traffic from → **Anywhere (0.0.0.0/0)**  *(port 22)*
   - ✅ Allow HTTP traffic from the internet  *(port 80)*
   - ✅ Allow HTTPS traffic from the internet  *(port 443)*

   > Ini adalah **Security Group** AWS = firewall lapis 1. Pastikan ketiganya
   > tercentang, kalau tidak halaman web tak bisa diakses.
7. **Configure storage:** biarkan default (8 GB gp3 / gp2, gratis sampai 30 GB).
8. Klik **Launch instance**.

### 1.4 Catat Public IP
1. Buka **EC2 → Instances** → tunggu status **Running** + **2/2 checks passed**.
2. Klik instance → catat **Public IPv4 address**. Contoh: `13.250.xx.xx`.

### 1.5 Login via SSH

**Windows (PowerShell / Git Bash):**
```bash
# Pindah ke folder tempat file .pem berada, misal Downloads
cd ~/Downloads

# (Wajib di Linux/Mac/Git Bash) batasi permission key
chmod 400 tugas-key.pem

# Login — user default Ubuntu di AWS adalah "ubuntu" (BUKAN root)
ssh -i tugas-key.pem ubuntu@<PUBLIC_IP>
# contoh: ssh -i tugas-key.pem ubuntu@13.250.12.34
```
Ketik `yes` saat ditanya fingerprint.

> Jika di PowerShell muncul error permission key, jalankan via **Git Bash**,
> atau perbaiki permission:
> ```powershell
> icacls.exe tugas-key.pem /reset
> icacls.exe tugas-key.pem /grant:r "$($env:USERNAME):(R)"
> icacls.exe tugas-key.pem /inheritance:r
> ```

> Catatan: di AWS Anda login sebagai user `ubuntu`, dan pakai `sudo` untuk
> perintah admin (tidak login langsung sebagai root).

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

### 2.4 Konfigurasi Firewall UFW (firewall lapis 2 — di dalam VM)
```bash
sudo ufw allow OpenSSH          # WAJIB dulu, biar tidak terkunci dari SSH
sudo ufw allow 'Apache Full'    # port 80 + 443
sudo ufw enable                 # ketik 'y'
sudo ufw status verbose
```

> 💡 Untuk laporan: AWS punya **2 lapis firewall** —
> **Security Group** (level cloud AWS) + **UFW** (level OS Ubuntu).
> Keduanya harus mengizinkan port yang sama (22/80/443).

✅ **Bagian 2 selesai.**

---

## BAGIAN 3 — Personal Page (20%)

File contoh ada di folder ini: `index.html`.

**Upload via SCP (dari komputer Anda, di folder yang ada .pem):**
```bash
scp -i tugas-key.pem index.html ubuntu@<PUBLIC_IP>:/tmp/index.html
# lalu di server, pindahkan ke web root:
ssh -i tugas-key.pem ubuntu@<PUBLIC_IP>
sudo mv /tmp/index.html /var/www/html/index.html
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

- [ ] Screenshot EC2 instance status "Running"
- [ ] Screenshot Security Group inbound rules (22/80/443)
- [ ] Screenshot terminal `ssh -i ... ubuntu@IP` berhasil
- [ ] Screenshot `systemctl status apache2` = active
- [ ] Screenshot `php -v`
- [ ] Screenshot `sudo ufw status verbose`
- [ ] Screenshot halaman personal di browser (URL `http://<IP>` terlihat)

---

## Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| `Permission denied (publickey)` | salah user / permission .pem | Pakai user `ubuntu`; `chmod 400 tugas-key.pem` |
| Browser timeout di :80 | port 80 belum dibuka di Security Group | EC2 → Security Groups → Edit inbound → Add HTTP |
| `.php` ter-download | modul PHP belum aktif | `sudo apt install libapache2-mod-php`; restart apache2 |
| Terkunci setelah `ufw enable` | lupa allow OpenSSH | Pakai EC2 Instance Connect (browser) → `sudo ufw allow OpenSSH` |
| IP berubah setiap restart | IP publik dinamis | (opsional) alokasikan **Elastic IP** dan associate ke instance |
