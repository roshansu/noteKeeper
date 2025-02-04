
const size = document.querySelector('.bottom');
const rightButton = document.querySelectorAll('.button');
const addButton = document.getElementById('add');
const root = document.querySelector('.content');
const main = document.querySelector('.main');
const noteArea = document.querySelector('.notearea');
const displayEmail = document.querySelector('.email');
const editor = document.getElementById('editor');


import {getDatabase, get, ref, set, push, update} from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js'
const firebaseConfig = {
  apiKey: "AIzaSyDL0lyxj68tsDvZcU8ybf2GoyeQ9r_2WaA",
  authDomain: "app-b571f.firebaseapp.com",
  databaseURL: "https://app-b571f-default-rtdb.firebaseio.com",
  projectId: "app-b571f",
  storageBucket: "app-b571f.firebasestorage.app",
  messagingSenderId: "318132111266",
  appId: "1:318132111266:web:95fd394b86704dcf2d14fb"
};

const app = initializeApp(firebaseConfig);
export function getUserData() {
    return localStorage.getItem("userEmail");
}

let userEmail = getUserData();
console.log(userEmail);
displayEmail.innerHTML = userEmail;
let prevData = {};
let finalData = {};
let id = 0;
let title = "";
let saveNo = 0;
let append = false;
let r = false;

function getUserNotes(userEmail) {
    if (!userEmail) {
        alert("Error: User email is missing.");
        return;
    }

    const db = getDatabase();
    const sanitizedEmail = userEmail.replace(/\./g, "_");
    const userRef = ref(db, `data/${sanitizedEmail}`);

    get(userRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val);
                convertKeysToSequence(snapshot.val());
            } else {
                console.log("No notes found for this user.");
                append = true;
            }
        })
        .catch((error) => {
            console.error("Error fetching notes:", error);
        });
}

function convertKeysToSequence(data) {
    let newObject = {};
    let count = 1;
    saveNo = Object.keys(data).length;
    id = saveNo;

   for(let [key, item] of Object.entries(data)){
        newObject[count] = item;
        newObject[count]['key'] = key;
        createNoteCard(newObject[count].name, count, newObject[count].password, newObject[count]);
        count++;
   }
    
    return newObject;
}

getUserNotes(userEmail);

console.log(prevData);

function saveData() {

    const db = getDatabase();
    console.log(userEmail);
    const sanitizedEmail = userEmail.replace(/\./g, "_");
    const notesRef = ref(db, `data/${sanitizedEmail}`);
    const newNoteRef = push(notesRef);
    prevData[id].key = newNoteRef.key;
    set(newNoteRef, {
        password: finalData[id].password || "",
        name: finalData[id].name,
        content: finalData[id].content
    })
    .then(() => console.log("Note saved successfully!"))
    .catch((error) => alert("Error: " + error.message));
}

function updateData(key, newData) {
    const db = getDatabase();
    const userRef = ref(db, `data/${userEmail.replace(/\./g, '_')}/${key}`);

    update(userRef, newData)
        .then(() => console.log("Data updated successfully"))
        .catch(error => console.error("Error updating data:", error));
}

addButton.addEventListener('click',()=>{
   title = document.getElementById('title').value;
    if(title === ""){
        alert("name cannot be null");
        return;
    }


    id++;
    document.getElementById('title').value = "";
    finalData[id] = {};
    finalData[id] = {
        name:"",
        password: '',
        content:"Start writing",
        key:""
    };
    prevData[id] = {};
    prevData[id] = finalData[id];
    finalData[id].name = title;
    createNoteCard(title, id, finalData[id].password, {});
})

function createNoteCard(t, id, pass, obj){
    if(Object.keys(obj).length > 0){
        prevData[id] = obj;
    }

    const div = document.createElement('div');
    div.classList.add('lock');
    div.id = id;
    div.innerHTML = `<p id="${id}a"  class="note-card">${t}</p>`;
    root.appendChild(div);
    checkLock(pass, id);
}

function checkLock(pass, id){
    if(pass != ''){
        const i = document.createElement('i');
        i.classList.add('fa-solid', 'fa-lock');
        const child = document.getElementById(`${id}a`).classList.add('locked');
        document.getElementById(`${id}a`).parentElement.appendChild(i);
    }
}

