const KEY = 'osj.save'
const defaults = {
    volume: 50,
    muted: false,
    name: '',
    iconPos:{},
}


function load(){
    try {
        const raw = localStorage.getItem(KEY);
        if(raw === null){
            return {...defaults}
        }
        return {...defaults,...JSON.parse(raw)}
        
    } catch (error) {
        return{...defaults}
    }
}

let state = load();

export function get(key){
    return state[key];  
}


export function set(key, value){
    state[key] = value;
    try {
        localStorage.setItem(KEY, JSON.stringify(state))
    } catch (error) {
        
    }
}