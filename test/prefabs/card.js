const TILE_SIZE = 48;
const MARGIN = 25;

class Card {

    constructor(scene, x, y, strokeName, strokeRec, textureKey, textureFrame, { res, neighbors } = {}) {
        this.sc = scene;
        this.x = x;
        this.y = y;
        this.strokeName = strokeName;
        this.rec = strokeRec;
        this.textureKey = textureKey;
        this.textureFrame = textureFrame;
        this.resolution = res || 10;
        this.neighbors = neighbors || false;

        this.width = 100;
        this.matrix = null;
        this.matrix2 = null;
        this.lastResult = null;
        this.hitRatio = 0;
        this.textHitRatio = null;
        this.gfx = scene.add.graphics();

        this.init();
    }


    init() {
        this.sc.add.image(this.x, this.y, this.textureKey).setOrigin(0).setTintFill(0xffffff);

        this.setMatrix();

        this.drawMatrix();

        this.addHitRatio();

        this.addResButtons();

        this.addResText();
    }

    addResButtons() {
        let buttonStyle = { color: 'black', backgroundColor: '#00dd00', fontWeight: 'bold' };

        this.bt_minus = this.sc.add.text(this.x, this.width, '-', buttonStyle)
        .setPadding(8, 0)
        .setInteractive();

        this.bt_plus = this.sc.add.text(this.x + this.width, this.width, '+', buttonStyle)
        .setPadding(8, 0)
        .setOrigin(1, 0)
        .setInteractive();

        this.bt_minus.on('pointerdown', () => {
            if (this.resolution < 4) return;

            this.resolution--;
            this.gfx.clear();
            this.setMatrix();            
            this.drawMatrix();
            this.updateResText();
        });

        this.bt_plus.on('pointerdown', () => {
            if (this.resolution > 20) return;

            this.resolution++;
            this.gfx.clear();
            this.setMatrix();
            this.drawMatrix();
            this.updateResText();
        });
    }

    addResText(){
        this.textRes = this.sc.add.text(this.x + 50, this.width, this.resolution).setOrigin(0.5, 0);
    }


    addHitRatio() {
        this.textHitRatio = this.sc.add.text(this.x + 50, this.y + 2 * 100 + 2 * MARGIN, '0%').setOrigin(0.5);
    }


    check(samplePoints) {
        this.matrix2 = this.rec.makeMatrix(samplePoints, null, this.resolution);
        this.lastResult = this.rec.test(this.matrix, this.matrix2, this.neighbors);
        this.updateHitRatio();
        this.drawResult();
    }


    drawMatrix() {
        let x = this.x;
        let y = this.y + 100 + MARGIN;

        let padding = 1;
        let gridStep = this.width / this.resolution;
        let tileSize = gridStep - 2 * padding;
        let g = this.gfx;
        

        this.matrix.forEach((row, i) => {

            row.forEach((cell, j) => {
                g.fillStyle(0xeeeeee, 1);
                if (cell) {
                    g.fillStyle(0x555555, 1);
                }
                g.fillRect(x + j*gridStep + padding, y + i * gridStep + padding, tileSize, tileSize);

            });
        });

    }


    drawResult() {

        let x = this.x;
        let y = this.y + 100 + MARGIN;

        let padding = 1;
        let gridStep = this.width / this.resolution;
        let tileSize = gridStep - 2 * padding;
        let g = this.gfx;

        const sampleMatrix = this.matrix2;

        this.matrix.forEach((row, i) => {

            row.forEach((value1, j) => {
                g.fillStyle(0xeeeeee, 1);
                let value2 = sampleMatrix[i][j];
                if (value1 && value2) {
                    g.fillStyle(0x00cc00, 1);
                } else if (value1 !== value2) {
                    g.fillStyle(0xcc0000, 1);
                }
                g.fillRect(x + j*gridStep + padding, y + i * gridStep + padding, tileSize, tileSize);

            });
        });

    }


    setMatrix() {
        this.matrix = this.rec.makeMatrix(this.textureKey, this.textureFrame, this.resolution);
    }


    updateHitRatio() {
        this.textHitRatio.setText(`${Math.round(this.lastResult.hitsRatio * 100)}%`);
    }

    updateResText() {
        this.textRes.setText(this.resolution);
    }
}