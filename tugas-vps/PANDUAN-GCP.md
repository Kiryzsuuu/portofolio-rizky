# Panduan Google Cloud (GCP) — VM Ubuntu + Apache + PHP + Firewall + Personal Page

GCP Free Trial: kredit **$300 / 90 hari** untuk akun baru.
Langkah di dalam server (Bagian 2 & 3) sama dengan panduan lain.

---

## BAGIAN 1 — Membuat VM (Compute Engine) + Ubuntu (30%)

### 1.1 Aktifkan akun & free trial
1. Buka https://console.cloud.google.com → login dengan akun Google.
2. Klik **Activate / Start free trial** → ikuti langkah:
   - Pilih negara: **Indonesia**
   - Isi data + **tambahkan kartu** (untuk verifikasi; tidak ditagih selama
     masih dalam kredit $300 dan belum upgrade ke akun berbayar).
3. Tunggu sampai dashboard aktif.

### 1.2 Buat Project
1. Di bar atas, klik dropdown project → **New Project**
2. Name: `tugas-vps` → **Create** → pilih project itu.

### 1.3 Aktifkan Compute Engine API
1. Search **"Compute Engine"** di search bar atas → buka.
2. Kalau diminta **Enable API**, klik **Enable** (tunggu ~1 menit).

### 1.4 Buat VM Instance
1. **Compute Engine → VM instances → Create Instance**
2. Konfigurasi:
   - **Name:** `tugas-vps`
   - **Region:** **asia-southeast2 (Jakarta)** → Zone: asia-southeast2-a
   - **Machine type:** **e2-micro** (murah; atau e2-small) — cukup untuk Apache+PHP
   - **Boot disk:** klik **Change** →
     - Operating system: **Ubuntu**
     - Version: **Ubuntu 22.04 LTS**
     - Size: 10-20 GB (default cukup) → **Select**
   - **Firewall:** centang ✅ **Allow HTTP traffic** dan ✅ **Allow HTTPS traffic**
3. Klik **Create** → tunggu VM status hijau (✓).

### 1.5 Catat External IP
Di daftar VM instances, kolom **External IP**. Contoh: `34.101.xx.xx`. Catat.

### 1.6 Login via SSH (paling mudah: lewat browser)
1. Di baris VM, klik tombol **SSH** (kolom Connect) → terbuka terminal di browser.
   **Tidak perlu setup key manual** — GCP urus otomatis. Paling praktis!

   (Alternatif dari komputer sendiri pakai gcloud CLI, tapi tombol SSH browser
   sudah cukup untuk tugas.)

✅ **Bagian 1 selesai.**

---

## BAGIAN 2 — Apache + PHP + Firewall (50%)

Jalankan di terminal SSH (browser).

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
Test: buka `http://<EXTERNAL_IP>` → muncul "Apache2 Ubuntu Default Page".

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
Buka `http://<EXTERNAL_IP>/info.php` → muncul tabel PHP. Lalu hapus:
```bash
sudo rm /var/www/html/info.php
```

### 2.4 Konfigurasi Firewall UFW (lapis 2 — di dalam VM)
```bash
sudo ufw allow OpenSSH          # biar tidak terkunci
sudo ufw allow 'Apache Full'    # port 80 + 443
sudo ufw enable                 # ketik 'y'
sudo ufw status verbose
```

> 💡 Untuk laporan: GCP punya **2 lapis firewall** —
> **VPC Firewall Rules** (level cloud GCP, yang dicentang "Allow HTTP" tadi) +
> **UFW** (level OS Ubuntu). Keduanya harus mengizinkan port 80/443.

> ⚠️ Catatan: di GCP, SSH lewat tombol browser tetap jalan walau UFW aktif
> (lewat jalur internal Google). Tapi tetap `allow OpenSSH` sebagai praktik baik.

✅ **Bagian 2 selesai.**

---

## BAGIAN 3 — Personal Page (20%)

File contoh ada di folder ini: `index.html`.

**Cara mudah — upload via tombol di SSH browser:**
1. Di jendela SSH browser, klik ikon **gerigi/upload** (pojok kanan atas) →
   **Upload file** → pilih `index.html` dari komputer Anda.
2. File masuk ke home folder. Pindahkan ke web root:
   ```bash
   sudo mv ~/index.html /var/www/html/index.html
   ```

**Atau edit langsung:**
```bash
sudo nano /var/www/html/index.html
# tempel isi, simpan: Ctrl+O, Enter, Ctrl+X
```

Set kepemilikan:
```bash
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

Buka `http://<EXTERNAL_IP>` → halaman personal tampil. 🎉

---

## Checklist laporan / screenshot

- [ ] Screenshot VM instance status hijau di Compute Engine
- [ ] Screenshot firewall rules / "Allow HTTP" tercentang
- [ ] Screenshot terminal SSH berhasil
- [ ] Screenshot `systemctl status apache2` = active
- [ ] Screenshot `php -v`
- [ ] Screenshot `sudo ufw status verbose`
- [ ] Screenshot halaman personal di browser (URL `http://<IP>` terlihat)

---

## Troubleshooting

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Browser timeout di :80 | "Allow HTTP" tidak dicentang | VM → Edit → centang Allow HTTP traffic; atau buat firewall rule port 80 |
| `.php` ter-download | modul PHP belum aktif | `sudo apt install libapache2-mod-php`; restart apache2 |
| IP berubah saat VM restart | External IP ephemeral | (opsional) jadikan **Static IP** di VPC network → External IP addresses |
| Verifikasi kartu gagal saat aktivasi | kartu belum aktif internasional | aktifkan transaksi internasional kartu (sama seperti masalah AWS) |
