'use strict'
const gImgs = [
{id:1, url: 'img/meme-imgs (square)/1.jpg', keywords: ['funny', 'men']},
{id:2, url: 'img/meme-imgs (square)/2.jpg', keywords: ['cute', 'animal']},
{id:3, url: 'img/meme-imgs (square)/3.jpg', keywords: ['cute', 'animal']},
{id:4, url: 'img/meme-imgs (square)/4.jpg', keywords: ['cute', 'animal']},
{id:5, url: 'img/meme-imgs (square)/5.jpg', keywords: ['funny', 'baby']},
{id:6, url: 'img/meme-imgs (square)/6.jpg', keywords: ['funny', 'men']},
{id:7, url: 'img/meme-imgs (square)/7.jpg', keywords: ['funny', 'baby']},
{id:8, url: 'img/meme-imgs (square)/8.jpg', keywords: ['funny', 'men']},
{id:9, url: 'img/meme-imgs (square)/9.jpg', keywords: ['funny', 'men']},
{id:10, url: 'img/meme-imgs (square)/10.jpg', keywords: ['funny', 'men']},
{id:11, url: 'img/meme-imgs (square)/11.jpg', keywords: ['sport', 'men']},
{id:12, url: 'img/meme-imgs (square)/12.jpg', keywords: ['funny', 'men']},
{id:13, url: 'img/meme-imgs (square)/13.jpg', keywords: ['drink', 'men']},
{id:14, url: 'img/meme-imgs (square)/14.jpg', keywords: ['movie', 'men']},
{id:15, url: 'img/meme-imgs (square)/15.jpg', keywords: ['funny', 'men']},
{id:16, url: 'img/meme-imgs (square)/16.jpg', keywords: ['funny', 'men']},
{id:17, url: 'img/meme-imgs (square)/17.jpg', keywords: ['scary', 'men']},
{id:18, url: 'img/meme-imgs (square)/18.jpg', keywords: ['movie', 'toy']},
]
let ctx
let gMeme = []
let currentMemeIdx = -1 
let gMemeLine = 0
let isEditLine = false
let gFilterImages

function renderImages(arr){
    const grid = document.querySelector('.cards-grid')
    let htmlStr = ''
    htmlStr = arr.map(image => `
        <div class="box" onclick="onEditMeme(this)" data-id = "${ image.id }" >
            <img src="${image.url}">
        </div>
    `)
    grid.innerHTML = htmlStr.join('')
}

function renderMeme(){
    //render selected image into meme editor 
   renderMemeEditor()
  // gMeme.selectedImg = image
   renderMemeOnCanvas()
}

function renderMemeEditor(){
    const canvasContainerEl = document.querySelector('.meme-editor')
    let htmlStr = `
        <button class='mobile-close-btn' onclick="onEditMeme()">x</button>
        <div class="canvas-container">
           <canvas id="my-canvas" width="500" height="500"">
        </div>
        <div class="meme-editor-controllers">
            <input type="text" onkeyup="onInputText(this)" class="input" placeholder="Text line...">
            <input type='button' class='btn' value='add' onclick="onAddMemeText()" style='cursor: pointer'>
            <div class="controls-btns">
            <button class="btn" value="down" onclick="onMoveText(this)">&#8595;</button>
            <button class="btn" value="up" onclick="onMoveText(this)">&#8593;</button>
            <button class="btn" onclick="onSwitchLines()">&#8595; edit &#8593;</button>
            <button class="btn" onclick="onDeleteLine()">&#128465;</button>
            </div>
            <div class="style-btns">
            <button class="btn" onclick="onFontSize('increase')">A+</button>
            <button class="btn" onclick="onFontSize('decrease')">A-</button>
            <button class="btn" onclick="onAlignText('start')">&#8592;</button>
            <button class="btn" onclick="onAlignText('center')">=</button>
            <button class="btn" onclick="onAlignText('end')">&#8594;</button>
            <div class=colors-continer>
            <label class="stroke-color-btn" for="create-color">
                <i >S</i>
                <input type="color" id="create-color" onchange="onStrokeColor(this)" style="display: none">
            </label>
            <input class="color-input" type="color" onchange="onColor(this)" style='cursor: pointer'>
            <select class="font-select" onchange='onFont(this)'>
                <option value='impact'>Impact</option>
                <option value='arial'>Arial</option>
                <option value='verdana'>Verdana</option>
            </select>
            </div>
            </div>
            <div class="data-btns">
             <button class="btn" onclick="uploadImg()">share</button>  
             <button class="btn"><a href="#" onclick="downloadCanvas(this)" download="myMeme">Download</a></button>
             <button class="btn" onclick="saveMeme()">save</button> 
            </div>
        </div>
    `
    canvasContainerEl.innerHTML = htmlStr
}

