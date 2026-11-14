    import { onChange } from "./windows.js";

    function renderTasks(list, activEl){
        const tasks = document.getElementById('tasks');
        tasks.textContent = '';
        for (const win of list){
            const button = document.createElement('button');
            button.className = "task";
            button.textContent = win.title;
            if(win.win_sec === activEl){
            button.classList.add('active');

            }
            if(win.win_sec.hidden){
                button.classList.add('minimized');
            }
            button.addEventListener('click', (e) =>{
                if(win.win_sec.hidden){
                    win.restore();
                }else if(win.win_sec === activEl){
                    win.minimize();
                }else{
                    win.focus();
                }
            })
            tasks.append(button);
        }
    }

    function tick(){
        const clock = document.getElementById('clock');
        const date = document.getElementById('date');
        const imakoso = new Date();
        clock.textContent = imakoso.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
        date.textContent = imakoso.toLocaleDateString('en-GB', {day: "numeric", month: "short", year: "numeric"});

    }

    function buildMenu(items){
        const startMenu = document.getElementById('start-menu');
        startMenu.textContent = '';
        items.forEach(item => {
            const btn = document.createElement('button');
            const img = document.createElement('img');
            img.src = item.icon;
            img.alt = '';

            const span  = document.createElement('span');
            span.textContent = item.label;
            
            btn.append(img, span);
            btn.onclick = () =>{
                startMenu.hidden = true;
                item.open();
            }
            //kalo pake onclick gimana ya lupa
            startMenu.append(btn);
        });
    
    }

    let ready = false;
    export function initTaskbar(items){
        const startButton = document.getElementById('start-btn');
        const startMenu = document.getElementById('start-menu');
        
        buildMenu(items);
        startMenu.hidden = true;

        if(ready) return;
        ready = true;

        onChange(renderTasks);
        tick();
        setInterval(tick, 1000);
        startButton.onclick = () => {
            startMenu.hidden = !startMenu.hidden;
        }

        document.addEventListener('pointerdown', (e) => {
            if(startMenu.hidden) return;
            else if(e.target.closest('#start-menu, #start-btn')) return;
            else{
                startMenu.hidden = true;
            }

        })
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape'){
                startMenu.hidden = true;
            }
        })
    }