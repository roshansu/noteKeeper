
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js'
const right = document.querySelector('.right');
const page = document.getElementById('page');
const login = document.querySelector('.login-page');
const signUp = document.querySelector('.signup-page');
const loginSubmit = document.getElementById('login-button');
const signSubmit = document.getElementById('sign-button');
let register = {
    
};

let loginData = {
};

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js'

const firebaseConfig = {
    apiKey: "AIzaSyDL0lyxj68tsDvZcU8ybf2GoyeQ9r_2WaA",
    authDomain: "app-b571f.firebaseapp.com",
    projectId: "app-b571f",
    storageBucket: "app-b571f.firebasestorage.app",
    messagingSenderId: "318132111266",
    appId: "1:318132111266:web:95fd394b86704dcf2d14fb",
    databaseURL: "https://app-b571f-default-rtdb.firebaseio.com/"
  };
  

const apps = initializeApp(firebaseConfig);

const auth = getAuth(apps);

const createuser = (email, password)=>{
    createUserWithEmailAndPassword(auth, email, password)
    .then((value)=>{ 
            console.log(value);
            alert("User Created, now login");
    }).catch(error=>{
        alert(error);
    });
}

const signinuser = (email, password)=>{
        signInWithEmailAndPassword(auth, email, password)
        .then((value)=>{
            alert("User Signed In"); 
            saveUserData(email);
            note();

        })
        .catch((error)=>alert(error)); 
}

function note(){
    window.open("/Secure-notes/src/note.html", "_blank");

}

right.addEventListener('click',(event)=>{
    console.log(event.target.id)
    if(event.target.id === 'log'){
        exit(signUp);
        loginPage();
    }

    if(event.target.id === 'sign'){
        exit(login)
        signUpPage();
    }
});


function loginPage(){
    console.log(login);
    page.style.display = 'flex';
    login.style.display = 'flex';

    login.addEventListener('submit', (event)=>{
        event.preventDefault();
        register['email'] = document.getElementById('email').value;
        register['password'] = document.getElementById('password').value;
        signinuser(register.email, register.password)
    })

}

function signUpPage(){
    page.style.display = 'flex';
    signUp.style.display = 'flex';

    signUp.addEventListener('submit',(event)=>{
        event.preventDefault()
        loginData['name'] = document.getElementById('name').value;
        loginData['email'] = document.getElementById('Remail').value;
        loginData['password'] = document.getElementById('Npassword').value;
        console.log(loginData);
        createuser(loginData.email, loginData.password);
    })
}

document.querySelector('.close').addEventListener('click',()=>{
    login.style.display = 'none';
    signUp.style.display = 'none';
    page.style.display = 'none';
})

function exit(element){
    console.log('exit')
    page.style.display = 'none';
    element.style.display = 'none';
}

export function saveUserData(email) {
    localStorage.setItem("userEmail", email);
}