function renderMemeOnCanvas(){
    var canvas = document.getElementById("my-canvas");
    ctx = canvas.getContext("2d");
    ctx.drawImage(gMeme[currentMemeIdx].selectedImg, 0,0);
}

function renderTxt(){
    ctx.clearRect(0, 0, 500, 500)
    ctx.drawImage(gMeme[currentMemeIdx].selectedImg, 0,0);
    gMeme[currentMemeIdx].lines.forEach(line => {
    ctx.strokeStyle = line.strokeColor;
    ctx.fillStyle = line.color
    ctx.font = `${line.size}px ${line.font} `; 
    ctx.lineWidth = 5;
    ctx.strokeText(line.txt, line.dx, line.dy);
    ctx.fillText( line.txt, line.dx, line.dy)
    } )
}

function writeOnImage(el){
   //if(ev.key === 'Enter')onAddMemeText()
    var canvas = document.getElementById("my-canvas");
    if( gMeme[currentMemeIdx].lines.length === 0)_createNewMemeLine()
     if(gMeme[currentMemeIdx].lines.length === 2){
        gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].dy = canvas.height - 50
     }
    gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].txt = el.value
    //gMeme[currentMemeIdx].selectedLineIdx
    renderTxt()
}

function moveText(direction){
    var canvas = document.getElementById("my-canvas");
    if(isEditLine){
        if(direction === 'up' && gMeme[currentMemeIdx].lines[gMemeLine - 1].dy >
            0 + gMeme[currentMemeIdx].lines[gMemeLine - 1].size){
            gMeme[currentMemeIdx].lines[gMemeLine - 1].dy -= 10      
            const dy = gMeme[currentMemeIdx].lines[gMemeLine - 1].dy
            const size = gMeme[currentMemeIdx].lines[gMemeLine - 1].size
            renderTxt()
            drawBorderLine(dy,size,canvas)
            return 
        }
        if(direction === 'down' && gMeme[currentMemeIdx].lines[gMemeLine - 1].dy <
             canvas.height - gMeme[currentMemeIdx].lines[gMemeLine - 1].size){
            gMeme[currentMemeIdx].lines[gMemeLine - 1].dy += 10
            const dy = gMeme[currentMemeIdx].lines[gMemeLine - 1].dy
            const size = gMeme[currentMemeIdx].lines[gMemeLine - 1].size
            renderTxt()
            ctx.beginPath();
            ctx.rect(0,dy - size + 2,canvas.width,size)
            ctx.stroke()
            return
        } 
    }     
    if(direction === 'up' && gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].dy >
       0 + gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].size ){  
       gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].dy -= 10
       renderTxt()
    }if(direction === 'down' && gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].dy < 
    canvas.height - gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].size){  
      gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].dy += 10
       renderTxt()
    }
}

function addMemeText(txt){
    gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1].txt = txt
    gMeme[currentMemeIdx].selectedLineIdx += 1
    _createNewMemeLine()
}

function changeFontSize(size){
  const canvas = document.getElementById("my-canvas")
  if(isEditLine){
    if(size === 'increase'){
        gMeme[currentMemeIdx].lines[gMemeLine - 1].size += 10
        const dy = gMeme[currentMemeIdx].lines[gMemeLine - 1].dy
        const lineSize = gMeme[currentMemeIdx].lines[gMemeLine - 1].size
        renderTxt()
        drawBorderLine(dy,lineSize,canvas)
        return 
    }if(size === 'decrease' && gMeme[currentMemeIdx].lines[gMemeLine - 1].size > 10){
        gMeme[currentMemeIdx].lines[gMemeLine - 1].size -= 10
        const dy = gMeme[currentMemeIdx].lines[gMemeLine - 1].dy
        const lineSize = gMeme[currentMemeIdx].lines[gMemeLine - 1].size
        renderTxt()
        drawBorderLine(dy,lineSize,canvas)
        return  
  }} 
  const fontSize = gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].selectedLineIdx].size
  if(size === 'increase'){
    gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].selectedLineIdx].size += 10
    renderTxt()
  }if(size === 'decrease' && fontSize > 10){
     gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].selectedLineIdx].size -= 10
     renderTxt()    
  }
 
}

