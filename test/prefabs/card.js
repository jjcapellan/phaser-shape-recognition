class Card {

    constructor(scene, x, y, strokeName, strokeRec, textureKey, textureFrame, resolution) {
        this.sc = scene;
        this.x = x;
        this.y = y;
        this.strokeName = strokeName;
        this.rec = strokeRec;
        this.textureKey = textureKey;
        this.textureFrame = textureFrame;
        this.resolution = resolution;

        this.width = 100;
        this.matrix = null;
        this.lastResult = null;
        this.hitRatio = 0;
        this.textHitRatio = null;

        // Draws background grid
        this.rt = scene.add.renderTexture(this.x, this.y + 100 + 20, 48 * resolution, 48 * resolution);
        // Draws hits and fails
        this.rt2 = scene.add.renderTexture(this.x, this.y + 100 + 20, 48 * resolution, 48 * resolution);

        this.init();
    }

    init() {
        this.sc.add.image(this.x, this.y, this.textureKey).setOrigin(0).setTintFill(0xffffff);

        this.addStroke();

        this.setMatrix();

        this.drawMatrix();

        this.addHitRatio();
    }

    addHitRatio(){
        this.textHitRatio = this.sc.add.text(this.x + 50, this.y + 100 + 20 + 100 + 20, '0%').setOrigin(0);
    }

    addStroke() {
        let t = this;
        this.rec.add(t.strokeName, t.textureKey, t.textureFrame, t.resolution);
    }

    check(samplePoints){
        this.lastResult = this.rec.checkStroke(samplePoints, this.strokeName);
        this.updateHitRatio();
        this.drawResult();
    }

    drawMatrix() {

        const scale = this.width / (48 * this.resolution);

        this.matrix.forEach((row, i) => {            

            row.forEach((cell, j) => {
                let texture = 'grid';
                if (cell) {
                    texture = 'mid';
                }
                this.rt.draw(texture, j * 48, i * 48);
                
            });
        });

        this.rt.setScale(scale);

    }

    drawResult(){
        const scale = this.width / (48 * this.resolution);

        const sampleMatrix = this.lastResult.sampleMatrix;

        this.matrix.forEach((row, i) => {            

            row.forEach((cell, j) => {
                let texture = 'grid';
                let sample = sampleMatrix[i][j]; 
                if (cell && sample) {
                    texture = 'hit';
                } else if(cell !== sample){
                    texture = 'fail';
                }
                this.rt.draw(texture, j * 48, i * 48);
                
            });
        });

        this.rt.setScale(scale);

    }

    setMatrix() {
        this.matrix = this.rec.strokes.get(this.strokeName).matrix;
    }

    updateHitRatio(){
        this.textHitRatio.setText(`${Math.round(this.lastResult.hitsRatio * 100)}%`);
    }
}