# OneShot Journey

Website tribute untuk **OneShot**, berbentuk sistem operasi fiktif di browser yang terinspirasi dari *OneShot: World Machine Edition*. Pengunjung menyalakan komputer, login, lalu menjelajahi desktop yang menyimpan kenangan saya selama memainkan OneShot, sampai tamat pada 26 Agustus 2025.

Proyek ini juga tempat saya belajar web development dari dasar. Semuanya ditulis dengan HTML, CSS, dan JavaScript biasa, tanpa framework, supaya saya benar-benar paham cara kerja setiap bagiannya.

Ini fan project pribadi. Tidak resmi, dan tidak berafiliasi dengan developer OneShot.

## Tampilan sementara

Masih dalam pengerjaan. Screenshot di bawah diambil dari versi yang berjalan di komputer saya (`npm run dev`).

**Layar boot.** Tombol power menyalakan lampu, lalu muncul BIOS palsu yang membaca info perangkat pengunjung: jumlah core CPU, GPU, resolusi layar, baterai, bahasa, dan zona waktu.

![Layar boot](docs/screenshots/01-boot.webp)

**Login.** Nama pengunjung diingat. Kunjungan berikutnya langsung disapa "Welcome back".

![Login](docs/screenshots/02-login.webp)

**Desktop.** Ikon bisa digeser dan menempel ke grid, dan posisinya tersimpan. Taskbar berisi tombol Start, daftar jendela yang terbuka, jam dan tanggal, serta lampu yang "parkir" di pojok kanan.

![Desktop](docs/screenshots/03-desktop.webp)

**OneShot.exe.** Kamar Niko berjalan di dalam jendela. Niko digerakkan dengan WASD, dan berhenti otomatis saat jendela lain sedang aktif.

![OneShot.exe](docs/screenshots/04-oneshot.webp)

## Yang sudah jalan

- **Boot dan login**: animasi lampu, log BIOS dari info perangkat, nama tersimpan di `localStorage`.
- **Desktop**: ikon dibangun dari data, bisa di-drag dengan snap ke grid, dan posisinya disimpan.
- **Window manager**: jendela bisa digeser lewat titlebar, difokus (naik ke depan), di-minimize, di-maximize, dan ditutup. Satu aplikasi hanya punya satu jendela.
- **Taskbar**: daftar jendela yang selalu sinkron, Start menu, jam, dan tanggal.
- **OneShot.exe**: kamar Niko dengan collision, animasi jalan, dan kecepatan yang sama di semua refresh rate monitor. Game loop dan kontrol keyboard dinyalakan dan dimatikan bersama jendelanya.
- **Shut down**: semua jendela ditutup dengan bersih, lalu kembali ke layar boot.

## Rencana berikutnya

- [ ] Kotak dialog ala OneShot (efek mengetik, potret wajah, pilihan jawaban)
- [ ] Prolog dengan narator The World Machine
- [ ] Message box, menu klik kanan, Settings
- [ ] File Explorer, Notepad, Image Viewer
- [ ] Tiga kenangan tersembunyi, masing-masing dengan puzzle sendiri
- [ ] Momen serius dalam mode fullscreen, ending, dan credit
- [ ] Rilis online di Cloudflare Pages

Setelah rilis:

- [ ] Penjaga pintu hadiah dan easter egg untuk yang sudah tamat
- [ ] Jelajah map dari data map asli game
- [ ] Backend kecil (Hono di Cloudflare Workers + D1), misalnya penghitung pengunjung yang sampai ending

## Yang saya pelajari sejauh ini

- **Delta time**: menghitung gerakan berdasarkan waktu nyata, bukan jumlah frame, supaya Niko tidak lebih cepat di monitor 165 Hz.
- **ES modules**: memecah kode per file dengan `import` dan `export`, dan meng-export sesedikit mungkin.
- **`localStorage` dan JSON**: menyimpan progres dengan nilai default yang aman.
- **`async`/`await` dan `Promise`**: menyusun urutan animasi boot, dan membuat fungsi yang menunggu input pengunjung.
- **Pointer events**: drag ikon dan jendela, ambang drag, snap ke grid, dan batas layar.
- **Closure**: fungsi yang mengingat variabel tempat ia dibuat, dipakai di hampir semua bagian window manager.
- **Pola observer**: taskbar "mendengarkan" perubahan jendela, lengkap dengan cara berhenti mendengarkan.
- **`class` dan pembersihan**: setiap `addEventListener`, `setInterval`, dan `requestAnimationFrame` punya pasangan pemadamnya, supaya tidak ada proses yang tertinggal setelah jendela ditutup.
- **CSS**: flexbox, stacking context dan `z-index`, CSS variable, sprite sheet dengan `background-position`, dan transisi.

## Teknologi

- HTML, CSS, JavaScript (ES modules), tanpa framework
- [Vite](https://vite.dev) sebagai dev server dan build tool
- Rencana deploy: Cloudflare Pages

## Struktur folder

```
.
├── index.html
├── style.css
├── app.js              # titik masuk: tombol power, urutan boot
├── script/
│   ├── boot.js         # log BIOS, power off
│   ├── login.js
│   ├── save.js         # simpan dan baca progres (localStorage)
│   ├── desktop.js      # ikon desktop, OneShot.exe
│   ├── windows.js      # window manager
│   ├── taskbar.js
│   └── room.js         # kamar Niko (class Room)
├── docs/screenshots/
└── public/             # aset game, TIDAK ikut di-commit (lihat bagian Aset)
```

## Aset

Aset game (CG, sprite, tileset, musik, font, dan aset UI World Machine Edition) disimpan di `public/` dan **sengaja di-gitignore**. Semua itu file resmi milik developer OneShot, bukan buatan saya, jadi tidak saya distribusikan ulang lewat repository ini.

Untuk menjalankannya sendiri, isi folder `public/` dari salinan game yang kamu miliki:

```
public/
├── asset/
├── Graphics/        # Characters, Faces, Icons, Tilesets, ...
├── font/            # TerminusTTF-Bold.ttf
└── world_machine/   # dari OneShot: World Machine Edition (desktop_icon/, window_buttons.png, ...)
```

## Menjalankan secara lokal

Butuh [Node.js](https://nodejs.org).

```
npm install
npm run dev
```

Lalu buka `http://localhost:5173`.

## Kredit

- **OneShot** dan **OneShot: World Machine Edition** adalah karya Future Cat (sebelumnya Little Cat Feet). Semua CG, sprite, tileset, musik, dan aset UI adalah hak cipta developer aslinya. Kalau kamu belum memainkannya, mainkan dulu: [OneShot di Steam](https://store.steampowered.com/app/420530/OneShot/).
- Font **Terminus** oleh Dimitar Zhekov, dengan lisensi SIL Open Font License.
- Dibuat oleh Rakha, salah satu "god" yang menemani Niko sampai akhir.