function switchLines(){  
                       
    if(gMemeLine < gMeme[currentMemeIdx].lines.length - 1){
        isEditLine = true
        renderTxt()
        let dy = gMeme[currentMemeIdx].lines[gMemeLine].dy
        let size = gMeme[currentMemeIdx].lines[gMemeLine].size
        const canvas = document.getElementById("my-canvas")
        drawBorderLine(dy,size,canvas)

        gMemeLine += 1
    }
    else{
        gMemeLine = 0
         isEditLine = false
        renderTxt()
       
    }
}

function setColor(color){
    if(isEditLine){
        gMeme[currentMemeIdx].lines[gMemeLine - 1].color = color
        const dy = gMeme[currentMemeIdx].lines[gMemeLine - 1].dy
        const size = gMeme[currentMemeIdx].lines[gMemeLine - 1].size
        const canvas = document.getElementById("my-canvas")
        renderTxt()
        drawBorderLine(dy,size,canvas)
        return 
    }
    gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].selectedLineIdx].color = color
    renderTxt()
}

function deleteLine(){
   if(!isEditLine) return  
   const gLine = gMeme[currentMemeIdx].lines[gMemeLine - 1]
   const lineIdx = gMeme[currentMemeIdx].lines.findIndex(line => line === gLine)
   gMeme[currentMemeIdx].lines.splice(lineIdx,1)
   isEditLine = false
   renderTxt()
   gMemeLine -= 1
} 

function _createMeme(image){
    gMeme.push(
    {
    selectedImg: image,
    selectedLineIdx: 0,
    lines: []
    })
    currentMemeIdx += 1
}

function _createNewMemeLine(){
    const line = {
        txt: '',
        dx:50,
        dy:80,
        size: 50,
        align: 'left',
        color: 'white',
        isFocus:false,
        strokeColor:'black',
        font:'impact'
    }
    gMeme[currentMemeIdx].lines.push(line)
}

function drawBorderLine(dy,size,canvas){
        ctx.beginPath();
        ctx.rect(0,dy-size + 5,canvas.width,size)
        ctx.stroke()
}

function alignText(textAlign){
    var canvas = document.getElementById("my-canvas")
    let selctedLine = gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].lines.length - 1]
    if(isEditLine) selctedLine = gMeme[currentMemeIdx].lines[gMemeLine - 1]
    switch(textAlign){
        case 'start':
        selctedLine.dx = selctedLine.size
        renderTxt()
        if(isEditLine)drawBorderLine(selctedLine.dy,selctedLine.size,canvas)
        break
        case 'center':
        selctedLine.dx = (canvas.width / 2) - selctedLine.size
        renderTxt()
        if(isEditLine)drawBorderLine(selctedLine.dy,selctedLine.size,canvas)
        break
        case 'end':
        selctedLine.dx = (canvas.width / 2) + selctedLine.size
        renderTxt()
        if(isEditLine)drawBorderLine(selctedLine.dy,selctedLine.size,canvas)
        break
    }
}

function setStrokeColor(color){
    if(isEditLine){
        gMeme[currentMemeIdx].lines[gMemeLine - 1].color = color
        const dy = gMeme[currentMemeIdx].lines[gMemeLine - 1].dy
        const size = gMeme[currentMemeIdx].lines[gMemeLine - 1].size
        const canvas = document.getElementById("my-canvas")
        renderTxt()
        drawBorderLine(dy,size,canvas)
        return 
    }
    gMeme[currentMemeIdx].lines[gMeme[currentMemeIdx].selectedLineIdx].strokeColor = color
    renderTxt()
}

function setFont (font){
    gMeme[currentMemeIdx].lines.forEach(line => line.font = font)
    renderTxt()
}

function filterImages(value){
    gFilterImages = gImgs.filter(img => img.keywords.some(key => key === value))
    renderImages(gFilterImages)
}