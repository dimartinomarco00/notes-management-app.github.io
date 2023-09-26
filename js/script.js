
"use strict";

const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = document.querySelector(".popup-box header p");
const closeIcon = document.querySelector(".popup-box header .fa-xmark");
const titleTag = document.querySelector("input");
const descTag = document.querySelector("textarea");
const addBtn = document.querySelector(".popup-box button");

/*
    ottiene le note della memoria locale, se esistono, 
    e le analizza in un oggetto, altrimenti passa un array vuoto alle note.
*/
const notes = JSON.parse(localStorage.getItem("notes") || "[]");

const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
                "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];


// Quando faccio clic sul pulsante di aggiornamento, crea una nuova nota invece di annullarla.
let isUpdate = false;
let updateId;

addBox.addEventListener('click', function()
{
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener('click', function()
{
    /* 
        Una volta che la nota è stata aggiornata, dobbiamo impostare il valore isUpdate a false, 
        perché quando l'utente tenta di aggiungere una nuova nota, 
        la precedente nota aggiornata sarà sostituita da quella nuova.
    */
    isUpdate = false;

    titleTag.value = "";
    descTag.value = "";

    addBtn.innerText = "Aggiungi nota";
    popupTitle.innerHTML = "Aggiungi una nuova nota";
    
    popupBox.classList.remove("show");
});

addBtn.addEventListener('click', function(event)
{
    event.preventDefault();

    let noteTitle = titleTag.value;
    let noteDesc = descTag.value;

    if(noteTitle || noteDesc)// se si fa click sul pulsante addbtn quando noteTitle e noteDesc sono no hanno nessun valore
    {
        //ricevi il giorno, mese e anno dalla data corrente
        let data = new Date();

        let anno = data.getFullYear();
        let mese = mesi[data.getMonth()];
        let giorno = data.getDate();

        let noteInfo = 
        {
            title : noteTitle,
            description : noteDesc,
            data : giorno + " " + mese + " " + anno
        }

        if(!isUpdate) { notes.push(noteInfo); } // aggiunta di una nuova nota alle note
        else 
        { 
            /* 
               Una volta che la nota è stata aggiornata, dobbiamo impostare il valore isUpdate a false, 
               perché quando l'utente tenta di aggiungere una nuova nota, 
               la precedente nota aggiornata sarà sostituita da quella nuova.
            */
            isUpdate = false;
            notes[updateId] = noteInfo; // aggiornamento della nota specificata
        }


        //Dobbiamo convertire l'oggetto in stringa per memorizzarlo nella memoria locale.
        localStorage.setItem("notes", JSON.stringify(notes)); //salva le note nel localStorage

        closeIcon.click();

        showNotes();
    }
});


function showNotes()
{
    //perchè altrimenti all' inserimento di una nuova nota, viene aggiunta oltre alla nuova anche la precedente inserita se presente
    document.querySelectorAll(".note").forEach(function(nota) { nota.remove(); });

    notes.forEach(function(nota, index)
    {
        let liTag = 
        `<li class="note">
            <div class="details">
                <p>${nota.title}</p>
                <span>${nota.description}</span>
            </div>

            <div class="bottom-content">
                <span>${nota.data}</span>

                <div class="settings">
                    <i class="fa-solid fa-ellipsis" onclick="showMenu(this)"></i>

                    <ul class="menu">
                        <li onclick="updateNote(${index}, '${nota.title}', '${nota.description}')"><i class="fa-solid fa-pen"></i>Modifica</li>
                        <li onclick="deleteNote(${index})"><i class="fa-solid fa-trash"></i>Elimina</li>
                    </ul>
                </div>
            </div>
        </li>`;

        addBox.insertAdjacentHTML("afterend", liTag);
    });
} 

showNotes();


function showMenu(item)
{
    item.parentElement.classList.add("show");

    document.addEventListener("click", function(event)
    {
        //event.target.tagName restituisce l' elemento html che ha scatenato l' evento in maiuscolo
        if(event.target.tagName != "I" || event.target != item)
        {
            //rimozione la classe show dal menu delle impostazioni al clic sul document
            item.parentElement.classList.remove("show");
        }
    });
}


function deleteNote(noteId)
{
    let confirmDelete = confirm("Sei sicuro di voler eliminare questa nota?");

    if(!confirmDelete)
        return;

    notes.splice(noteId, 1); //rimuove le note selezionate dall' array/tasks
    localStorage.setItem("notes", JSON.stringify(notes)); //salva le note aggiornate nel localStorage

    showNotes();
}

function updateNote(noteId, title, description)
{
    isUpdate = true;
    updateId = noteId;

    addBox.click();

    titleTag.value = title;
    descTag.value = description;

    addBtn.innerText = "Modifica nota";
    popupTitle.innerHTML = "Modifica nota";

    //console.log(noteId, title, description);
}