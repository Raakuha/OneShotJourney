import { applyNikoSize } from './script/room.js'
import { get, set } from './script/save.js';
import { runBootLog, sleep } from './script/boot.js';
import { showLogin } from './script/login.js';
import { showDesktop } from './script/desktop.js';

const button = document.getElementById('start');
const bgm = document.getElementById('bgm');
const section = document.querySelectorAll('.parallax');
const exceptSection = document.querySelectorAll(".parallax:not(.intro)")
const fade = document.getElementById('fadeOverlay')
const mute_Btn = document.getElementById('bgm_btn')
const introTitle = document.querySelector('.title h1')
const volSlider = document.querySelector('#volBar input[type= "range"]');
const volNum = document.getElementById('volNum');

const powerBtn = document.getElementById('power');
const bootScreen = document.getElementById('boot');
const bootBulb = document.getElementById('sun');

let currSection = 0;
let autointerval;
let auto = false;
const delay = 1000; // buat delay antar scroll di awal
bgm.volume = 0.5;
button.onclick = function (){
    bgm.play();
    
    exceptSection.forEach(section => {
        section.classList.remove('hidden-content')
    })
    applyNikoSize()
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
                clearInterval(autointerval)
                autointerval = null
                fade.classList.add('active')
                setTimeout(() => {
                    nikoRoom();
                    scroll();
                    setTimeout(() => fade.classList.remove('active'), 1500)
                }, 1200)
            }else{
                scroll()
            }
           
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

function applyMute(muted){
    const muteBtn = document.getElementById("off_icon");
    const unmuteBtn = document.getElementById("on_icon");
    bgm.muted = muted

    muteBtn.style.display = muted ? 'Inline' : 'none'
    unmuteBtn.style.display = muted ? 'none' : 'Inline'
    set('muted', muted)
}

function klikMute(){
    applyMute(!bgm.muted);
}

mute_Btn.addEventListener('click', klikMute);
function updateVolume(){
    const value = volSlider.value
    bgm.volume = value/50
    volNum.textContent = (value * 2)  + '%';
    set('volume', Number(value))
}

// volSlider.addEventListener('input', updateVolume);
volSlider.addEventListener('input', ()=> {
    updateVolume();
    if(Number(volSlider.value) > 0 && bgm.muted ){
        applyMute(false)
    }
})
applyMute(get('muted'))
volSlider.value = get('volume')
updateVolume()

//dialog
//  List dialog 

//1. intro
const introDialog = [
    {potrait: '/Graphics/Faces/niko_distressed.png', text: '. . .'},
    {potrait: '/Graphics/Faces/niko4.png', text: 'this dream again, i guess i really miss god huh'},
    {potrait: '/Graphics/Faces/niko_yawn.png', text: 'huaammm'},
    {potrait: '/Graphics/Faces/niko5.png', text: 'hmm. .'},
    {potrait: '/Graphics/Faces/niko6.png', text: 'hmm. .'},
    {potrait: '/Graphics/Faces/niko_pancakes.png', text: 'Mom !'},
    {potrait: '', text: '. . .'},
    {potrait: '/Graphics/Faces/niko_what.png', text: 'i wonder where is she'},
    {potrait: '/Graphics/Faces/niko_shock.png', text: '!?'},
    {potrait: '/Graphics/Faces/niko_surprised.png', text: 'there is something in computer'},
]


powerBtn.addEventListener('click', async () => {
    powerBtn.classList.add('lit');
    bgm.play().catch(() => {});
    await sleep(600);
    powerBtn.hidden = true;
    bootBulb.hidden = false
    bootBulb.classList.add('flicker');
    await sleep(2000);
    bootBulb.classList.remove('flicker');
    bootBulb.classList.add('lit');
    bootBulb.classList.add('docked')
    await runBootLog()
    await sleep(500)
    bootScreen.hidden = true;
    const name = await showLogin();
    introTitle.textContent = `Welcome, ${name}`
    showDesktop();
})

