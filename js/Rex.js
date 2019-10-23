import NeuralNetwork from "./NeuralNetwork.js"

export default class Rex {
    constructor(context, spriteSheet, brain) {

        if (brain instanceof NeuralNetwork) {
            this.brain = brain.copy();
            this.brain.mutate(mutate);
        } else {
            this.brain = new NeuralNetwork(5, 4, 2);
        }

        this.context = context;
        this.spriteSheet = spriteSheet;

        this.position = { x: 100, y: 372 };

        this.velocity = { x: 0, y: 0 };
        this.gravity = 0.8;
        this.jumpForce = 10;

        this.falling = false;

        this.spritePosition = { x: 1510, y: 2 };

        this.height = 65;
        this.width = 65;

        this.dimensions = {
            WIDTH: 92,
            HEIGHT: 100,
            YPOS: 372
        };

        this.frameIndex = 0;
        this.frameCount = 95;
        this.tickCount = 5;
        this.ticksPerFrame = 5;

        this.score = 0;
        this.lift = -12;
        this.fitness = 0;
    }

    show() {
        this.context.drawImage(this.spriteSheet,
            this.frameIndex + this.spritePosition.x,
            this.spritePosition.y,
            this.dimensions.WIDTH,
            this.dimensions.HEIGHT,
            this.position.x,
            this.position.y,
            this.dimensions.WIDTH * 0.7,
            this.dimensions.HEIGHT * 0.7,
        );

        this.context.strokeStyle = 'blue';
        this.context.beginPath();
        this.context.rect(this.position.x, this.position.y, this.width, this.height);
        this.context.stroke();

    }

    update() {
        this.score++;

        if (this.position.y < 372) {
            this.falling = true;
            this.velocity.y += this.gravity;

        } else if (this.position.y > 372) {
            this.falling = false;
            this.velocity.y = 0;
            this.position.y = 372;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.animate();
    }

    animate() {
        this.tickCount++;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            this.frameIndex += 88;
            if (this.frameIndex > this.frameCount) {
                this.frameIndex = 1;
            }
        }
    }

    jump() {
        if (!this.falling) this.velocity.y -= this.jumpForce;
    }

    collide(cactus) {
        const right = this.position.x + this.width;
        const left = this.position.x;
        const bottom = this.position.y + this.height;

        const cactusrigth = cactus.position[cactus.size].x + cactus.width[cactus.size];
        const cactusleft = cactus.position[cactus.size].x;
        const cactustop = cactus.position[cactus.size].y;

        return right > cactusleft
            && bottom > cactustop
            && left < cactusrigth;
    }

    copy() {
        return new Rex(this.context, this.spriteSheet, this.brain);
    }

    think(cactuses) {
        let closest = null;
        let record = Infinity;
        for (let i = 0; i < cactuses.length; i++) {
            let diff = cactuses[i].position[cactuses[i].size].x - this.position.x;
            if (diff > 0 && diff < record) {
                record = diff;
                closest = cactuses[i];
            }
        }

        let inputs = [];
        // x position of closest cactus
        inputs[0] = map(closest.position[closest.size].x, 0, 700, 0, 1);
        // height of closest cactus
        inputs[1] = map(closest.height[closest.size], closest.height['small'], closest.height['large'], 0, 1);
        // width of closet cactus
        inputs[2] = map(closest.width[closest.size],closest.width['small'],closest.width['large'],0,1);
        // y position of rex
        inputs[3] = map(this.position.y,0,480,0,1);
        // distance between rex and closest cactus
        inputs[4] = map(closest.position[closest.size].x - this.position.x, 0, 700, 0, 1);


        // Get the outputs from the network
        let action = this.brain.predict(inputs);
        if (action[1] > action[0]) {
            this.jump();
        }
    }
}

function mutate(x) {
    if (Math.random() < 0.1) {
        let offset = randomZero_One() * 0.5;
        let newx = x + offset;
        return newx;
    } else {
        return x;
    }
}

function randomZero_One() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}