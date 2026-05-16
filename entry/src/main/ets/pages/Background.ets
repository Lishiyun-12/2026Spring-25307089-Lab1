// Background.ets
@Component
export struct GameBackground {
  private ctx: CanvasRenderingContext2D | null = null
  private canvasWidth: number = 0
  private canvasHeight: number = 0

  aboutToAppear() {
    // 延迟绘制，等待Canvas初始化
    setTimeout(() => {
      this.drawBackground()
    }, 100)
  }

  drawBackground() {
    if (!this.ctx || this.canvasWidth === 0 || this.canvasHeight === 0) return

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
  }

  build() {
    Canvas(this.ctx)
      .width('100%')
      .height('100%')
      .onAreaChange((oldValue: Area, newValue: Area) => {
        const width = newValue.width as number
        const height = newValue.height as number
        if (width > 0 && height > 0) {
          this.canvasWidth = width
          this.canvasHeight = height
          this.drawBackground()
        }
      })
  }
}