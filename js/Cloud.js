export default class Cloud {
    constructor(context, spriteSheet) {
        this.position = {x: 800, y: random(50,340)};
        this.context = context;
        this.spriteSheet = spriteSheet;
        this.spritePosition = { x: 166, y: 2 };
        this.speed = 2;


        this.dimensions = {
            WIDTH: 95,
            HEIGHT: 100,
        };

        this.frameIndex = 0;
        this.frameCount = 220;
        this.tickCount = 0;
    }

    show(){
        this.context.drawImage(this.spriteSheet,
            this.spritePosition.x,
            this.spritePosition.y,
            this.dimensions.WIDTH,
            this.dimensions.HEIGHT,
            this.position.x,
            this.position.y,
            this.dimensions.WIDTH,
            this.dimensions.HEIGHT,
        );
    }

    update(){
        this.position.x -= this.speed;
    }
}


function random(min, max) {
    return Math.random() * (max - min) + min;
}