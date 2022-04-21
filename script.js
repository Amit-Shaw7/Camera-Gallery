let video = document.querySelector('video');

let recordBtnCont = document.querySelector('.record-btn-cont');
let recordBtn = document.querySelector('.record-btn');
let captureBtnCont = document.querySelector('.capture-btn-cont');
let captureBtn = document.querySelector('.capture-btn');
let transParentColor = 'transparent';

let recorder;
let recordFalg = false; // controls record start and end

// As we want both
let constraints = {
    audio: true,
    video: true,
}
let chunks = [];

// navigator -> global obj -> provides media device info
// navigator -> provides media device info
// mediaDevices -> acces all devices passed in a constraints and just leave rest task for getUserData()
// getUserData -> asks for camera and audio access
// stream -> keeps the output of media 
// video.src -> to display the media stored in stream

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;

    // MediaRecorder = Gives Access to recorder
    recorder = new MediaRecorder(stream);
    recorder.addEventListener('start', (e) => {
        // Data we get after recording is in chunks so we will collect that chunk and convert them to Video

        chunks = [];
    });

    recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data);
    });

    // When stopped recording add data to database -> video
    recorder.addEventListener('stop', (e) => {
        let blob = new Blob(chunks, { type: "video/mp4" });

        // Adding to DB
        if (db) {
            let videoID = shortid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoID}`,
                blobData: blob,
            }
            videStore.add(videoEntry);
        }


        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "Stream.mp4";
        // a.click();
    })
})

recordBtnCont.addEventListener('click', (e) => {
    /**
     *  Gives us promise i>e async code when all code runs then it will run
     * and if recorder is not initialized but click occurs then will get error as undefined 
     * Thats why checking 
     */
    if (!recorder) return;

    recordFalg = !recordFalg;

    if (recordFalg) {
        // Start and animate
        recorder.start();
        recordBtn.classList.add('scale-record');
        startTimer();
    } else {
        // End and stop animate
        recorder.stop();
        recordBtn.classList.remove('scale-record');
        stopTimer();
    }
    
});

captureBtn.addEventListener('click', (e) => {
    
    captureBtn.classList.add('scale-capture');
    let canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    //Filtering
    tool.fillStyle = transParentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    let imageURL = canvas.toDataURL();
    
    // Adding to DB
    if (db) {
        let imageID = shortid();
        let imageTransaction = db.transaction("image", "readwrite");
        let imageStore = imageTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }
    
})


let timer = document.querySelector('.timer');
let timerID;
let counter = 0;

function startTimer() {
    timer.style.display = 'block';
    timer.innerText = "00:00:00";
    function displayTimer() {
        counter++;
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600; // Seconds Left

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60; // Seconds Left

        let seconds = totalSeconds;

        /**
         * if hrs min sec < 10 it will show = 3:2:5
         * we have to avoid this situation
         */

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;

        timer.innerText = `${hours}:${minutes}:${seconds}`;
    }
    timerID = setInterval(displayTimer, 1000);
    counter = 0;
    /**
     * Har second me display timer fn() call hoga
     */
}

function stopTimer() {

    clearInterval(timerID)
    timer.innerText = "00:00:00";
    timer.style.display = 'none';
}

//  Filtering

let allFilters = document.querySelectorAll('.filter');
let filterLayer = document.querySelector('.filter-layer');

allFilters.forEach((filterElem) => {
    filterElem.addEventListener('click', (e) => {
        // Get style
        transParentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transParentColor;
    })
})
