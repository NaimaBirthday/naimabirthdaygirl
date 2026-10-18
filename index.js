let song = document.getElementById("song");
let btn = document.getElementById("btn")
let playtime = document.getElementById("playtime")

btn.addEventListener("click", function () {
    if(song.paused){
        btn.innerHTML = "&#9208;"
        song.play()
}                       
        else {
                btn.innerHTML = "&#9654;"
            song.pause()
        }
    }); 


song.addEventListener("timeupdate", function () {
    let minutes = Math.floor(song.currentTime / 60);
    let seconds = Math.floor(song.currentTime % 60);

    playtime.textContent =
        `${minutes}:${String(seconds).padStart(2, "0")}`;
});

let songphoto = document.getElementById("songimage");


song.addEventListener("play", function () {
    songphoto.classList.add("rotating");
    songphoto.classList.remove("paused");
});

song.addEventListener("pause", function () {
    songphoto.classList.add("paused");
});


window.addEventListener("load", function () {
    let loader = document.getElementById("loader");

    setTimeout(function () {
        loader.classList.add("hidden");
    }, 100);
});