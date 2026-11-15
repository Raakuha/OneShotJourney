let count = 0

const wins = new Map();
let zTop = 10;
let active = null;
const listeners = [];

export function onChange(fn) {
    listeners.push(fn)
    return () => {                        // fungsi pembatal
        const i = listeners.indexOf(fn)
        if (i !== -1) listeners.splice(i, 1)
    }
}
function notify(){
    for(const fn of listeners){
        fn([...wins.values()], active);
    }
}


function clamp(v, low, high){
    return  Math.max(low, Math.min(v, high));
}

function enableDragWindow(win, titlebar, area){
    titlebar.addEventListener('pointerdown', (e) =>{
        if(win.classList.contains('maximized')) return;

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
            const y = clamp(oy +dy, 0,  area.clientHeight - 36);
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

export function openWindow({ id, title, content, width = 480, height = 320, onClose }) {

    
    if(wins.has(id)){
       const exist =  wins.get(id);
        exist.restore();
        return exist;
    }

  
    const windows = document.getElementById('windows');
    const win_sec = document.createElement('section');
    win_sec.className = 'window'
    win_sec.innerHTML = 
    `<header class="win-titlebar">
        <span class="win-title"></span>
        <button class = "win-btn win-min" type ="button" aria-label = "Minimize"></button>
        <button class = "win-btn win-max" type ="button" aria-label = "Maximize"> </button>
        <button class="win-btn win-close" type="button" aria-label="Close"></button>
    </header>
    <div class="win-body"></div>`;

    const win_title = win_sec.querySelector('.win-title');
    win_title.textContent =  title

   
    const body = win_sec.querySelector('.win-body');
    body.append(content);
    win_sec.style.width = width + 'px';
    win_sec.style.height = height + 'px';

   
    win_sec.style.left = 120 + (count % 8) * 28 + 'px';
    win_sec.style.top = 40 + (count % 8) * 28 + 'px';
    count += 1;
   
    windows.append(win_sec);
    const titlebar = win_sec.querySelector('.win-titlebar');
    enableDragWindow(win_sec, titlebar, windows);

    function focus() {
            if(active === win_sec){
                zTop += 1;
                win_sec.style.zIndex = zTop;
                return;
            }else{
                if(active !== null){
                    active.classList.remove('active');
                   
                }
                active = win_sec;
                win_sec.classList.add('active');
                zTop += 1;
                win_sec.style.zIndex = zTop;
                notify();
            }

            
        }
        
       
    function minimize(){
        win_sec.hidden = true;
        if(active === win_sec){
            win_sec.classList.remove('active');
            active = null;
        }
        notify();
    }
        

    function restore(){
        win_sec.hidden = false;
        focus();
    }
   
    function toggleMax(){
        win_sec.classList.toggle('maximized');
    }

    function close(){
        win_sec.remove();
     
        wins.delete(id);
        if(active === win_sec){
            active = null
        }
        onClose?.()      
        notify() 
    }
    const closeButton = win_sec.querySelector('.win-close')
    closeButton.addEventListener('click', close);
    // 1. tombol _ diklik → minimize()
    const minimizeBtn = win_sec.querySelector('.win-min');
    minimizeBtn.addEventListener('click', minimize);
    // 2. tombol □ diklik → toggleMax()
    const maximize = win_sec.querySelector('.win-max');
    maximize.addEventListener('click', toggleMax);
    // 3. double-click di titlebar → toggleMax()
    titlebar.addEventListener('dblclick', (e) =>{
        if(e.target.closest('button')){
            return;
        }
        toggleMax();
    });
    // 4. pointerdown di elemen jendela (di mana saja di dalamnya) → focus()
    win_sec.addEventListener('pointerdown', focus);
    // 5. di akhir, sebelum return: panggil focus() sekali, supaya jendela baru langsung aktif
    const win = { win_sec, body, close, focus, minimize, restore, toggleMax, title };
    wins.set(id, win);

    focus();
    return win;
}
export function closeAll() {
    for (const win of [...wins.values()]) win.close()
    count = 0
    active = null
    notify()
}