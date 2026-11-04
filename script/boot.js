export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function readDevice(){
    return{
        width : Math.round(screen.width * devicePixelRatio),
        height: Math.round(screen.height * devicePixelRatio),
        scale : devicePixelRatio,
        cores : navigator.hardwareConcurrency ?? '?',
        lang  : navigator.language,
        time  : new Date().toLocaleTimeString() 
    }
}

function buildBootDevices(d){
    return[
        {text: 'TWMBIOS (C) 2026 RAKUHA INTERPRICE, INC',  wait:300},
        {text: '',  wait: 100},
        {text: `SUN-0826 WEB BIOS Revision 1.0`,  wait: 100},
        {text: `CPU : ${d.cores} CORES @ 1 SUN`,  wait: 200},
        {text: `Display: ${d.width}x${d.height}  @ ${d.scale}x`, wait : 200},
        {text: `LANGUANGE : ${d.lang}`, wait : 200},
        {text: `TIME : ${d.time}`, wait : 200},
        {text: '',  wait: 100},
        {text: `CHECKING LPRAM`, dots:3 ,  wait: 400},
        {text: `OK` ,  wait: 100},
        {text: `` ,  wait: 100},
        {text: `SCANNING IMAGE` , dots: 7,  wait: 600},
        {text: `SCAN COMPLETE ` ,   wait: 100},
        {text: `LOADING SOUND: ` ,   wait: 150},
        {text: `SOUND OK` ,   wait: 150},
        {text: `` ,   wait: 50},
        {text: `SEARCHING GOD: ` ,   wait: 200},
        {text: `1 FOUND` ,   wait: 200},


    ]
}


export async function runBootLog(){
    const bLog = document.getElementById('boot-log');
    const lines = buildBootDevices(readDevice());
    
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