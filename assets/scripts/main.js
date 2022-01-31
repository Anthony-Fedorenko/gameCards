let scene = new Phaser.Scene('Game');

scene.preload = function () {
this.load.image('bg', 'assets/sprites/background.png')
this.load.image('card', 'assets/sprites/card.png')

}

scene.create = function () {

    // this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg')
    this.add.sprite(0, 0, 'bg').setOrigin(0, 0)

    let positions = this.getCardsPositions()
    for (let position of positions) {
        this.add.sprite(position.x, position.y, 'card').setOrigin(0, 0)
    }
}

scene.getCardsPositions = function () {
    let positions = []
    let cardTexture = this.textures.get('card').getSourceImage()
    let cardWidth = cardTexture.width + 4
    let cardHeight = cardTexture.height + 4
    let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2
    let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2

    for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
            positions.push({
                x: offsetX + col * cardWidth,
                y: offsetY + row * cardHeight
            })
        }
    }
    return positions
}

let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    rows: 2,
    cols: 5,
    scene: scene
}

let game = new Phaser.Game(config)