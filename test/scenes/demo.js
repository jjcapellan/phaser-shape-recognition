class Demo extends Phaser.Scene {
    constructor() {
        super('demo');
        this.cards = [];
    }

    preload() {
        this.load.image('spiral', './assets/imgs/samples/spiral.png');
        this.load.image('z', './assets/imgs/samples/z.png');
        this.load.image('v', './assets/imgs/samples/v.png');
        this.load.image('vline', './assets/imgs/samples/vline.png');
        this.load.image('hline', './assets/imgs/samples/hline.png');
        this.load.image('grid', './assets/imgs/square.png');
        this.load.image('mid', './assets/imgs/squaremid.png');
        this.load.image('hit', './assets/imgs/squarehit.png');
        this.load.image('fail', './assets/imgs/squarefail.png');
    }

    create() {

        const rec = new sRec(this);
        this.addCards(rec);

        let points = [];

        let isDrawing = false;
        this.graphics = this.add.graphics();

        this.input.on('pointerdown', (pointer) => {
            points = [];
            let x = pointer.x;
            let y = pointer.y;
            points.push({ x: x, y: y });

            isDrawing = true;
            this.graphics.clear();
            this.graphics.lineStyle(3, 0xffffff, 1);
        });

        this.input.on('pointermove', (pointer) => {
            if (!isDrawing) return;
            let lastPoint = points[points.length - 1];
            let newPoint = { x: pointer.x, y: pointer.y };
            this.graphics.lineBetween(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
            points.push(newPoint);
        });

        this.input.on('pointerup', (pointer) => {
            isDrawing = false;
            if (points.length < 10) return;
            let newPoint = { x: pointer.x, y: pointer.y };
            points.push(newPoint);

            this.checkStroke(points);
        });
    }

    addCards(shapeRec) {
        let rec = shapeRec;
        this.cards.push(
            new Card(this, 50, 0, 'spiral', rec, 'spiral', null, 10),
            new Card(this, 200, 0, 'z', rec, 'z', null, 8),
            new Card(this, 350, 0, 'v', rec, 'v', null, 8),
            new Card(this, 500, 0, 'vline', rec, 'vline', null, 8),
            new Card(this, 650, 0, 'hline', rec, 'hline', null, 8));
    }

    checkStroke(points){
        this.cards.forEach((card) => {
            card.check(points);
        });
    }


}

