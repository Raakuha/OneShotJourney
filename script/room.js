

const NIKO_SCALE = 0.5
const FRAME_W = 96 *NIKO_SCALE
const FRAME_H = 128 *NIKO_SCALE

const SPEED = 120
const ROW = {'down' : 0, 'left': 1, 'right': 2, 'up': 3}

const FRAME_INTERVAL = 150

const keys = {w: false, a:false, s:false, d:false}


        export class Room {
            constructor (container){
                container.innerHTML = `
                        <div class="room-wrapper">   
                            <canvas class = "room-canvas" width="640" height="480"></canvas>
                            <div class="niko"></div>
                        </div>`;
                
                this.canvas = container.querySelector('.room-canvas');
                this.niko = container.querySelector('.niko');
                this.niko.style.backgroundImage = "url(/Graphics/Characters/niko_finale.png)"

                this.ctx = this.canvas.getContext('2d');
                this.ctx.fillStyle = '#5b4767';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                        
                const tileSet = new Image();
                tileSet.src = '/Graphics/Tilesets/finale.png'

                tileSet.onload = () => {
                    this.ctx.imageSmoothingEnabled = false;
                    this.ctx.drawImage(tileSet,
                        5, 1400, 255, 390,
                        60, 40, 262, 400);

                    this.ctx.drawImage(tileSet,
                        0, 1880, 255, 390,
                        315, 40, 262, 400);

                }
                this.nikoX = 320; 
                this.nikoY = 240
                this.facing = 'down';
                this.raf = null;
                this.animframe = 0;
                this.lastframe = 0;
                this.lastTime = 0;
                this.moveStack = [];
                this.paused = false;
            }
            gameLoop = (timestamp) =>{
            
                    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05)
                
                    this.lastTime = timestamp
                    let dx = 0, dy = 0
                    const activeKey = this.moveStack [this.moveStack.length - 1]
                    if(activeKey == 'w') dy -= 1
                    else if(activeKey == 's') dy += 1
                    else if(activeKey == 'a') dx -= 1
                    else if(activeKey == 'd') dx += 1
                
                    const moving = dx !== 0 || dy !== 0
                    const displayScale = this.canvas.clientWidth/this.canvas.width
                
                    if(moving){
                        const len = Math.sqrt(dx*dx + dy*dy)
                        const moveX = (dx/len) * SPEED * dt
                        const moveY = (dy /len) *SPEED * dt
                
                        if(!isColliding(this.nikoX + moveX, this.nikoY)) this.nikoX += moveX
                        if(!isColliding(this.nikoX, this.nikoY + moveY)) this.nikoY += moveY
                        if(dy < 0) this.facing = 'up'
                        else if (dy > 0) this.facing = 'down'
                        else if (dx < 0) this.facing = 'left'
                        else if (dx > 0) this.facing = 'right'
                
                        if (timestamp - this.lastframe > FRAME_INTERVAL){
                            this.animframe = (this.animframe + 1) % 4
                            this.lastframe = timestamp
                
                        }
                        
                        
                    }else{
                        this.animframe = 0
                    }
                    this.niko.style.left = this.nikoX * displayScale + 'px'
                    this.niko.style.top = this.nikoY * displayScale + 'px'
                
                    this.niko.style.backgroundPosition = `-${this.animframe * FRAME_W * displayScale}px -${ROW[this.facing] * FRAME_H * displayScale}px `
                    this.raf = requestAnimationFrame(this.gameLoop)
                
                
            }
            onKeyDown = (e) =>{
                if(this.paused) return;
                const k = e.key.toLowerCase()
                    if (k in keys) {
                        keys[k] = true
                        if(!this.moveStack.includes(k)) this.moveStack.push(k)
                
                    }
            }
            onKeyUp = (e) => {
                const k = e.key.toLowerCase()
                    if (k in keys) {
                        keys[k] = false
                        const idx = this.moveStack.indexOf(k)
                        if (idx !== -1) this.moveStack.splice(idx, 1)
                    } 
            }
            applyNikoSize(){
                const displayScale = this.canvas.clientWidth / this.canvas.width
                this.niko.style.width = (FRAME_W * displayScale) + 'px'
                this.niko.style.height = (FRAME_H * displayScale) + 'px'

                this.niko.style.backgroundSize =
                            `${FRAME_W * 4 * displayScale}px ${FRAME_H * 4 * displayScale}px`
            }
            start(){
                if(this.raf !== null) return;
                window.addEventListener('keydown', this.onKeyDown);
                window.addEventListener('keyup', this.onKeyUp);
                this.applyNikoSize();
                this.raf = requestAnimationFrame(this.gameLoop);
            }
            pause(){
                this.paused = true;
                this.moveStack.length = 0;
            }
            resume(){
                this.paused = false;
            }
            destroy(){
                cancelAnimationFrame(this.raf);
                this.raf = null;
                window.removeEventListener('keydown', this.onKeyDown);
                window.removeEventListener('keyup', this.onKeyUp);
            }
        }


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