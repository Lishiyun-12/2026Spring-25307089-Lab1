// CharacterSelect.ets
import image from '@ohos.multimedia.image'

@Component
export struct CharacterSelect {
  @State selectedBird: number = 0
  @State birdPixelMap: image.PixelMap | null = null
  @State isLoading: boolean = true
  onConfirm?: (index: number) => void
  onBack?: () => void

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
      const data = await resourceManager.getMediaContent(resource)
      const imageSource = image.createImageSource(data.buffer)
      const pixelMap = await imageSource.createPixelMap()
      this.birdPixelMap = pixelMap
      this.isLoading = false
    } catch (e) {
      console.log('图片加载失败：' + JSON.stringify(e))
      this.isLoading = false
    }
  }

  aboutToAppear(): void {
    this.loadBirdImage()
  }

  build() {
    Column() {
      Text('选择角色')
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFD700')
        .margin({ top: 50 })

      // 显示加载中或图片
      if (this.isLoading) {
        Column()
          .width(200)
          .height(200)
          .margin({ top: 30 })
          .backgroundColor('#3A2A1A')
          .borderRadius(30)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
      } else if (this.birdPixelMap) {
        Image(this.birdPixelMap)
          .width(200)
          .height(200)
          .margin({ top: 30 })
          .objectFit(ImageFit.Contain)
      } else {
        Column()
          .width(200)
          .height(200)
          .margin({ top: 30 })
          .backgroundColor('#3A2A1A')
          .borderRadius(30)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
      }

      Text(this.selectedBird === 0 ? '棕色小鸡' : (this.selectedBird === 1 ? '白色小鸡' : '蓝色小鸡'))
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFD700')
        .margin({ top: 20, bottom: 40 })

      Row() {
        Button('<')
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
          .backgroundColor('#E8A030')
          .width(80)
          .height(80)
          .borderRadius(40)
          .onClick(() => {
            this.selectedBird = (this.selectedBird - 1 + 3) % 3
            this.loadBirdImage()
          })

        Blank()
          .width(60)

        Button('>')
          .fontSize(50)
          .fontWeight(FontWeight.Bold)
          .backgroundColor('#E8A030')
          .width(80)
          .height(80)
          .borderRadius(40)
          .onClick(() => {
            this.selectedBird = (this.selectedBird + 1) % 3
            this.loadBirdImage()
          })
      }
      .margin({ bottom: 50 })
      .justifyContent(FlexAlign.Center)

      Button('确认')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .backgroundColor('#4CAF50')
        .width(200)
        .height(55)
        .borderRadius(30)
        .margin({ bottom: 30 })
        .onClick(() => {
          if (this.onConfirm) {
            this.onConfirm(this.selectedBird)
          }
        })

      Button('返回')
        .fontSize(20)
        .backgroundColor('#888888')
        .width(120)
        .height(45)
        .borderRadius(25)
        .onClick(() => {
          if (this.onBack) {
            this.onBack()
          }
        })
    }
    .width('100%')
    .height('100%')
    .linearGradient({
      angle: 180,
      colors: [['#87CEEB', 0], ['#5BA3D9', 1]]
    })
    .justifyContent(FlexAlign.Center)
  }
}