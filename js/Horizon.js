import Cloud from "./Cloud.js";

export default class Horizon {
    constructor(context, spriteSheet) {
        this.context = context;
        this.spriteSheet = spriteSheet;

        this.spritePosition = { x: 2, y: 104 };

        this.dimensions = {
            WIDTH: 800,
            HEIGHT: 25,
            YPOS: 427
        };

        this.cloudFrequency = 1;
        this.maxClouds = 6;
        this.clouds = [];
        this.obstaclesHistory = [];
        this.height = 16;

        this.frameIndex = 0;
        this.frameCount = 220;
        this.tickCount = 0;

    }

    show() {
        this.context.drawImage(this.spriteSheet,
            this.frameIndex * this.spritePosition.x,
            this.spritePosition.y,
            this.dimensions.WIDTH,
            this.dimensions.HEIGHT,
            0,
            this.dimensions.YPOS,
            this.dimensions.WIDTH,
            this.dimensions.HEIGHT,
        );
    }

    showClouds(){
        this.clouds.forEach(cloud =>{
            cloud.show();
        });
    }

    update() {
        this.tickCount += 0.01;
        if(this.tickCount > this.cloudFrequency && this.clouds.length < this.maxClouds){
            this.clouds.push(new Cloud(this.context,this.spriteSheet));
            this.tickCount = 0;
        }

        this.clouds.forEach((cloud,index) =>{
            cloud.update();
            if(cloud.position.x < -100){
                this.clouds.splice(index,1);
            }
        });

        this.frameIndex = (this.frameIndex + 4) % this.frameCount;

    }
}
