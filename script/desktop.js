import { powerOff } from './boot.js'

const ICONS = [
    { label: 'OneShot.exe',  icon: '/world_machine/desktop_icon/oneshot.png',   open: openOneShot },
    { label: 'README.txt',   icon: '/world_machine/desktop_icon/doc.png',       open: () => console.log('buka README') },
    { label: 'about_me.txt', icon: '/world_machine/desktop_icon/doc.png',       open: () => console.log('buka about_me') },
    { label: 'Settings',     icon: '/world_machine/desktop_icon/customize.png', open: () => console.log('buka Settings') },
    { label: 'Shut down',    icon: '/world_machine/desktop_icon/exit.png',      open: powerOff },
]

function openOneShot() {
    // sementara: sembunyikan desktop supaya halaman lama terlihat
    document.getElementById('desktop').hidden = true
}


export function showDesktop(){
    // ambil #desktop, simpan di variabel desktop
    // ambil #desktop-icons, simpan di variabel iconsBox
    const desktop = document.getElementById('desktop');
    const desktopIcon = document.getElementById('desktop-icons');

    // tampilkan desktop
    desktop.hidden = false;
    // kosongkan iconsBox: iconsBox.textContent = ''
    desktopIcon.textContent = '';
    function select(btn) {
            // ambil semua ikon di wadah: querySelectorAll('.desk-icon')
            const allIcon = desktopIcon.querySelectorAll('.desk-icon');
            // hapus class 'selected' dari semuanya (pakai forEach)
            allIcon.forEach((element) =>{
                element.classList.remove('selected');
            })
            // kalau btn ada isinya → tambahkan class 'selected' ke btn
            if(btn){
                btn.classList.add('selected')
            }
        }


    ICONS.forEach((item, i) => {
        // 1. buat elemen button baru, simpan di variabel btn
        //    - isi type-nya dengan 'button'
        //    - isi className-nya dengan 'desk-icon'
        const button = document.createElement('button')
        button.type = 'button';
        button.className = 'desk-icon'

        // 2. buat elemen img baru, simpan di variabel img
        //    - isi src-nya dengan gambar milik item (item.icon)
        //    - isi alt-nya dengan teks kosong
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = '';

        // 3. buat elemen span baru, simpan di variabel span
        //    - isi textContent-nya dengan nama milik item (item.label)

        const span = document.createElement('span')
        span.textContent = item.label;

        // 4. masukkan img dan span ke dalam btn (append)
        button.addEventListener('click', () => select(button))
        button.append(img, span);

        // 5. atur posisi btn lewat style:
        //    - left = 16px
        //    - top  = 16 + i × 96, ditambah 'px' (pakai template literal)
        button.style.left = '16px';
        button.style.top =  `${16 + i*96}px`

        // 5b. pasang event 'dblclick' di btn:
        //     saat terjadi → jalankan fungsi open milik item (item.open())
        button.addEventListener('dblclick', () =>{
            item.open();
        });

        button.addEventListener('keydown',(e) =>{
            if(e.key === 'Enter'){
                item.open();
            }
        })
        // 5c. pasang event 'keydown' di btn:
        //     handler-nya menerima parameter e
        //     kalau e.key sama dengan 'Enter' → jalankan item.open()
        // 6. tempelkan btn ke wadah ikon (append)
        desktopIcon.append(button);
    })
    desktop.onclick = (e) =>{
        if(e.target === desktop || e.target === desktopIcon){
            select(null);
        }
    }
}