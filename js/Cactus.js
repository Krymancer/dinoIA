export default class Cactus {
    constructor(context, spriteSheet) {
        this.context = context;
        this.spriteSheet = spriteSheet;

        this.position = {
            large: { x: 800, y: 372 },
            small: { x: 800, y: 390 }
        };

        this.size = 'large';//Math.random() > 0.4 ? 'large' : 'small';

        this.height = {
            large: 64,
            small: 45
        };

        this.width = {
            large: 36,
            small: 72
        };

        this.spritePosition = {
            large: { x: 652, y: 2 },
            small: { x: 446, y: 2 }
        }

        this.dimensions = {
            large: {
                WIDTH: 50,
                HEIGHT: 100,
                YPOS: 370
            },
            small: {
                WIDTH: 100,
                HEIGHT: 100,
                YPOS: 389
            }
        }

        this.speed = 5;
    }

    show() {
        this.context.drawImage(this.spriteSheet,
            this.spritePosition[this.size].x,
            this.spritePosition[this.size].y,
            this.dimensions[this.size].WIDTH,
            this.dimensions[this.size].HEIGHT,
            this.position[this.size].x,
            this.dimensions[this.size].YPOS,
            this.dimensions[this.size].WIDTH * 0.7,
            this.dimensions[this.size].HEIGHT * 0.7,
        );

        this.context.strokeStyle = 'red';
        this.context.beginPath();
        this.context.rect(this.position[this.size].x, this.position[this.size].y, this.width[this.size], this.height[this.size]);
        this.context.stroke();
    }

    update() {
        this.position[this.size].x -= this.speed;
    }
}