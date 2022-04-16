'use strict'
const KEY ='memesDB'
const gMemes = []

function uploadImg() {
    document.querySelector('.share-modal').style.display = 'block'
    const canvas = document.getElementById("my-canvas");
    const imgDataUrl = canvas.toDataURL("image/jpeg");
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    
      // document.querySelector('.user-msg').innerText = `Your photo is available here: ${uploadedImgUrl}`
      // console.log(`Your photo is available here: ${uploadedImgUrl}`)

        document.querySelector('.share-modal').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share on Facebook   
        </a>
        <p>
            Your photo is available here: ${uploadedImgUrl}
        </p>
        <button class='btn' onclick='onCloseShareModal()'>X</button>
        `
    }
    doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData();
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.text())
        .then((url) => {
            console.log('Got back live url:', url);
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}

function saveMeme(){
    document.querySelector('.share-modal').style.display = 'block'
    const canvas = document.getElementById("my-canvas");
    const imgDataUrl = canvas.toDataURL("image/jpeg");
    gMemes.push(imgDataUrl.replace(/^data:image\/(png|jpg);base64,/, "")) 
    saveToStorage(KEY, gMemes)
    document.querySelector('.share-modal').innerHTML = `
        <h3>
            meme saved
        </h3>
        <button class='btn' onclick='onCloseShareModal()'>X</button>
        `
}