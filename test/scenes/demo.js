class Demo extends Phaser.Scene {
    constructor() {
        super('demo');
        this.cards = [];
    }


    preload() {
        this.load.image('spiral', 'test/assets/imgs/samples/spiral.png');
        this.load.image('z', 'test/assets/imgs/samples/z.png');
        this.load.image('v', 'test/assets/imgs/samples/v.png');
        this.load.image('vline', 'test/assets/imgs/samples/vline.png');
        this.load.image('hline', 'test/assets/imgs/samples/hline.png');
    }


    create() {

        this.customEmitter = new Phaser.Events.EventEmitter();

        this.addChkNeighbors();


        const rec = new ShapeRec(this);
        this.addCards(rec, this.chk_neighbors.value);

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

        this.customEmitter.on('chk_neiborgs', () => {
            this.cards.forEach((card) => {
                card.neighbors = this.chk_neighbors.value;
            })
        }, this);

        this.add.text(400, 560, 'Draw the shapes with the mouse.\nPress +/- buttons to change matrix resolution.',{align: 'center'}).setOrigin(0.5);
    }


    addChkNeighbors() {
        this.chk_neighbors = this.add.existing(new CheckBox(this, 20, 550, 'chk_neiborgs', { color: '0xdddddd', label: { text: 'Activate neighbors', fontSize: 14 } })).setOrigin(0, 0);
    }


    addCards(shapeRec, useNeighbors) {
        let rec = shapeRec;
        this.cards.push(
            new Card(this, 50, 0, 'spiral', rec, 'spiral', null, { res: 10, neighbors: useNeighbors }),
            new Card(this, 200, 0, 'z', rec, 'z', null, { res: 10, neighbors: useNeighbors }),
            new Card(this, 350, 0, 'v', rec, 'v', null, { res: 10, neighbors: useNeighbors }),
            new Card(this, 500, 0, 'vline', rec, 'vline', null, { res: 8, neighbors: useNeighbors }),
            new Card(this, 650, 0, 'hline', rec, 'hline', null, { res: 8, neighbors: useNeighbors }));
    }


    checkStroke(points) {
        this.cards.forEach((card) => {
            card.check(points);
        });
    }


}

