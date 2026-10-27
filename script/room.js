const roomCanvas = document.getElementById('roomCanvas');
const ctx = roomCanvas.getContext('2d');


ctx.fillStyle = '#5b4767';
ctx.fillRect(0, 0, roomCanvas.width, roomCanvas.height);
const tileSet = new Image();
tileSet.src = '/Graphics/Tilesets/finale.png'

tileSet.onload = function(){
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tileSet,
        5, 1400, 255, 390,
        60, 40, 262, 400);

    ctx.drawImage(tileSet,
        0, 1880, 255, 390,
        315, 40, 262, 400);

}

const NIKO_SCALE = 0.5
const FRAME_W = 96 *NIKO_SCALE
const FRAME_H = 128 *NIKO_SCALE
const niko  = document.querySelector('.niko')
niko.style.backgroundImage = "url(/Graphics/Characters/niko_finale.png)"

let nikoX = 320, nikoY = 240
const SPEED = 120
const ROW = {'down' : 0, 'left': 1, 'right': 2, 'up': 3}
let facing = 'down'
let animframe = 0;
let lastframe = 0;
const FRAME_INTERVAL = 150
let lastTime = 0;
const moveStack = []

const keys = {w: false, a:false, s:false, d:false}

window.addEventListener('keydown', (e) =>{
    const k = e.key.toLowerCase()
    if (k in keys) {
        keys[k] = true
        if(!moveStack.includes(k)) moveStack.push(k)

    }
})
window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase()
    if (k in keys) {
        keys[k] = false
        const idx = moveStack.indexOf(k)
        if (idx !== -1) moveStack.splice(idx, 1)
    } 
})

//fungsi ukuran niko yang nyesuaikan room-wrapper

export function applyNikoSize(){
    const displayScale = roomCanvas.clientWidth / roomCanvas.width
    niko.style.width = (FRAME_W * displayScale) + 'px'
    niko.style.height = (FRAME_H * displayScale) + 'px'

    niko.style.backgroundSize =
                `${FRAME_W * 4 * displayScale}px ${FRAME_H * 4 * displayScale}px`

}

applyNikoSize()
window.addEventListener('resize', applyNikoSize)

const ro = new ResizeObserver(applyNikoSize)
ro.observe(roomCanvas)

function gameLoop(timestamp){
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
  
    lastTime = timestamp
    let dx = 0, dy = 0
    const activeKey = moveStack [moveStack.length - 1]
    if(activeKey == 'w') dy -= 1
    else if(activeKey == 's') dy += 1
    else if(activeKey == 'a') dx -= 1
    else if(activeKey == 'd') dx += 1

    const moving = dx !== 0 || dy !== 0
    const displayScale = roomCanvas.clientWidth/roomCanvas.width

    if(moving){
        const len = Math.sqrt(dx*dx + dy*dy)
        const moveX = (dx/len) * SPEED * dt
        const moveY = (dy /len) *SPEED * dt

        if(!isColliding(nikoX + moveX, nikoY)) nikoX += moveX
        if(!isColliding(nikoX, nikoY + moveY)) nikoY += moveY
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
    niko.style.left = nikoX * displayScale + 'px'
    niko.style.top = nikoY *displayScale + 'px'

    niko.style.backgroundPosition = `-${animframe *FRAME_W * displayScale}px -${ROW[facing] * FRAME_H * displayScale}px `
    requestAnimationFrame(gameLoop)
}
requestAnimationFrame(gameLoop)

//buat ngecek koordinat canvas dari console f12 (click logger istilahnya katanya)
roomCanvas.addEventListener('click', function(e){
    const rect = roomCanvas.getBoundingClientRect();
    const scaleX = roomCanvas.width / rect.width;
    const scaleY = roomCanvas.height / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    console.log(`x: ${x}, y: ${y}`);
});

//collision

const solids = [
    { x: 60,   y: 42,   w: 124, h: 136 }, 
    { x: 60,   y: 177,  w: 58,  h: 133},
    { x: 120,  y: 178,  w: 64,  h: 100 },
    { x: 60,   y: 313,  w: 121, h: 127 },
    { x: 183,  y: 378,  w: 164, h: 62},
    { x: 382,  y: 378,  w: 194, h: 67},
    { x: 546,  y: 112,  w: 30,  h: 267},
    { x: 182,  y: 40,   w: 395, h: 71},
    { x: 185,  y: 112,  w: 358, h: 99},
    { x: 192,  y: 213,  w: 50,  h: 52},
    { x: 279,  y: 216,  w: 54,  h: 27},
    { x: 348,  y: 155,  w: 65,  h: 85 },
 
];
function getHitBox(x,y){
    const w = (FRAME_W *0.5)
    const h = (FRAME_H*0.3)

    return {
        x : x + (FRAME_W - w) /2,
        y : y + FRAME_H - h,
        w,h}
}


function isColliding(x,y){
    const box = getHitBox(x,y)
    return solids.some(s =>
        box.x < s.x + s.w &&
        box.x + box.w > s.x &&
        box.y < s.y + s.h &&
        box.y + box.h > s.y
    )
}