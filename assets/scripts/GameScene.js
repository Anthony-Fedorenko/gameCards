class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // 1. download background
        this.load.image('bg', 'assets/sprites/background.png')
        this.load.image('card', 'assets/sprites/card.png')

        this.load.image('card1', 'assets/sprites/card1.png')
        this.load.image('card2', 'assets/sprites/card2.png')
        this.load.image('card3', 'assets/sprites/card3.png')
        this.load.image('card4', 'assets/sprites/card4.png')
        this.load.image('card5', 'assets/sprites/card5.png')

        this.load.audio('card', 'assets/sounds/card.mp3')
        this.load.audio('complete', 'assets/sounds/complete.mp3')
        this.load.audio('success', 'assets/sounds/success.mp3')
        this.load.audio('theme', 'assets/sounds/theme.mp3')
        this.load.audio('timeout', 'assets/sounds/timeout.mp3')
    }

    createText() {
        this.timeoutText = this.add.text(10, 330, '', {
            font: '36px CurseCasual',
            fill: '#ffffff'
        })
    }

    onTimerTick() {
        this.timeoutText.setText('Time:' + this.timeout)
        if (this.timeout <= 0) {
            this.sounds.timeout.play()
            this.start()
        } else {
            --this.timeout
        }
    }

    createTimer() {
        this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        })
    }

    createSounds() {
        this.sounds = {
            card: this.sound.add('card'),
            complete: this.sound.add('complete'),
            success: this.sound.add('success'),
            theme: this.sound.add('theme'),
            timeout: this.sound.add('timeout'),
        }
        this.sounds.theme.play({volume: 0.1})
    }

    create() {
        // 2. background output
        this.timeout = config.timeout
        this.createSounds()
        this.createTimer()
        this.createBackground()
        this.createText()
        this.createCards()
        this.start()
    }

    start() {
        this.timeout = config.timeout
        this.openedCard = null
        this.openedCardsCount = 0
        this.initCards()

    }

    initCards() {
        let positions = this.getCardsPositions()

        this.cards.forEach(card => {
            let position = positions.pop()
            card.close()
            card.setPosition(position.x, position.y)
        })
    }

    createBackground() {
        this.add.sprite(0, 0, 'bg').setOrigin(0, 0)
    }

    createCards() {
        this.cards = []

        for (let value of config.cards) {
            for (let i = 0; i < 2; i++) {
                this.cards.push(new Card(this, value))
            }
        }
        this.input.on('gameobjectdown', this.onCardClicked, this)
    }

    onCardClicked(pointer, card) {
        if (card.opened) {
            return false
        }

        this.sounds.card.play()
        if (this.openedCard) {
            // there is opened card
            if (this.openedCard.value === card.value) {
                // pictures true => memorize
                this.sounds.success.play()
                this.openedCard = null
                ++this.openedCardsCount
            } else {
                // pictures false => close
                this.openedCard.close()
                this.openedCard = card
            }
        } else {
            // no opened card
            this.openedCard = card
        }
        card.open()
        if (this.openedCardsCount === this.cards.length / 2) {
            this.sounds.complete.play()
            this.start()
        }
    }

    getCardsPositions() {
        let positions = []
        let cardTexture = this.textures.get('card').getSourceImage()
        let cardWidth = cardTexture.width + 4
        let cardHeight = cardTexture.height + 4
        let offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2
        let offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2

        for (let row = 0; row < config.rows; row++) {
            for (let col = 0; col < config.cols; col++) {
                positions.push({
                    x: offsetX + col * cardWidth,
                    y: offsetY + row * cardHeight
                })
            }
        }
        return Phaser.Utils.Array.Shuffle(positions)
    }
}