document.getElementById('bar-open').addEventListener('click', ()=>{
    document.querySelector('.right').style.display = 'flex';
    document.getElementById('bar-open').style.display = 'none';
    document.getElementById('bar-close').style.display = 'flex';
    document.getElementById('bar-close').removeEventListener('click', closeBar)
    document.getElementById('bar-close').addEventListener('click', closeBar)
    
})

function closeBar(){
    document.querySelector('.right').style.display = 'none';
    document.getElementById('bar-open').style.display = 'flex';
    document.getElementById('bar-close').style.display = 'none';
}

size.addEventListener('click',(event)=>{
    const note_size = document.querySelectorAll('.lock');
    if(event.target.classList.contains('button')){
        removeActive();
       const e =  document.getElementById(event.target.id);
       e.classList.add('active');

        note_size.forEach((element)=>{
            element.style.height = event.target.id;
            element.style.width = event.target.id;
        })
    }
})

function removeActive(){
    rightButton.forEach((e)=>{
        if(e.classList.contains('active')){
            e.classList.remove('active');
        }
    })
}

let eventId = 0;

root.addEventListener('click', (event)=>{
    eventId = event.target.id;
    if((event.target.classList.contains('content'))){
        return;
    }
        if(append){
            editor.innerHTML = finalData[eventId].content;
        }
        else if(prevData[eventId].content != " "){
            editor.innerHTML = prevData[eventId].content;
        }

    if(prevData[eventId].password != ''){
        openPass();
        document.querySelector('.close').removeEventListener('click', closePass);
        document.querySelector('.close').addEventListener('click', closePass);
        validatePassword(eventId);
        return;
    }

    gotoNote();

});

function validatePassword(id){
    const pass = prevData[id].password;

    document.getElementById('view').addEventListener('click',()=>{
        const currPass = getPass();
        if(pass === currPass){
            closePass();
            gotoNote();
            return;            
        }else
        alert('wrong password');
        return;
    })
        
}

function closePass(){
    main.classList.remove('blur');
    document.querySelector('.unlock').style.display = 'none';
}

function openPass(){
    main.classList.add('blur');
    document.querySelector('.unlock').style.display = 'flex';
}

function gotoNote(){
    main.style.display = 'none';
    noteArea.style.display = 'flex';
}

document.getElementById('lock-note').addEventListener('click',()=>{
    if(prevData[eventId].password != ''){
        alert('password is already set');
        return;
    }
    openPass();
    setPass();
    document.querySelector('.close').removeEventListener('click', closePass);
    document.querySelector('.close').addEventListener('click', closePass);
})


function setPass(){
    document.getElementById('view').addEventListener('click',()=>{
        const currPass = getPass(); 
        if(currPass.length < 4 ){
            alert('password must be greater or equal to 4');  
            return;       
        }else
        alert('successful');
        prevData[eventId].password = currPass;
        removePassDb();
        
        return;
    })
        
}

function removePassDb(){
    let newData = {
        password:"",
        name:"",
        content:""
    };

    newData.password = prevData[eventId].password;
    newData.name = prevData[eventId].name;
    newData.content = prevData[eventId].content;
    updateData(prevData[eventId].key, newData);
}

function getPass(){
    return document.getElementById('lock-pass').value;
    
}

document.getElementById('back').addEventListener('click',()=>{
    const value = editor.innerHTML;

    checkLock(prevData[eventId].password, eventId);

    noteArea.style.display = 'none';
    main.style.display = 'flex';
    if(Object.keys(prevData).length > saveNo){
        saveNo++;
        finalData[id].content = value;
        prevData[id] = {};
        prevData[id] = finalData[id];
        saveData();
    }
    let prevVal = prevData[eventId].content;
    if(value.length != prevVal.length){
        prevData[eventId].content = value;
        let newData = {
            password:"",
            name:"",
            content:""
        };

        newData.password = prevData[eventId].password;
        newData.name = prevData[eventId].name;
        newData.content = prevData[eventId].content;
        updateData(prevData[eventId].key, newData);
    }
})

