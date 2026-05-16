// GamePage.ets
import image from '@ohos.multimedia.image'

@Component
export struct GamePage {
  selectedBird: number = 0
  onBackToHome?: () => void

  @State birdY: number = 400
  @State isGameOver: boolean = false
  @State score: number = 0
  @State birdPixelMap: image.PixelMap | null = null
  @State imagesLoaded: boolean = false
  @State isLoading: boolean = true

  private birdVelocity: number = 0
  private isPressing: boolean = false
  private pipeX: number = 0
  private pipeHeight: number = 250
  private hasScored: boolean = false
  private gameStarted: boolean = false
  private startDelayTimer: number = -1
  private gameTimer: number = -1

  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private ctx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)
  private canvasWidth: number = 0
  private canvasHeight: number = 0

  private readonly gravity: number = 0.3
  private readonly liftForce: number = -0.5
  private readonly pipeGap: number = 200
  private readonly pipeWidth: number = 60
  private readonly pipeSpeed: number = 2.5
  private readonly birdRadius: number = 18

  private async loadBirdImage(): Promise<void> {
    this.isLoading = true
    try {
      let resource: Resource
      if (this.selectedBird === 0) {
        resource = $r('app.media.Brown_Chicken')
      } else if (this.selectedBird === 1) {
        resource = $r('app.media.White_Chicken')
      } else {
        resource = $r('app.media.Blue_Chicken')
      }

      const resourceManager = getContext(this).resourceManager
      const data: Uint8Array = await resourceManager.getMediaContent(resource)
      const imageSource: image.ImageSource = image.createImageSource(data.buffer)
      const pixelMap: image.PixelMap = await imageSource.createPixelMap()
      this.birdPixelMap = pixelMap
      this.imagesLoaded = true
      this.isLoading = false
      this.drawGame()
    } catch (e) {
      console.log('图片加载失败，使用绘图模式')
      this.imagesLoaded = false
      this.isLoading = false
      this.drawGame()
    }
  }

  private drawBirdFallback(): void {
    const colors: string[][] = [
      ['#F5C060', '#FFE4A0', '#E8A040', '#E03030'],
      ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#E8A040'],
      ['#60A0E0', '#A0C8F0', '#4080C0', '#2060A0']
    ]
    const c: string[] = colors[this.selectedBird]
    const x: number = this.canvasWidth / 4
    const y: number = this.birdY

    this.ctx.fillStyle = c[0]
    this.ctx.beginPath()
    this.ctx.arc(x, y, this.birdRadius, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.beginPath()
    this.ctx.arc(x + 8, y - 5, 5, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.fillStyle = '#000000'
    this.ctx.beginPath()
    this.ctx.arc(x + 10, y - 6, 2.5, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.fillStyle = '#E8A030'
    this.ctx.beginPath()
    this.ctx.moveTo(x + 14, y - 4)
    this.ctx.lineTo(x + 22, y - 2)
    this.ctx.lineTo(x + 14, y + 1)
    this.ctx.fill()
  }

  startGame(): void {
    this.isGameOver = false
    this.score = 0
    this.birdY = this.canvasHeight / 2
    this.birdVelocity = 0
    this.isPressing = false
    this.gameStarted = false
    this.hasScored = false
    this.pipeX = this.canvasWidth + 200
    this.generateSafePipeHeight()

    if (this.gameTimer !== -1) {
      clearInterval(this.gameTimer)
    }
    if (this.startDelayTimer !== -1) {
      clearTimeout(this.startDelayTimer)
    }

    this.startDelayTimer = setTimeout(() => {
      this.gameStarted = true
      this.pipeX = this.canvasWidth
    }, 3000)

    this.gameTimer = setInterval(() => {
      if (!this.isGameOver) {
        this.updateGame()
      }
    }, 16)
  }

  generateSafePipeHeight(): void {
    const minPipeHeight: number = 80
    const maxPipeHeight: number = this.canvasHeight - this.pipeGap - 80
    if (maxPipeHeight > minPipeHeight) {
      this.pipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight
    } else {
      this.pipeHeight = this.canvasHeight / 3
    }
  }

  updateGame(): void {
    if (this.isPressing) {
      this.birdVelocity += this.liftForce
      if (this.birdVelocity < -5) this.birdVelocity = -5
    } else {
      this.birdVelocity += this.gravity
      if (this.birdVelocity > 8) this.birdVelocity = 8
    }
    this.birdY += this.birdVelocity

    if (this.gameStarted && !this.isGameOver) {
      this.pipeX -= this.pipeSpeed

      const birdLeftX: number = this.canvasWidth / 4
      if (!this.hasScored && this.pipeX + this.pipeWidth < birdLeftX) {
        this.score++
        this.hasScored = true
      }

      if (this.pipeX + this.pipeWidth < 0) {
        this.pipeX = this.canvasWidth
        this.generateSafePipeHeight()
        this.hasScored = false
      }
    }

    this.checkCollision()
    this.drawGame()
  }

  checkCollision(): void {
    const birdCenterX: number = this.canvasWidth / 4
    const birdCenterY: number = this.birdY

    if (birdCenterY - this.birdRadius <= 0 || birdCenterY + this.birdRadius >= this.canvasHeight - 60) {
      this.gameOver()
    }

    if (this.gameStarted) {
      const inPipeX: boolean = (birdCenterX + this.birdRadius > this.pipeX &&
        birdCenterX - this.birdRadius < this.pipeX + this.pipeWidth)
      if (inPipeX) {
        if (birdCenterY - this.birdRadius < this.pipeHeight) {
          this.gameOver()
        }
        const bottomPipeY: number = this.pipeHeight + this.pipeGap
        if (birdCenterY + this.birdRadius > bottomPipeY) {
          this.gameOver()
        }
      }
    }
  }

  gameOver(): void {
    if (this.isGameOver) return
    this.isGameOver = true
    this.isPressing = false
    this.gameStarted = false

    if (this.gameTimer !== -1) {
      clearInterval(this.gameTimer)
      this.gameTimer = -1
    }
    if (this.startDelayTimer !== -1) {
      clearTimeout(this.startDelayTimer)
    }
    this.drawGame()
  }

  restartGame(): void {
    this.startGame()
  }

  backToHome(): void {
    if (this.gameTimer !== -1) {
      clearInterval(this.gameTimer)
    }
    if (this.onBackToHome) {
      this.onBackToHome()
    }
  }

  drawGame(): void {
    if (!this.ctx || this.canvasWidth === 0) return

    // 天空渐变
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight)
    gradient.addColorStop(0, '#87CEEB')
    gradient.addColorStop(1, '#E0F6FF')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    // 云朵
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.beginPath()
    this.ctx.arc(100, 80, 30, 0, Math.PI * 2)
    this.ctx.arc(140, 70, 35, 0, Math.PI * 2)
    this.ctx.arc(180, 80, 30, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.beginPath()
    this.ctx.arc(500, 120, 25, 0, Math.PI * 2)
    this.ctx.arc(540, 110, 30, 0, Math.PI * 2)
    this.ctx.arc(580, 120, 25, 0, Math.PI * 2)
    this.ctx.fill()

    // 草地
    this.ctx.fillStyle = '#7EC850'
    this.ctx.fillRect(0, this.canvasHeight - 60, this.canvasWidth, 60)
    this.ctx.fillStyle = '#5DA040'
    this.ctx.fillRect(0, this.canvasHeight - 60, this.canvasWidth, 10)

    // 柱子
    if (this.gameStarted || this.isGameOver) {
      this.ctx.fillStyle = '#228B22'
      this.ctx.fillRect(this.pipeX, 0, this.pipeWidth, this.pipeHeight)
      this.ctx.fillStyle = '#1A5C1A'
      this.ctx.fillRect(this.pipeX - 8, this.pipeHeight - 35, this.pipeWidth + 16, 35)

      const bottomY = this.pipeHeight + this.pipeGap
      const bottomHeight = this.canvasHeight - bottomY - 60
      if (bottomHeight > 0) {
        this.ctx.fillStyle = '#228B22'
        this.ctx.fillRect(this.pipeX, bottomY, this.pipeWidth, bottomHeight)
        this.ctx.fillStyle = '#1A5C1A'
        this.ctx.fillRect(this.pipeX - 8, bottomY, this.pipeWidth + 16, 35)
      }
    }

    // 小鸡
    if (this.imagesLoaded && this.birdPixelMap) {
      const imgX = this.canvasWidth / 4 - this.birdRadius
      const imgY = this.birdY - this.birdRadius
      this.ctx.drawImage(this.birdPixelMap, imgX, imgY, this.birdRadius * 2, this.birdRadius * 2)
    } else {
      this.drawBirdFallback()
    }

    // 分数
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.font = `bold ${Math.floor(this.canvasWidth / 5)}px "Courier New"`
    this.ctx.shadowBlur = 4
    this.ctx.shadowColor = '#000000'
    const scoreText = `${this.score}`
    const scoreWidth = this.ctx.measureText(scoreText).width
    this.ctx.fillText(scoreText, (this.canvasWidth - scoreWidth) / 2, 120)
    this.ctx.shadowBlur = 0

    // 游戏结束画面
    // 游戏结束画面
    if (this.isGameOver) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.85)'
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

      const dialogW = this.canvasWidth * 0.85
      const dialogH = this.canvasHeight * 0.6
      const dialogX = (this.canvasWidth - dialogW) / 2
      const dialogY = (this.canvasHeight - dialogH) / 2

      this.ctx.fillStyle = '#E8D8B0'
      this.ctx.fillRect(dialogX, dialogY, dialogW, dialogH)
      this.ctx.fillStyle = '#C8B890'
      this.ctx.fillRect(dialogX + 5, dialogY + 5, dialogW - 10, dialogH - 10)

      // GAME OVER - 超大字体
      this.ctx.fillStyle = '#2C1810'
      this.ctx.font = `bold ${Math.floor(this.canvasWidth / 4.5)}px "Courier New"`
      const gameOverText = 'GAME OVER'
      const gameOverWidth = this.ctx.measureText(gameOverText).width
      this.ctx.fillText(gameOverText, dialogX + (dialogW - gameOverWidth) / 2, dialogY + dialogH * 0.3)

      // 得分 - 大字体
      this.ctx.fillStyle = '#4A3A2A'
      this.ctx.font = `bold ${Math.floor(this.canvasWidth / 6)}px "Courier New"`
      const finalScoreText = `得分 ${this.score}`
      const finalScoreWidth = this.ctx.measureText(finalScoreText).width
      this.ctx.fillText(finalScoreText, dialogX + (dialogW - finalScoreWidth) / 2, dialogY + dialogH * 0.48)

      // 按钮
      const btnW = (dialogW - 100) / 2
      const btnH = 95
      const btnSpacing = 40
      const btnY = dialogY + dialogH - 110  // 按钮位置不变

      // 重新开始按钮（左边）
      const restartBtnX = dialogX + 30
      this.ctx.fillStyle = '#4CAF50'
      this.ctx.fillRect(restartBtnX, btnY, btnW, btnH)
      this.ctx.fillStyle = '#45A049'
      this.ctx.fillRect(restartBtnX, btnY + btnH - 12, btnW, 12)

      this.ctx.fillStyle = '#FFFFFF'
      this.ctx.font = `bold ${Math.floor(this.canvasWidth / 6)}px "Courier New"`
      const restartText = '重新开始'
      const restartWidth = this.ctx.measureText(restartText).width
      // 文字在按钮内抬高（从原来的 btnY + btnH/2 + 15 改小）
      this.ctx.fillText(restartText, restartBtnX + (btnW - restartWidth) / 2, btnY + btnH / 2 - 8)

      // 回到首页按钮（右边）
      const homeBtnX = restartBtnX + btnW + btnSpacing
      this.ctx.fillStyle = '#E8A030'
      this.ctx.fillRect(homeBtnX, btnY, btnW, btnH)
      this.ctx.fillStyle = '#D09028'
      this.ctx.fillRect(homeBtnX, btnY + btnH - 12, btnW, 12)

      this.ctx.fillStyle = '#FFFFFF'
      const homeText = '回到首页'
      const homeWidth = this.ctx.measureText(homeText).width
      // 文字在按钮内抬高
      this.ctx.fillText(homeText, homeBtnX + (btnW - homeWidth) / 2, btnY + btnH / 2 - 8)
    }
  }

  private checkButtons(x: number, y: number): void {
    if (!this.isGameOver) return

    const dialogW = this.canvasWidth * 0.85
    const dialogH = this.canvasHeight * 0.6
    const dialogX = (this.canvasWidth - dialogW) / 2
    const dialogY = (this.canvasHeight - dialogH) / 2

    const btnW = (dialogW - 100) / 2
    const btnH = 95
    const btnSpacing = 40
    const btnY = dialogY + dialogH - 110  // 按钮位置不变

    const restartBtnX = dialogX + 30
    if (x >= restartBtnX && x <= restartBtnX + btnW && y >= btnY && y <= btnY + btnH) {
      this.restartGame()
      return
    }

    const homeBtnX = restartBtnX + btnW + btnSpacing
    if (x >= homeBtnX && x <= homeBtnX + btnW && y >= btnY && y <= btnY + btnH) {
      this.backToHome()
    }
  }

  aboutToAppear(): void {
    this.loadBirdImage()
    this.startGame()
  }

  build() {
    Column() {
      Canvas(this.ctx)
        .width('100%')
        .height('100%')
        .onTouch((event: TouchEvent) => {
          const touch = event.touches[0]
          if (event.type === TouchType.Down && touch) {
            if (this.isGameOver) {
              this.checkButtons(touch.x, touch.y)
            } else {
              this.isPressing = true
            }
          } else if (event.type === TouchType.Up) {
            if (!this.isGameOver) {
              this.isPressing = false
            }
          }
        })
        .onAreaChange((oldValue: Area, newValue: Area) => {
          const width = newValue.width as number
          const height = newValue.height as number
          if (width > 0 && height > 0) {
            this.canvasWidth = width
            this.canvasHeight = height
            this.birdY = height / 2
            this.pipeX = width + 200
            this.generateSafePipeHeight()
            this.drawGame()
          }
        })
    }
    .width('100%')
    .height('100%')
  }
}