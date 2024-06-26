// /*** setup
const container = document.querySelector(".container");
const resultDiv = document.querySelector(".results");
const width = 15;

for (let i = 0; i < width * width; i++) {
    let square = document.createElement("div");
    container.append(square);
}

let squares = Array.from(document.querySelectorAll(".container div"));

const ppBtn = document.querySelector("#pause-button");
const sndBtn = document.querySelector("#sound-button");
const cntrlBtns = document.querySelectorAll(".controls button");
// setup ***/

// /*** game data 
let invaders = [];
let spaceship;
let lasersTemp = new Set();

let isPaused;
let goingRight;
let isSound;

let result;
let game;
init();
// game data ***/

// *** utils
// /*** *** game flow
function init() {
    invaders = shapes[Math.floor(Math.random() * shapes.length)];
    spaceship = width ** 2 - Math.ceil(width / 2);

    draw();
    squares[spaceship].classList.add("spaceship");

    goingRight = true;
    isSound = true;
    isPaused = true;
    result = 0;

    ppBtn.disabled = false;
    document.addEventListener("keydown", playPauseKey);

    playPause();
}

function play() {
    resultDiv.innerHTML = result;

    squares.reduce((lasers, square, id) =>
        square.classList.contains("laser") ? [...lasers, id] : lasers
        , [])
        .forEach(laser => { shoot(laser) });

    document.addEventListener("keydown", controls);
    let cntrls = [moveLeft, shoot, moveRight];
    cntrlBtns.forEach((btn, i) => btn.onclick = () => { cntrls[i](); });


    isPaused = false;
    return setInterval(moveInvaders, 400);
}

function pause() {
    clearInterval(game);
    lasersTemp.forEach(laserShot => { clearInterval(laserShot); });
    isPaused = true;

    document.removeEventListener("keydown", controls);
    cntrlBtns.forEach(btn => btn.onclick = "");


    resultDiv.innerHTML = "PAUSED";
}

function stop(isWin) {
    pause();

    if (isWin) { resultDiv.innerHTML = "YOU WON! CONGRATS!"; }
    else { resultDiv.innerHTML = "YOU LOSE! GAME OVER!"; }


    document.removeEventListener("keydown", playPauseKey);
    ppBtn.disabled = true;
    ppBtn.innerHTML = `<i
    data-feather="play"
    color="grey"
    width = "36px"
    height = "36px"
    stroke-width="1.8"
    fill="grey"></i>`;
    feather.replace();
}

function restart() {
    let sure = confirm("Restart game?\nGame progress will be lost.");

    if (sure) {
        stop();
        squares.forEach(square => square.classList.remove("laser", "invader", "spaceship"));
        init();
    }
}

function switchSound() {
    sndBtn.innerHTML = `<i data-feather="volume-2" color=${isSound ? "grey" : "#8f00ff"} width = "36px" height = "36px" stroke-width="1.8"></i>`;
    feather.replace();
    isSound = !isSound;
}

function playPause() {
    ppBtn.innerHTML = `<i 
    data-feather=${isPaused ? "pause" : "play"}
    color="#8f00ff" 
    width="36px"
    height="36px"
    stroke-width="1.8" 
    fill="#8f00ff"></i>`;

    feather.replace();

    game = isPaused ? play() : pause();
}
// game flow *** ***/

// /*** *** game controls
function playPauseKey(event) {
    if (event.key === " ") {
        event.preventDefault();
        playPause();
    }
}

function moveLeft() {
    squares[spaceship].classList.remove("spaceship");
    if (spaceship % width !== 0) { spaceship -= 1; }
    squares[spaceship].classList.add("spaceship");
}

function moveRight() {
    squares[spaceship].classList.remove("spaceship");
    if (spaceship % width !== width - 1) { spaceship += 1; }
    squares[spaceship].classList.add("spaceship");
}

function shoot(laser = spaceship) {
    if (isSound) { new Audio("./assets/laser-shot.mp3").play(); }
    let laserShot = setInterval(drawLaser, 100);
    lasersTemp.add(laserShot);


    function drawLaser() {
        squares[laser].classList.remove("laser");
        laser -= width;

        if (laser < 0) {
            clearInterval(laserShot);
            lasersTemp.clear(laserShot);
        }
        else if (squares[laser].classList.contains("invader")) {
            clearInterval(laserShot);

            squares[laser].classList.remove("invader");
            squares[laser].classList.add("caught-invader");
            setTimeout(() => {
                squares[laser].classList.remove("caught-invader");
            }, 300);

            invaders[invaders.indexOf(laser)] = 0 - invaders[invaders.indexOf(laser)];
            result += 1;
            resultDiv.innerHTML = result;
        }
        else {
            squares[laser].classList.add("laser");
        }

    }
}

function controls(event) {
    if (event.key === "ArrowLeft") { moveLeft(); }
    else if (event.key === "ArrowRight") { moveRight(); }
    else if (event.key === "ArrowUp") { shoot(); }
}
// game controls *** ***/

// /*** *** invaders dynamic
function draw() {
    invaders.forEach(invader => { squares[invader]?.classList.add("invader"); });
}

function remove() {
    invaders.forEach(invader => { squares[invader]?.classList.remove("invader"); });
}

function moveInvaders() {
    remove();

    let leftEdge = !!invaders.find(invader => Math.abs(invader) % width === 0);
    let rightEdge = !!invaders.find(invader => Math.abs(invader) % width === width - 1);
    let step = goingRight ? 1 : -1;

    if ((goingRight && rightEdge) || (!goingRight && leftEdge)) {
        step = width;
        goingRight = !goingRight;
    }

    invaders = invaders.map(invader => invader >= 0 ? invader + step : invader - step);

    if (result === invaders.length) { stop(true); }

    if (!!invaders.find((invader) => invader >= squares.length - width)) { stop(false); }

    draw();
}
// invaders dynamic *** ***/
// utils ***