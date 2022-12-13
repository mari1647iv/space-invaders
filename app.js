const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
const pauseButton = document.querySelector("#pause-button");
const soundButton = document.querySelector("#sound-button");
let currentShooterIndex = 217;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let isPaused = false;
let isSound = true;

for (let i = 0; i < 225; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

let alienInvaders = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
];

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader");
        }
    }
}

draw();

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}
document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge =
        alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            goingRight = false;
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            goingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
        pause();
        resultsDisplay.innerHTML = "GAME OVER";
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > squares.length) {
            pause();
            resultsDisplay.innerHTML = "GAME OVER";
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        pause();
        resultsDisplay.innerHTML = "YOU WIN !!!";
    }
}
invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add("laser");

        if (squares[currentLaserIndex].classList.contains("invader")) {
            if (isSound) { new Audio("./assets/ouch.mp3").play(); }
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(
                () => squares[currentLaserIndex].classList.remove("boom"),
                300
            );
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            if (!isPaused) { resultsDisplay.innerHTML = results; }
            console.log(aliensRemoved);
        }
    }
    switch (e.key) {
        case "ArrowUp":
            laserId = setInterval(moveLaser, 100);
            if (isSound) { new Audio("./assets/laser-shot.mp3").play(); }
    }
}

document.addEventListener("keydown", shoot);

function playPause() {
    switch (isPaused) {
        case false:
            pause();
            break;
        case true:
            play();
            break;
    }
}

function pause() {
    document.removeEventListener("keydown", shoot);
    clearInterval(invadersId);
    document.removeEventListener("keydown", moveShooter);
    resultsDisplay.innerHTML = "PAUSED";
    pauseButton.innerHTML = '<i data-feather="play" color="#8f00ff" width = "36px" height = "36px" stroke-width="1.8" fill="#8f00ff"></i>';
    feather.replace();
    isPaused = true;
}

function play() {
    document.addEventListener("keydown", shoot);
    invadersId = setInterval(moveInvaders, 600);
    document.addEventListener("keydown", moveShooter);
    resultsDisplay.innerHTML = results;
    pauseButton.innerHTML = '<i data-feather="pause" color="#8f00ff" width = "36px" height = "36px" stroke-width="1.8" fill="#8f00ff"></i>';
    feather.replace();
    isPaused = false;
}

function soundSwitch() {
    switch (isSound) {
        case true:
            soundButton.innerHTML = '<i data-feather="volume-2" color="grey" width = "36px" height = "36px" stroke-width="1.8"></i>';
            feather.replace();
            isSound = false;
            break;
        case false:
            soundButton.innerHTML = '<i data-feather="volume-2" color="#8f00ff" width = "36px" height = "36px" stroke-width="1.8"></i>';
            feather.replace();
            isSound = true;
            break;
    }
}

function restart() {
    pause();
    squares[currentShooterIndex].classList.remove("shooter");
    remove();
    currentShooterIndex = 217;
    squares[currentShooterIndex].classList.add("shooter");
    direction = 1;
    goingRight = true;
    aliensRemoved = [];
    results = 0;

    alienInvaders = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
    ];

    draw();
    play();
}