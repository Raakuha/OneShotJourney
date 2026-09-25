# My Journey — OneShot Memory Website

Website interaktif berisi kenangan pribadi saya main **OneShot**, dibungkus dalam bentuk parallax scroll yang nantinya akan berkembang jadi eksplorasi map yang lebih immersive — pengunjung bisa "jalan-jalan" sendiri di map-map dari game-nya, langsung di browser.

Ini proyek pribadi/fan project, bukan produk resmi dan tidak berafiliasi dengan developer OneShot.

## Status saat ini

Yang sudah jalan:
- Landing page dengan tombol **Start Journey** yang men-trigger BGM + autoscroll
- Parallax scroll melewati beberapa momen (CG + kutipan) dari playthrough saya
- Kontrol volume (mute toggle + slider) buat BGM
- Section penutup berisi catatan personal

Yang sedang dikerjakan (lihat [Roadmap](#roadmap)):
- Room scene "kamar Niko" yang di-render pakai potongan tileset asli lewat `<canvas>`
- Kontrol pergerakan **WASD** untuk eksplorasi map, menggantikan pendekatan point-and-click

## Tumpukan teknologi

Murni HTML, CSS, dan vanilla JavaScript — tanpa framework maupun build step. Dipilih sengaja biar prosesnya jadi ajang belajar langsung fundamental web dev.

## Struktur folder

```
.
├── index.html
├── style.css
├── app.js
├── font/                  # font lokal (TerminusTTF-Bold)
└── asset/                 # CG, sprite, tileset, audio — TIDAK ikut di-commit, lihat bagian Assets
```

## Assets

Folder `asset/` (CG, sprite karakter, tileset, OST) diambil langsung dari file game OneShot dan **sengaja di-gitignore** — bukan bug, ini keputusan sadar karena dua alasan:

1. Ukurannya besar dan bakal bikin repository bengkak kalau ikut di-commit.
2. Ini file resmi dari game OneShot (developer: **Little Cat Feet**), bukan aset yang saya buat sendiri, jadi tidak didistribusikan ulang lewat repository publik ini.

Supaya website ini jalan di komputer sendiri, siapkan folder `asset/` secara manual (diisi sendiri dari game yang dimiliki), dengan struktur mengikuti apa yang direferensikan di `index.html` / `style.css` / `app.js`.

## Menjalankan secara lokal

1. Clone repository ini
2. Siapkan folder `asset/` seperti dijelaskan di atas
3. Buka `index.html` langsung di browser, atau jalankan lewat live server (VS Code extension "Live Server" misalnya) biar path relatif kebaca lebih konsisten

Tidak ada dependency atau langkah build — murni file statis.

## Deploy

Repository ini sengaja hanya berisi source code (folder `asset/` di-gitignore), jadi deploy dilakukan manual lewat Vercel CLI dari komputer lokal (yang folder `asset/`-nya lengkap), bukan lewat auto-deploy GitHub integration:

```
npm i -g vercel
vercel login
vercel --prod
```

## Roadmap

- [ ] Render "kamar Niko" pakai potongan tileset asli (`finale.png`) lewat `<canvas>` + `drawImage`
- [ ] Kontrol gerak karakter pakai **WASD**, gantiin interaksi point-and-click
- [ ] Eksplorasi map dari data map asli game (`Map###.rxdata`) supaya pengunjung bisa "napak tilas" ke tempat-tempat yang pernah saya kunjungi selama main
- [ ] Galeri/album screenshot momen-momen berkesan

## Kredit

- **OneShot** dikembangkan oleh **Little Cat Feet**. Semua CG, sprite, tileset, dan musik adalah hak cipta developer aslinya — situs ini murni tribute pribadi, dibuat karena suka sama game-nya, bukan klaim kepemilikan atas karya siapa pun.
- Dibuat & ditulis oleh Rakha, salah satu pemain/"god" OneShot yang menyelesaikan game-nya 26 Agustus 2025.
