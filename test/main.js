function runGame() {
    var config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
        parent: 'game',
        backgroundColor: 0x000000,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [Demo]
    };

    new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};