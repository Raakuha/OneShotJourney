

let count = 0
function clamp(v, low, high){
    return  Math.max(low, Math.min(v, high));
}

function enableDragWindow(win, titlebar, area){
    titlebar.addEventListener('pointerdown', (e) =>{
        if ( e.button !== 0){
          
            return;
        }

        if(e.target.closest('button')){
            
            return;
        }
        e.preventDefault();
        const sx = e.clientX, sy = e.clientY;
        const ox = win.offsetLeft, oy = win.offsetTop;
        titlebar.setPointerCapture(e.pointerId);
        win.classList.add('dragging');
        function onMove(ev){
            const dx = ev.clientX - sx, dy = ev.clientY - sy;
            const x = clamp(ox +dx, 80 - win.offsetWidth,  area.clientWidth - 80)
            const y = clamp(oy +dy, 0,  area.clientHeight - 28);
            win.style.left = x + 'px';
            win.style.top = y + 'px';

        }
        function onUp(){
            titlebar.removeEventListener('pointermove', onMove);
            titlebar.removeEventListener('pointerup', onUp);
            titlebar.removeEventListener('pointercancel', onUp);
            win.classList.remove('dragging');
        }
        titlebar.addEventListener('pointermove', onMove);
        titlebar.addEventListener('pointerup', onUp);
        titlebar.addEventListener('pointercancel', onUp);

    })
}

export function openWindow({ title, content, width = 480, height = 320 }) {
    // 1. ambil wadah #windows
    const windows = document.getElementById('windows');
    // 2. buat elemen <section>, beri class 'window'
    const win_sec = document.createElement('section');
    win_sec.className = 'window'
    // 3. isi kerangkanya dengan innerHTML (lihat konsep c)
    win_sec.innerHTML = 
    `<header class="win-titlebar">
        <span class="win-title"></span>
        <button class="win-close" type="button" aria-label="Close">×</button>
    </header>
    <div class="win-body"></div>`;

    // 4. isi judul: cari .win-title di dalam el, lalu isi textContent-nya dengan title
    const win_title = win_sec.querySelector('.win-title');
    win_title.textContent =  title

    // 5. masukkan content ke dalam .win-body (pakai append)
    //    (content berupa elemen yang dibuat oleh pemanggil)
    const body = win_sec.querySelector('.win-body');
    body.append(content);
    // 6. ukuran: style.width dan style.height dari width dan height (ingat 'px')
    win_sec.style.width = width + 'px';
    win_sec.style.height = height + 'px';

    // 7. posisi bertingkat supaya jendela baru tidak menutupi tepat jendela lama: 
    //    left = 120 + (count % 8) × 28
    //    top  = 40  + (count % 8) × 28
    //    lalu tambah count satu
    win_sec.style.left = 120 + (count % 8) * 28 + 'px';
    win_sec.style.top = 40 + (count % 8) * 28 + 'px';
    count += 1;
    // 8. tempelkan el ke wadah #windows
    windows.append(win_sec);
    const titlebar = win_sec.querySelector('.win-titlebar');
    enableDragWindow(win_sec, titlebar, windows);
    // 9. buat fungsi close() yang menghapus el dari halaman: el.remove()
    function close(){
        win_sec.remove();
    }
    // 10. tombol × diklik → close()   (pakai onclick atau addEventListener)
    const closeButton = win_sec.querySelector('.win-close')
    closeButton.addEventListener('click', close);
    // 11. kembalikan objek { el, body, close }
    //     body = elemen .win-body

    return{ win_sec, body, close};
}

// export function closeAll() {
    //     1. ambil wadah #windows
    //     2. kosongkan isinya (textContent = '')
    //     3. kembalikan count ke 0, supaya jendela pertama di sesi baru
    //        muncul di posisi awal lagi
    // }
export function closeAll(){
    const windows = document.getElementById('windows');
    windows.textContent = '';
    count = 0

}