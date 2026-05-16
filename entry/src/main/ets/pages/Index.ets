// Index.ets
import { MainMenu } from './MainMenu'
import { GamePage } from './GamePage'
import { CharacterSelect } from './CharacterSelect'

@Entry
@Component
struct Index {
  @State currentPage: string = 'menu'
  @State selectedBird: number = 0

  build() {
    if (this.currentPage === 'menu') {
      MainMenu({
        selectedBird: this.selectedBird,
        onStartClick: () => {
          this.currentPage = 'game'
        },
        onCharacterClick: () => {
          this.currentPage = 'character'
        }
      })
    } else if (this.currentPage === 'game') {
      GamePage({
        selectedBird: this.selectedBird,
        onBackToHome: () => {
          this.currentPage = 'menu'
        }
      })
    } else if (this.currentPage === 'character') {
      CharacterSelect({
        selectedBird: this.selectedBird,
        onConfirm: (index: number) => {
          this.selectedBird = index
          this.currentPage = 'menu'
        },
        onBack: () => {
          this.currentPage = 'menu'
        }
      })
    }
  }
}