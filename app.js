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
// setup ***/

// /*** game data 
let invaders = [];
let spaceship;

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
    invaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    ];
    spaceship = width ** 2 - Math.ceil(width / 2);

    draw();
    squares[spaceship].classList.add("spaceship");

    goingRight = true;
    isSound = true;
    isPaused = true;
    result = 0;


    playPause();
}

function play() {
    resultDiv.innerHTML = result;

    document.addEventListener("keydown", controls);


    isPaused = false;
    return setInterval(moveInvaders, 400);
}

function pause() {
    clearInterval(game);
    isPaused = true;

    document.removeEventListener("keydown", controls);

    resultDiv.innerHTML = "PAUSED";
}

function stop(isWin) {
    pause();

    if (isWin) { resultDiv.innerHTML = "YOU WON! CONGRATS!"; }
    else { resultDiv.innerHTML = "YOU LOSE! GAME OVER!"; }

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

function shoot() {
    let laser = spaceship
    if (isSound) { new Audio("./assets/laser-shot.mp3").play(); }
    let laserShot = setInterval(drawLaser, 100);

    function drawLaser() {
        squares[laser].classList.remove("laser");
        laser -= width;

        if (laser < 0) {
            clearInterval(laserShot)
        }
        else if (squares[laser].classList.contains("invader")) {
            clearInterval(laserShot);

            /*!*/if (isSound) { new Audio("./assets/ouch.mp3").play(); }
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