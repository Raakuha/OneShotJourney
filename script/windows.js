

let count = 0

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