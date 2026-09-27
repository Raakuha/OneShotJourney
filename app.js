const button = document.getElementById('start');
const bgm = document.getElementById('bgm');
const section = document.querySelectorAll('.parallax');
const exceptSection = document.querySelectorAll(".parallax:not(.intro)")
const fade = document.getElementById('fadeOverlay')

const volSlider = document.querySelector('#volBar input[type= "range"]');
const volNum = document.getElementById('volNum');
const roomCanvas = document.getElementById('roomCanvas');
const ctx = roomCanvas.getContext('2d');

ctx.fillStyle = '#5b4767';
ctx.fillRect(0, 0, roomCanvas.width, roomCanvas.height);
const tileSet = new Image();
tileSet.src = 'Graphics/Tilesets/finale.png'

tileSet.onload = function(){
    ctx.imageSmoothingEnabled = false;

    // ranjang + peti + meja komputer
    ctx.drawImage(
        tileSet,
        5, 1400, 255, 390,     // source, angka baru dari Paint 
        60, 40, 262, 400        // <- coba Opsi 1 dulu
    );

    ctx.drawImage(
        tileSet,
        0, 1880, 255, 390,     
        315, 40, 262, 400       
    );
}
let currSection = 0;
let autointerval;
let auto = false;
const delay = 2000;
bgm.volume = 0.5;
button.onclick = function (){
    bgm.play();
    
    exceptSection.forEach(section => {
        section.classList.remove('hidden-content')
    })
    startAutoscroll();
   
}


function startAutoscroll(){
    if(autointerval){
        clearInterval(autointerval);
    }
    currSection = 1;
    auto = true;

    scroll();
    autointerval = setInterval(() => {
        currSection++;
        if(currSection < section.length){
           
            if(currSection == nikoroomIndex){
                setTimeout(() => {
                    nikoRoom();
                    scroll();
                    setTimeout(() => fade.classList.remove('active'), 1500)
                }, 1200)
            }
           scroll()
        }else{
            clearInterval(autointerval);
            auto = false;
            
        }
    },delay );
    
}

const nikoroomIndex = Array.from(section).indexOf(document.querySelector('.doorscene'))

function nikoRoom(){
    button.textContent = 'Journey Started';
    button.classList.add('journey-started');

    const sectionToHide = document.querySelectorAll('.content1, .content2, .content3, .content4, .content5, .content6, .content7, .contentend ');
    sectionToHide.forEach(function(x){
        x.classList.add('hidden-content')
    });
}


function scroll(){
    auto = true;
    section[currSection].scrollIntoView({behavior: "smooth"});

    setTimeout(() => {
        auto = false;
    }, 1000);
}



function klikMute(){
    const muteBtn = document.getElementById("off_icon");
    const unmuteBtn = document.getElementById("on_icon");
    
    if(bgm.muted){
        bgm.muted = false;
        unmuteBtn.style.display = 'Inline';
        muteBtn.style.display = 'none';
    }else{
        bgm.muted = true;
        unmuteBtn.style.display = 'none';
        muteBtn.style.display = 'Inline';
    }
}

function updateVolume(){
    const value = volSlider.value
    bgm.volume = value/50
    volNum.textContent = (value * 2)  + '%';

    if (value > 0 && bgm.muted){
        klikMute();
    }
}

volSlider.addEventListener('input', updateVolume);
updateVolume();


const NIKO_SCALE = 0.75
const FRAME_W = 96 *NIKO_SCALE
const FRAME_H = 128 *NIKO_SCALE
const niko  = document.querySelector('.niko')
niko.style.backgroundImage = "url(Graphics/Characters/niko_finale.png)"

let nikoX = 300, nikoY = 320
const SPEED = 1.8
const ROW = {'down' : 0, 'left': 1, 'right': 2, 'up': 3}
let facing = 'down'
let animframe = 0;
let lastframe = 0;
const FRAME_INTERVAL = 150

const keys = {w: false, a:false, s:false, d:false}
window.addEventListener('keydown', (e) =>{
    const k = e.key.toLowerCase()
    if (k in keys) keys[k] = true
})
window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase()
    if (k in keys) keys[k] = false
})

function gameLoop(timestamp){
    let dx = 0, dy = 0

    if(keys.w) dy -= 1
    if(keys.s) dy += 1
    if(keys.a) dx -= 1
    if(keys.d) dx += 1

    const moving = dx !== 0 || dy !== 0

    if(moving){
        const len = Math.sqrt(dx*dx + dy*dy)
        nikoX += (dx/len) * SPEED
        nikoY += (dy /len) *SPEED

        if(dy < 0) facing = 'up'
        else if (dy > 0) facing = 'down'
        else if (dx < 0) facing = 'left'
        else if (dx > 0) facing = 'right'

        if (timestamp - lastframe > FRAME_INTERVAL){
            animframe = (animframe + 1) % 4
            lastframe = timestamp

        }
        
        
    }else{
        animframe = 0
    }
    niko.style.left = nikoX + 'px'
    niko.style.top = nikoY + 'px'

    niko.style.backgroundPosition = `-${animframe *FRAME_W}px -${ROW[facing] * FRAME_H}px `
    requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)