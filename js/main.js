const spriteSheet = new Image();
spriteSheet.src = "assets/images/sprites.png";

import Horizon from "./Horizon.js"
import Rex from "./Rex.js"
import Cactus from "./Cactus.js"

const spriteDefinition = {
    CACTUS_LARGE: { x: 652, y: 2 },
    CACTUS_SMALL: { x: 446, y: 2 },
    CLOUD: { x: 166, y: 2 },
    HORIZON: { x: 2, y: 104 },
    MOON: { x: 954, y: 2 },
    PTERODACTYL: { x: 260, y: 2 },
    RESTART: { x: 2, y: 2 },
    TEXT_SPRITE: { x: 1294, y: 2 },
    TREX: { x: 1678, y: 2 },
    STAR: { x: 1276, y: 2 }
};

const sounds = {
    BUTTON_PRESS: 'offline-sound-press',
    HIT: 'offline-sound-hit',
    SCORE: 'offline-sound-reached'
};

const canvas = document.getElementById("game");
const context = canvas.getContext('2d');

// Game related variables
const horizon = new Horizon(context, spriteSheet);
const rex = new Rex(context, spriteSheet);
let cactuses = [];

const ticksPerCactus = 120;
let ticks = 120;
// End Game related variables

// Helper functions
document.addEventListener("keydown", jumper);
function jumper() {
    rex.jump();
}
// End Helper functions

// IA Variables
const totalPopulation = 1000;
let allDinos = [];
let activeDinos = [];
let generation = 0;
let bestScore = 0;
let cactusCont = 0;
// End IA variables

// IA Helper Funtions
function reset() {
    cactuses = [];
    cactusCont = 0;
    ticks = 120;
}

function createPopulation() {
    for (let i = 0; i < totalPopulation; i++) {
        let rex = new Rex(context, spriteSheet);
        activeDinos[i] = rex;
        allDinos[i] = rex;
    }
}

function nextGeneration() {
    generation++;
    reset();
    normalizeFitness(allDinos);
    activeDinos = generate(allDinos);
    allDinos = activeDinos.slice();
}

function generate(oldDinos) {
    let newRex = [];
    oldDinos.forEach((rex, index) => {
        newRex[index] = new Rex(context,spriteSheet, poolSelection(oldDinos).brain);
    });
    return newRex;
}

function normalizeFitness(dinos) {
    let sum = 0;
    dinos.forEach(rex => {
        sum += rex.score;
    });

    dinos.forEach(rex => {
        rex.fitness = rex.score / sum;
    });
}

function poolSelection(dinos) {
    let index = 0;
    let r = Math.random();

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
        r -= dinos[index].fitness;
        // And move on to the next
        index++;
    }

    // Go back one
    index--;

    return dinos[index].copy();
}

// End IA Helper Functions

function update() {

    // DRAW
    // Clear Screen
    context.fillStyle = "#f7f7f7";
    context.fillRect(0, 0, 800, 600);
    horizon.showClouds();
    activeDinos.forEach(rex => {
        rex.show();
    });
    cactuses.forEach((cactus) => {
        cactus.show();
    });
    horizon.show();
    // Draw Score
    context.font = "28px score";
    context.fillStyle = 'black';
    context.textBaseline = 'top';
    context.fillText(`Generation: ${generation}`, 580, 10);
    context.fillText(`Best Score: ${bestScore}`, 580, 40);
    context.fillText(`Alive: ${activeDinos.length}`, 580, 70);
    context.fillText(`Cactus: ${cactusCont}`, 580, 100);



    // END DRAW

    // Update
    if (activeDinos.length === 0) {
        nextGeneration();
    }

    horizon.update();

    ticks++;
    if (ticks > ticksPerCactus) {
        ticks = 0;
        cactuses.push(new Cactus(context, spriteSheet));
    }

    cactuses.forEach((cactus, index) => {
        cactus.update();
        if (cactus.position[cactus.size].x < -cactus.dimensions[cactus.size].WIDTH) {
            cactuses.splice(index, 1);
            cactusCont++;
        }
        activeDinos.forEach((rex, index) => {
            rex.update();
            if (rex.collide(cactus)) {
                activeDinos.splice(index, 1);
            }
            rex.think(cactuses);
            if(rex.score > bestScore){
                bestScore = rex.score;
            }
        });
    });

    requestAnimationFrame(update);
}

createPopulation();
update();

