class CheckBox extends Phaser.GameObjects.Image {
  /**
   * Creates an instance of CheckBox.
   * @param  {Phaser.Scene} scene 
   * @param  {number} x 
   * @param  {number} y 
   * @param  {object} options
   * @param  {number} [options.size = 20]
   * @param  {number} [options.color = 0xdd0000]
   * @param  {number} [options.lineWidth = 3]
   * @param  {boolean} [options.value = false] Initial value of the checkbox. (true/false)
   * @param  {object} [options.label]
   * @param  {object} [options.label.text]
   * @param  {object} [options.label.fontSize]
   */
  constructor(scene, x, y, id, {size, color, lineWidth, value, label} = {}) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = size || 20
    this.color = color || '0xdd0000';
    this.lineWidth = lineWidth || 3;
    this.value = value || false;
    this.label = label;
    this.id = id;
    this.init();
  }

  init() {
    this.makeOnTexture();
    this.makeOffTexture();
    this.setInteractive();
    this.resetTexture();
    this.setBehavior();
    this.setLabel();
  }

  makeOnTexture() {
    let g = this.scene.add.graphics();
    let s = this.size;   
    g.fillStyle(this.color,1);
    g.fillRect(0, 0, s, s);
    g.generateTexture('checkBoxOn', s, s);
    g.setVisible(false);
    g.destroy();
  }

  makeOffTexture() {
    let g = this.scene.add.graphics();   
    let s = this.size; 
    g.lineStyle( this.lineWidth, this.color);
    g.strokeRect(0, 0, s, s);
    g.generateTexture('checkBoxOff', s, s);
    g.setVisible(false);
    g.destroy();
  }

  setBehavior() {
    this.on(
      'pointerup',
      () => {
        this.value = !this.value;
        this.resetTexture();
        this.scene.customEmitter.emit(this.id);
      },
      this
    );
  }

  resetTexture() {
    if (this.value) {
      this.setTexture('checkBoxOn');
    } else {
      this.setTexture('checkBoxOff');
    }
  }

  setLabel(){
    if(!this.label)return;

    let fontSize = this.label.fontSize;
    let color = this.color.replace('0x','#');

    this.scene.add.text(
      this.x + this.size + this.label.fontSize/2, 
      this.y + this.size/2, 
      this.label.text, 
      {fontFamily: 'Arial', fontSize: fontSize, color: color}
      ).setOrigin(0,0.5);
  }
}
