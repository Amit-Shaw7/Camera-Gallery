let db;
let openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success" , (e) => {
    console.log("DB Success")
    db = openRequest.result;
});

openRequest.addEventListener("error" , (e) => {
    console.log("DB error")
});

openRequest.addEventListener("upgradeneeded" , (e) => {
    console.log("DB upgradeneeded");

    db = openRequest.result;

    // Do objectStore banaye ek image ke liye aur ek video ke liye
    db.createObjectStore("video", {keyPath : "id"}); // id se pakar ke layega
    db.createObjectStore("image", {keyPath : "id"}); // id se pakar ke layega

})