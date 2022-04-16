'use strict'
const KEY ='memesDB'
let gMemes = []

function checkLocalStorage(){
    gMemes = loadFromStorage(KEY) 
}

function renderMyMemes(){
    if(gMemes){
    let htmlStr = ''
    htmlStr = gMemes.map((meme,idx) => `
        <div class="box">
            <img class='meme_${idx}' src='${meme}' />
            <button>
            <a href="${meme}"download> Download </a> 
            </button>
        </div>
    ` )
    document.querySelector(".my-memes-memes-container").innerHTML = htmlStr.join('')
    }else{
        document.querySelector(".my-memes-memes-container").innerHTML = 
        `<h1>no saved memes for display</h1>`
    }

}
