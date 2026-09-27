const button = document.getElementById('start');
const bgm = document.getElementById('bgm');
const section = document.querySelectorAll('.parallax');

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
const delay = 3000;
bgm.volume = 0.5;
button.onclick = function (){
    bgm.play();

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
            scroll();
        }else{
            clearInterval(autointerval);
            auto = false;
            
        }
    },delay );
    
}

function scroll(){
    auto = true;
    section[currSection].scrollIntoView({behavior: "smooth"});

    setTimeout(() => {
        auto = false;
    }, 1000);
}

window.addEventListener('scroll', () => {
    if(autointerval && !auto){
        clearInterval(autointerval );
        autointerval = null;
    }
});

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


roomCanvas.addEventListener('click', function(e){
    const rect = roomCanvas.getBoundingClientRect()
    const scaleX = roomCanvas.width/rect.width
    const scaleY = roomCanvas.height/rect.height
    const x = Math.round((e.clientX - rect.left) * scaleX)
    const y = Math.round((e.clientY - rect.top) * scaleY)
    console.log(`x : ${x}, y : ${y}` )
})