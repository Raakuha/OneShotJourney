import { get, set } from "./save.js";

export function showLogin(){
    const loginPage = document.getElementById('login');
    const loginForm = document.getElementById('login-form');
    const loginName = document.getElementById('login-name');
    const loginGreet = document.getElementById('login-greet');
    const loginButton = document.getElementById('login-notyou');
    
    
    loginPage.hidden = false;
    const known  = get('name');
    function askName(text = 'Who is there?'){
        loginGreet.textContent = text;
        loginName.hidden = false;
        loginName.value = '';
        loginButton.hidden = true;
        loginName.focus();

    }
    if(known){
        loginGreet.textContent = `Welcome Back, ${known}`;
        loginName.hidden = true;
        loginButton.hidden = false;
        loginForm.querySelector('[type=submit]').focus()
    }else{
        askName();
    }

    loginButton.onclick = () => askName('Then, who is there?')
    return new Promise(resolve => {
        loginForm.onsubmit = (e) =>{
            e.preventDefault()
            const name = loginName.hidden ? known : loginName.value.trim();
            if(!name){
                return;
            }
            set('name', name);
            loginPage.hidden = true;
            resolve(name);
        }
    })
}