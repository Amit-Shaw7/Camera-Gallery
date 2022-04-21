setTimeout(() => {
    if (db) {
        // Retrieve Video
        console.log("Hello From Gallery")
        let videoTransaction = db.transaction("video", "readonly")
        let videoStore = videoTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();

        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");

            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData)

                mediaElem.innerHTML = `
            <div class="media">
            <video autoplay loop src="${url}"></video>
            </div>
            <div class="actions-btn">
                <span class="material-icons delete">
                    delete
                </span>
                <span class="material-icons download">
                    file_download
                </span>
            </div>

            `
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener('click', deleteFunc);
    
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener('click', downloadFunc);

            });
        }

        // Retrivr Image
        let imageTransaction = db.transaction("image", "readonly")
        let imageStore = imageTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();

        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");

            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);
                let url = imageObj.url;

                mediaElem.innerHTML = `
            <div class="media">
            <img autoplay loop src="${url}"></img>
            </div>
            <div class="actions-btn">
                <span class="material-icons delete">
                    delete
                </span>
                <span class="material-icons download">
                    file_download
                </span>
            </div>
            `
                galleryCont.appendChild(mediaElem);

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener('click', deleteFunc);
                
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener('click', downloadFunc);
            });
        }
    }
    
}, 100)

// Actions btn listeners UI and DB 

function deleteFunc(e) {
    console.log("Delete Clicked");
    let id = e.target.parentElement.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        // search in video db
        let videoTransaction = db.transaction("video", "readwrite")
        let videoStore = videoTransaction.objectStore("video");

        videoStore.delete(id);

    } else if (type === "img") {
        let imageTransaction = db.transaction("image", "readwrite")
        let imageStore = imageTransaction.objectStore("image");
        imageStore.delete(id);
    }


    e.target.parentElement.parentElement.remove();
}
function downloadFunc(e) {
    console.log("Download Clicked");

    let id = e.target.parentElement.parentElement.getAttribute("id");
    let type = id.slice(0, 3);

    if (type === "vid") {
        let videoTransaction = db.transaction("video", "readwrite");
        let videoStore = videoTransaction.objectStore("video");

        let videoRequest = videoStore.get (id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            console.log(videoResult);

            let videoURL = URL.createObjectURL(videoResult.blobData)
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "Stream.mp4";
            a.click();
        }
    } else if (type === "img") {
        let imageTransaction = db.transaction("image", "readwrite");
        let imageStore = imageTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            console.log(imageResult);

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }
}