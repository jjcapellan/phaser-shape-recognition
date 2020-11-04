const TILE_SIZE = 48;
const MARGIN = 20;

class Card {

    constructor(scene, x, y, strokeName, strokeRec, textureKey, textureFrame, {res, neighbors} = {}) {
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

        // Draws background grid
        this.rt = scene.add.renderTexture(this.x, this.y + 100 + MARGIN, TILE_SIZE * res, TILE_SIZE * res);
        // Draws hits and fails
        this.rt2 = scene.add.renderTexture(this.x, this.y + 100 + MARGIN, TILE_SIZE * res, TILE_SIZE * res);

        this.init();
    }


    init() {
        this.sc.add.image(this.x, this.y, this.textureKey).setOrigin(0).setTintFill(0xffffff);

        this.setMatrix();

        this.drawMatrix();

        this.addHitRatio();
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

        const scale = this.width / (TILE_SIZE * this.resolution);

        this.matrix.forEach((row, i) => {

            row.forEach((cell, j) => {
                let texture = 'grid';
                if (cell) {
                    texture = 'mid';
                }
                this.rt.draw(texture, j * TILE_SIZE, i * TILE_SIZE);

            });
        });

        this.rt.setScale(scale);

    }


    drawResult() {
        const scale = this.width / (TILE_SIZE * this.resolution);

        const sampleMatrix = this.matrix2;

        this.matrix.forEach((row, i) => {

            row.forEach((value1, j) => {
                let texture = 'grid';
                let value2 = sampleMatrix[i][j];
                if (value1 && value2) {
                    texture = 'hit';
                } else if (value1 !== value2) {
                    texture = 'fail';
                }
                this.rt.draw(texture, j * TILE_SIZE, i * TILE_SIZE);

            });
        });

        this.rt.setScale(scale);

    }


    setMatrix() {
        this.matrix = this.rec.makeMatrix(this.textureKey, this.textureFrame, this.resolution);
    }


    updateHitRatio() {
        this.textHitRatio.setText(`${Math.round(this.lastResult.hitsRatio * 100)}%`);
    }
}