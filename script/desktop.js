import { powerOff } from './boot.js'
import { get, set } from './save.js'
import { openWindow } from './windows.js';

const  PAD = 16;
const CELL = 96;
const DRAG_START = 4;

const ICONS = [
    { id: 'oneshot', label: 'OneShot.exe',  icon: '/world_machine/desktop_icon/oneshot.png',   open: openOneShot },
    { id: 'readme', label: 'README.txt',   icon: '/world_machine/desktop_icon/doc.png',       open: () => openWindow({ title: 'README.txt', content: placeholder('Isi README menyusul.') })},
    { id: 'about', label: 'about_me.txt', icon: '/world_machine/desktop_icon/doc.png',       open: () => openWindow({title: 'AboutMe.txt', content: placeholder('Ini aku Rakha')})},
    { id: 'settings', label: 'Settings',     icon: '/world_machine/desktop_icon/customize.png', open: () =>  openWindow({title: 'Settings', content: placeholder('Ini window pengaturan harusnya')}) },
    { id: 'shutdown', label: 'Shut down',    icon: '/world_machine/desktop_icon/exit.png',      open: powerOff },
]

function openOneShot() {
    // sementara: sembunyikan desktop supaya halaman lama terlihat
    document.getElementById('desktop').hidden = true
}

function enableDrag(btn, item, desktop){
    btn.addEventListener('pointerdown', (e) => {
        if(e.button !== 0){
            return;
        }
        
        const sx = e.clientX, sy = e.clientY;
        const ox = btn.offsetLeft, oy = btn.offsetTop;
        let dragging = false;
        btn.setPointerCapture(e.pointerId);
       
        function onMove(ev){
            const dx = ev.clientX - sx, dy = ev.clientY - sy;
            if(!dragging && Math.hypot(dx, dy) < DRAG_START ){
                return;
            }

            dragging = true;
            btn.classList.add('dragging');
            btn.style.left = ox + dx + 'px';
            btn.style.top = oy+dy + 'px';
        }
        function onUp(){
            btn.removeEventListener('pointermove', onMove);
            btn.removeEventListener('pointerup', onUp);
            btn.removeEventListener('pointercancel', onUp);

            if(!dragging){
                return;
            }
            btn.classList.remove('dragging');
            let kolom = Math.round((btn.offsetLeft - PAD) / CELL);
            let baris = Math.round((btn.offsetTop - PAD) / CELL);
            

            const kolomMaks = Math.floor((desktop.clientWidth - PAD - CELL) / CELL);
            const barisMaks = Math.floor((desktop.clientHeight - PAD - CELL) / CELL);
            kolom = Math.max(0, Math.min(kolom, kolomMaks));
            // b. batasi baris dengan cara yang sama seperti kolom, tapi pakai barisMaks
            baris = Math.max(0, Math.min(baris, barisMaks));

            // c. hitung posisi rapi:
            //    const x = PAD + kolom × CELL
            //    const y = PAD + baris × CELL
            const x = PAD + kolom * CELL
            const y = PAD + baris * CELL
            // d. atur style.left dan style.top btn ke x dan y (ingat 'px')
            btn.style.left = x + 'px';
            btn.style.top = y +'px';
            // e. simpan ke save:
            //    set('iconPos', { ...get('iconPos'), [item.id]: { x, y } })
            set('iconPos', { ...get('iconPos'), [item.id] : {x, y}});

        }   
              // 6. pasang onMove ke event 'pointermove' di btn
             //    pasang onUp ke event 'pointerup' di btn
            //    pasang onUp juga ke event 'pointercancel' di btn
            btn.addEventListener('pointermove', onMove)
            btn.addEventListener('pointerup', onUp);
            btn.addEventListener('pointercancel', onUp);
    })
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
        img.draggable = false;
        // 3. buat elemen span baru, simpan di variabel span
        //    - isi textContent-nya dengan nama milik item (item.label)

        const span = document.createElement('span')
        span.textContent = item.label;

        // 4. masukkan img dan span ke dalam btn (append)
        button.addEventListener('click', () => select(button))
        button.append(img, span);

        // 5. posisi ikon:
        //    a. ambil posisi tersimpan untuk ikon ini → get('iconPos')[item.id]
        //    b. kalau tidak ada (pakai ??), pakai posisi default:
        //         { x: PAD, y: PAD + i * CELL }
        //    c. simpan hasilnya di satu variabel, misalnya pos
        //    d. style.left = pos.x + 'px'
        //       style.top  = pos.y + 'px'   (atau pakai template literal)
        const savedPos = get('iconPos')[item.id];
        const pos = savedPos ?? {x: PAD, y: PAD + i*CELL};
        button.style.left = pos.x + 'px';
        button.style.top  = pos.y + 'px';

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
        enableDrag(button, item, desktop)
       
        desktopIcon.append(button);
    })
    desktop.onclick = (e) =>{
        if(e.target === desktop || e.target === desktopIcon){
            select(null);
        }
    }
}

function placeholder(text){
    const el = document.createElement('p');
    el.textContent = text;
    return el;
}