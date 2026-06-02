# 🐔 Flappy Bird - 星露谷物语风格

基于 HarmonyOS ArkTS 开发的 Flappy Bird 小游戏，采用星露谷物语像素风格。

![Platform](https://img.shields.io/badge/platform-HarmonyOS-blue)
![Language](https://img.shields.io/badge/language-ArkTS-green)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

## 📱 项目介绍

这是一个使用 HarmonyOS 元服务框架开发的 Flappy Bird 游戏，玩家通过长按屏幕控制小鸡飞行，穿过管道获得分数。游戏包含角色选择、分数记录等功能。

## 🎮 游戏特点

- 🎨 **星露谷物语风格** - 像素风画面，可爱的小鸡角色
- 🎯 **长按控制** - 长按屏幕上升，松开下降
- 🐔 **三种角色** - 棕色、白色、蓝色小鸡可选
- 📊 **分数记录** - 实时显示当前分数
- 📱 **鸿蒙原生** - 基于 HarmonyOS ArkTS 开发

## 🎲 游戏截图

| 首页 | 角色选择 | 游戏界面 | 游戏结束 |
|------|---------|---------|---------|
| 标题和角色预览 | 左右箭头切换角色 | 长按控制小鸡飞行 | 得分统计和重新开始 |

## 🔧 技术栈

- **开发环境**: DevEco Studio 5.0+
- **语言**: ArkTS (TypeScript 超集)
- **框架**: HarmonyOS ArkUI
- **图形**: Canvas 2D API
- **目标系统**: HarmonyOS 5.0+

## 📱 多端适配

本项目实现了一套代码在多种设备上自适应运行：

✅ **手机** - 完全适配  
✅ **折叠屏** - 展开/折叠自动缩放  
✅ **平板** - 画面等比放大  

**适配原理**：所有 UI 元素尺寸均基于画布宽高动态计算，按钮使用百分比相对宽度，触摸事件逻辑统一，无需为不同设备编写额外代码。

## 📁 项目结构
entry/src/main/ets/pages/
├── Index.ets # 主入口，页面路由
├── MainMenu.ets # 首页菜单
├── GamePage.ets # 游戏主页面
└── CharacterSelect.ets # 角色选择页面

entry/src/main/resources/base/media/
├── Brown_Chicken.png # 棕色小鸡素材
├── White_Chicken.png # 白色小鸡素材
└── Blue_Chicken.png # 蓝色小鸡素材

## 🚀 运行方法

### 1. 安装 DevEco Studio

下载安装 [DevEco Studio](https://developer.harmonyos.com/cn/develop/deveco-studio)

### 2. 打开项目

```bash
git clone https://github.com/yourusername/flappy-bird-harmonyos.git
用 DevEco Studio 打开项目文件夹

3. 配置签名
菜单栏：File → Project Structure → Signing Configs

生成或选择签名文件

4. 运行
连接 HarmonyOS 手机或开启模拟器

点击运行按钮 ▶
🎮 操作说明
操作	效果
长按屏幕	小鸡持续上升
松开屏幕	小鸡受重力下降
点击"开始游戏"	进入游戏
点击"选择角色"	切换小鸡颜色
游戏结束点击"重新开始"	重新游戏
游戏结束点击"回到首页"	返回主菜单
📋 游戏规则
小鸡碰到管道顶部或底部即游戏结束

每穿过一根管道得 1 分

游戏开始 3 秒后出现第一根管道

游戏结束后可重新开始或返回首页

🎨 角色颜色
角色	颜色值	素材文件
棕色小鸡	#8B6914	Brown_Chicken.png
白色小鸡	#FFFFFF	White_Chicken.png
蓝色小鸡	#60A0E0	Blue_Chicken.png
📝 开发说明
页面切换
// Index.ets 中控制页面状态
@State currentPage: string = 'menu'  // menu, game, character
添加新角色
在 getBirdColors() 函数中添加颜色配置：
const colors: string[][] = [
  ['#8B6914', '#C8A84E', '#6B4E0A', '#E03030'], // 棕色
  ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#E8A040'], // 白色
  ['#60A0E0', '#A0C8F0', '#4080C0', '#2060A0']  // 蓝色
  // 在这里添加新角色
]
调整游戏难度
在 GamePage.ets 中修改以下参数：

typescript
private readonly gravity: number = 0.3      // 重力（越大下落越快）
private readonly liftForce: number = -0.5   // 上升力（越小升得越快）
private readonly pipeSpeed: number = 2.5    // 管道速度（越大越快）
private readonly pipeGap: number = 200      // 管道间隙（越小越难）
## 🔮 可以进一步优化

### 1. 游戏难度调整
目前游戏为固定难度，可以增加以下难度调节功能：

- **速度递增**：随着分数增加，管道移动速度逐渐加快
- **重力变化**：随着分数增加，重力逐渐增大
- **管道间隙缩小**：随着分数增加，管道之间的间隙逐渐变小
- **难度选择**：在首页添加"简单/普通/困难"模式选择按钮

**实现建议**：
```typescript
// 根据分数动态调整难度
let currentSpeed = this.pipeSpeed + Math.floor(this.score / 10) * 0.2
let currentGap = Math.max(120, this.pipeGap - Math.floor(this.score / 15) * 5)
2. 美术素材完善
目前部分素材已集成，还需补充：

素材类型	当前状态	待添加
小鸡角色	✅ 棕色/白色/蓝色 PNG	-
管道	⚠️ 使用 Canvas 绘图	替换为管道图片素材
背景	⚠️ 使用 Canvas 渐变	替换为农场/天空背景图
草地	⚠️ 使用 Canvas 矩形	替换为草地贴图
云朵	⚠️ 使用 Canvas 圆形	替换为云朵图片
特效	❌ 暂无	碰撞特效、得分特效
音效	❌ 暂无	跳跃音效、得分音效、碰撞音效
图片资源路径：

text
entry/src/main/resources/base/media/
├── pipe.png          # 管道图片（待添加）
├── background.png    # 背景图片（待添加）
├── cloud.png         # 云朵图片（待添加）
└── grass.png         # 草地图片（待添加）
3. 其他优化方向
最高分记录：使用 AppStorage 保存历史最高分

倒计时动画：开始游戏前显示 3、2、1 倒计时动画

触摸反馈：长按时添加视觉反馈（例如翅膀扇动更快）

流畅度优化：使用 requestAnimationFrame 替代 setInterval

多种角色：增加更多颜色和款式的小鸡

排行榜：接入云数据库，实现全球排行榜

每日挑战：每天不同的关卡目标

成就系统：飞行距离、最高分、连续通关等成就

4. 代码结构优化
将游戏常量提取到单独的配置文件

将 Canvas 绘图函数拆分到独立文件

添加游戏状态管理器

增加单元测试

5. 已知问题
极少数低端设备上可能出现轻微卡顿

图片加载失败时自动降级为绘图模式

首次进入角色选择界面图片加载有短暂延迟

🔄 版本历史
v1.0.0 (2024-05-16)
✅ 完成游戏核心机制（重力、碰撞、分数）

✅ 添加长按控制功能

✅ 实现三种角色切换

✅ 添加首页和角色选择界面

✅ 游戏结束画面优化

✅ 支持自定义图片素材

📄 开源协议
MIT License

👨‍💻 作者
[李诗韵]

🙏 致谢
游戏灵感来自 Flappy Bird

美术风格参考星露谷物语

Enjoy! 🐔

text

## 同时建议添加 `.gitignore` 文件：

```gitignore
# Build outputs
/build/
/entry/build/
/.hvigor/
/.cxx/

# IDE
/.idea/
/.preview/
/.vscode/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
*.lock

# Local configuration
/local.properties
