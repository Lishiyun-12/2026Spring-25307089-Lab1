import { AccountData } from '../viewmodel/BillViewModel'

@Component
export struct BillBarChart {
  @Prop accounts: Array<AccountData> = []

  private settings: RenderingContextSettings = new RenderingContextSettings(true)
  private context: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.settings)

  private getCategoryAmounts(): Map<number, number> {
    let map: Map<number, number> = new Map<number, number>()
    for (let i = 0; i < this.accounts.length; i++) {
      let account = this.accounts[i]
      let type: number = account.accountType
      let amount: number = account.amount
      if (map.has(type)) {
        let oldValue = map.get(type)
        if (oldValue !== undefined) {
          map.set(type, oldValue + amount)
        }
      } else {
        map.set(type, amount)
      }
    }
    return map
  }

  private getTypeText(type: number): string {
    if (type === 0) {
      return '餐饮'
    } else if (type === 1) {
      return '购物'
    } else if (type === 2) {
      return '交通'
    } else if (type === 3) {
      return '娱乐'
    }
    return '其他'
  }

  private getCategoryKeys(map: Map<number, number>): number[] {
    let keys: number[] = []
    let allKeys = map.keys()
    let next = allKeys.next()
    while (next.value !== undefined) {
      keys.push(next.value)
      next = allKeys.next()
    }
    return keys
  }

  private getCategoryValues(map: Map<number, number>): number[] {
    let values: number[] = []
    let allValues = map.values()
    let next = allValues.next()
    while (next.value !== undefined) {
      values.push(next.value)
      next = allValues.next()
    }
    return values
  }

  private drawChart() {
    let categoryMap: Map<number, number> = this.getCategoryAmounts()

    let amounts: number[] = this.getCategoryValues(categoryMap)

    let maxAmount: number = 1
    for (let i = 0; i < amounts.length; i++) {
      if (amounts[i] > maxAmount) {
        maxAmount = amounts[i]
      }
    }

    let barWidth: number = 40
    let startX: number = 30
    let height: number = 160
    let bottomY: number = height - 20
    let gap: number = 20

    let types: number[] = this.getCategoryKeys(categoryMap)
    for (let i = 0; i < types.length; i++) {
      let type = types[i]
      let amount = categoryMap.get(type)
      if (amount === undefined) {
        continue
      }
      let barHeight: number = (amount / maxAmount) * (height - 40)
      let x: number = startX + i * (barWidth + gap)
      let y: number = bottomY - barHeight

      this.context.fillStyle = '#36a'
      this.context.fillRect(x, y, barWidth, barHeight)

      this.context.fillStyle = '#333'
      this.context.font = '12px'
      this.context.fillText(amount.toString(), x + 5, y - 5)
    }
  }

  build() {
    Column() {
      Text('📊 支出统计')
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .margin({ bottom: 10 })

      if (this.accounts.length === 0) {
        Text('暂无账单数据')
          .fontSize(14)
          .fontColor('#999')
          .height(200)
          .textAlign(TextAlign.Center)
      } else {
        Column() {
          Canvas(this.context)
            .width('100%')
            .height(200)
            .backgroundColor('#f5f5f5')
            .borderRadius(8)
            .onReady(() => {
              this.drawChart()
            })

          Row() {
            ForEach(this.getCategoryKeys(this.getCategoryAmounts()), (type: number) => {
              Text(this.getTypeText(type))
                .fontSize(12)
                .width(100 / this.getCategoryAmounts().size + '%')
                .textAlign(TextAlign.Center)
            }, (type: number) => type.toString())
          }
          .width('100%')
          .margin({ top: 8 })
        }
      }
    }
    .width('100%')
    .padding(10)
    .backgroundColor('#ffffff')
    .borderRadius(12)
  }
}