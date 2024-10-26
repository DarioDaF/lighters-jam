import { Engine } from '@/babylon_common'
import { RollingAverage } from '@babylonjs/core/Misc/performanceMonitor'

export interface IGameScene {
  loop(): void
  enter(): void
  exit(): void
}

export class GameInstance {
  canvas: HTMLCanvasElement

  resizeObserver: ResizeObserver

  fpsContainer: HTMLSpanElement
  fpsVarContainer: HTMLSpanElement

  engine: Engine

  fpsUpdateInterval: number
  fpsAvg: RollingAverage

  activeGameScene: IGameScene | undefined = undefined

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement
    this.fpsContainer = document.getElementById('gameFps') as HTMLSpanElement
    this.fpsVarContainer = document.getElementById('gameFpsVar') as HTMLSpanElement

    this.engine = new Engine(this.canvas, true)
    this.fpsAvg = new RollingAverage(60)

    this.resizeObserver = new ResizeObserver(() => this.engine.resize())
    this.resizeObserver.observe(this.canvas)

    this.engine.runRenderLoop(() => {
      const fps = this.engine.getFps()
      if (isFinite(fps)) {
        this.fpsAvg.add(fps)
      }
      this.activeGameScene?.loop()
    })
    this.fpsUpdateInterval = setInterval(() => {
      this.fpsContainer.innerText = this.fpsAvg.average.toFixed(2)
      this.fpsVarContainer.innerText = this.fpsAvg.variance.toFixed(2)
    }, 1000)
  }

  changeScene(scene?: IGameScene) {
    this.activeGameScene?.exit()
    this.activeGameScene = scene
    this.activeGameScene?.enter()
  }

  dispose() {
    this.changeScene(undefined)

    clearInterval(this.fpsUpdateInterval)
    this.fpsUpdateInterval = null!

    this.resizeObserver?.disconnect()
    this.resizeObserver = null!

    this.engine?.dispose()
    this.engine = null!
  }
}
