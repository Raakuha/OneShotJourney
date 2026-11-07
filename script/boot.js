export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function cleanGPU(raw) {
    const match = raw.match(/ANGLE \([^,]+, ([^(,]+)/)
    return (match ? match[1] : raw).trim()
}

function readGPU() {
    try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl')
        if (!gl) return 'UNKNOWN'

        const ext = gl.getExtension('WEBGL_debug_renderer_info')
        const raw = ext
            ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
            : gl.getParameter(gl.RENDERER)

        return cleanGPU(raw)
    } catch {
        return 'UNKNOWN'
    }
}
async function readDevice(){
    const battery = await navigator.getBattery?.()
    const infoOS =
            await navigator.userAgentData?.getHighEntropyValues(['platformVersion', 'architecture', 'bitness'])
    const infoGPU = readGPU()
    return{
        width    : Math.round(screen.width * devicePixelRatio),
        height   : Math.round(screen.height * devicePixelRatio),
        scale    : devicePixelRatio,
        cores    : navigator.hardwareConcurrency ?? '?',
        lang     : navigator.language,
        time     : new Date().toLocaleTimeString(),
        gpu      : infoGPU,
        os       : navigator.userAgentData?.platform ?? 'UNKNOWN',
        osVersion: infoOS?.platformVersion,
        arch     : infoOS ? `${infoOS.architecture}-${infoOS.bitness}` : 'UNKNOWN',
        battery  : battery,
        timezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
        touch    : navigator.maxTouchPoints > 0,
        mobile   : navigator.userAgentData?.mobile ?? false,
    }
}
function osName(d){
    if (d.os === 'Windows' && d.osVersion) {
        return parseInt(d.osVersion) >= 13 ? 'WINDOWS 11' : 'WINDOWS 10'
    }
    return d.os.toUpperCase()
}

function guessChassis(d){
    if (d.mobile) return 'HANDHELD UNIT (MOBILE)'
    if (/laptop|mobile|max-q/i.test(d.gpu)) return 'PORTABLE UNIT (LAPTOP)'
    if (d.battery && (!d.battery.charging || d.battery.level < 1)) return 'PORTABLE UNIT (LAPTOP)'
    if (d.touch) return 'TOUCH UNIT (TABLET?)'
    return 'STATIONARY UNIT (DESKTOP?)'
}

function powerLine(battery){
    if (!battery || (battery.charging && battery.level === 1)) return 'AC POWER'
    const percent = Math.round(battery.level * 100)
    return `BATTERY ${percent}% ${battery.charging ? 'CHARGING' : 'DISCHARGING'}`
}
function buildBootDevices(d){
    return[
        {text: 'TWMBIOS (C) 2026 RAKUHA ENTERPRISE, INC.', wait: 300},
        {text: '', wait: 100},
        {text: 'SUN-0826 WEB BIOS Revision 1.0', wait: 350},
        {text: `CHASSIS  : ${guessChassis(d)}`, wait: 340},
        {text: `OS       : ${osName(d)} ${d.arch.toUpperCase()}`, wait: 330},
        {text: `CPU      : ${d.cores} CORES @ 1 SUN`, wait: 330},
        {text: `GPU      : ${d.gpu.toUpperCase()}`, wait: 480},
        {text: `DISPLAY  : ${d.width}x${d.height} @ ${d.scale}x`, wait: 200},
        {text: `POWER    : ${powerLine(d.battery)}`, wait: 200},
        {text: `LANGUAGE : ${d.lang.toUpperCase()}`, wait: 200},
        {text: `REGION   : ${d.timezone.toUpperCase()}`, wait: 200},
        {text: `TIME     : ${d.time}`, wait: 200},
        {text: '', wait: 100},
        {text: 'CHECKING LPRAM', dots: 3, wait: 400},
        {text: 'OK', wait: 100},
        {text: '', wait: 100},
        {text: 'SCANNING IMAGE', dots: 7, wait: 600},
        {text: 'SCAN COMPLETE', wait: 100},
        {text: 'LOADING SOUND', dots: 3, wait: 250},
        {text: 'SOUND OK', wait: 250},
        {text: '', wait: 500},
        {text: 'SEARCHING GOD', dots: 7, dotDelay: 250, wait: 1200},
        {text: '1 FOUND', wait: 1000},
    ]
}

export async function runBootLog(){
    const bLog = document.getElementById('boot-log');
    const lines = buildBootDevices(await readDevice());
    
    for (const line of lines) {
        bLog.textContent += line.text ;

        const dots = line.dots ?? 0
        
        for(let i = 0; i < dots; i++){
            await sleep(line.dotDelay ??  150);
            bLog.textContent += '.';
        }
        bLog.textContent += '\n';

        await sleep(line.wait);        
    }
}
export async function powerOff() {
    // ambil elemen: #boot, #power, #boot-log, #sun, #desktop, #bgm
    const boot = document.getElementById('boot');
    const powerBtn = document.getElementById('power');
    const bootLog = document.getElementById('boot-log');
    const sunLamp = document.getElementById('sun');
    const dekstop = document.getElementById('desktop');
    const bgm = document.getElementById('bgm');

    
    // 1. sembunyikan desktop, tampilkan layar boot (hitam)
    //    tapi tombol power tetap disembunyikan, dan isi boot-log dikosongkan
    dekstop.hidden = true;
    boot.hidden =false;
    powerBtn.hidden = true;
    bootLog.textContent = '';

    // 2. hapus class 'docked' dari sun → bohlam kembali ke tengah
    sunLamp.classList.remove('docked');

    // 3. await sleep(800)                 ← sama dengan transition di CSS
    await sleep(800)
    // 4. hapus class 'lit' dari sun       → cahaya memudar
    sunLamp.classList.remove('lit');
    // 5. await sleep(600)
    await sleep(600);
    // 6. jeda sebentar dalam keadaan mati, misalnya await sleep(400)
    await sleep(400)
    // 7. sembunyikan sun
    sunLamp.hidden = true;
    // 8. hentikan musik: pause() dan currentTime = 0
    bgm.pause();
    bgm.currentTime = 0;

    // 9. siapkan tombol power: hapus class 'lit', tampilkan tombol
    powerBtn.classList.remove('lit');
    powerBtn.hidden = false;
}