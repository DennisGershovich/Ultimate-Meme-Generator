'use strict'

function init(){
    renderImages(gImgs)
}

function onEditMeme(el){
    document.body.classList.toggle("editor-open")
    if(el){
        // const imageId =  +el.dataset.id
        const img = el.querySelector('img')
        _createMeme(img)
        renderMeme() 
    }

}

function onInputText(el){
    writeOnImage(el)
}

function onMoveText(direction){
    moveText(direction.value)
}

function onAddMemeText(){
    const txt = document.querySelector('.input').value
    if(txt) addMemeText(txt)
    document.querySelector('.input').value = '' 
}

function onSwitchLines(){
    switchLines()
}

function onDeleteLine(){
    deleteLine() 
}

function onFontSize(size){
    changeFontSize(size)
}

function onColor(el){
    setColor(el.value)
}

function onAlignText(textAlign){
    alignText(textAlign)
}

function onStrokeColor(el){
    setStrokeColor(el.value)
}

function onFont(el){
    setFont(el.value)
}

function downloadCanvas(elLink) {
    const canvas = document.getElementById("my-canvas");
    const data = canvas.toDataURL();
    elLink.href = data;
    elLink.download = 'myMeme';
}

function onCloseShareModal(){
    document.querySelector('.share-modal').style.display = 'none'
}

function onToggleMenu(){
    document.querySelector('.main-header').classList.toggle('menu-open')
}

function onFilterImages(){
    var filterValue = document.querySelector(".imagesInput").value;
    console.log(filterValue)
    filterImages(filterValue)            

}