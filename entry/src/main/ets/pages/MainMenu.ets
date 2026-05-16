// MainMenu.ets
import image from '@ohos.multimedia.image'

@Component
export struct MainMenu {
  @State selectedBird: number = 0
  @State birdPixelMap: image.PixelMap | null = null
  onStartClick?: () => void
  onCharacterClick?: () => void

  private async loadBirdImage(): Promise<void> {
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
      const data = await resourceManager.getMediaContent(resource)
      const imageSource = image.createImageSource(data.buffer)
      const pixelMap = await imageSource.createPixelMap()
      this.birdPixelMap = pixelMap
    } catch (e) {
      console.log('图片加载失败')
    }
  }

  aboutToAppear(): void {
    this.loadBirdImage()
  }

  build() {
    Column() {
      Row() {
        Text('🪽').fontSize(40)
        Text('FLAPPY BIRD').fontSize(40).fontWeight(FontWeight.Bold).fontColor('#FFD700').margin({ left: 10, right: 10 })
        Text('🪽').fontSize(40)
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .margin({ top: 80 })

      Column() {
        Text('当前角色').fontSize(24).fontWeight(FontWeight.Bold).fontColor('#FFFFFF').margin({ bottom: 15 })

        if (this.birdPixelMap) {
          Image(this.birdPixelMap)
            .width(150)
            .height(150)
            .objectFit(ImageFit.Contain)
        } else {
          Column().width(150).height(150).backgroundColor('#3A2A1A').borderRadius(20)
        }

        Text(this.selectedBird === 0 ? '棕色小鸡' : (this.selectedBird === 1 ? '白色小鸡' : '蓝色小鸡'))
          .fontSize(24).fontWeight(FontWeight.Bold).fontColor('#FFD700').margin({ top: 15 })
      }
      .margin({ top: 60 })

      Blank().layoutWeight(1)

      Button('开始游戏')
        .fontSize(28).fontWeight(FontWeight.Bold).backgroundColor('#4CAF50')
        .padding({ left: 50, right: 50, top: 15, bottom: 15 }).borderRadius(35).margin({ bottom: 20 })
        .onClick(() => { if (this.onStartClick) this.onStartClick() })

      Button('选择角色')
        .fontSize(28).fontWeight(FontWeight.Bold).backgroundColor('#E8A030')
        .padding({ left: 50, right: 50, top: 15, bottom: 15 }).borderRadius(35).margin({ bottom: 100 })
        .onClick(() => { if (this.onCharacterClick) this.onCharacterClick() })

      Text('长按屏幕上升，松开下降').fontSize(16).fontColor('#FFFFFF').margin({ bottom: 40 }).opacity(0.8)
    }
    .width('100%')
    .height('100%')
    .linearGradient({ angle: 180, colors: [['#87CEEB', 0], ['#5BA3D9', 1]] })
  }
}