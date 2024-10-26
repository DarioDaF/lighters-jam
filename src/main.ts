import './style.css'

import { FreeCamera, Scene, Sprite, SpriteManager, Vector3 } from 'babylonjs'
import { GameInstance, IGameScene } from './game'

class MyScene implements IGameScene {
  gi: GameInstance
  scene: Scene

  s1: Sprite

  constructor(gi: GameInstance) {
    this.gi = gi

    this.scene = new Scene(gi.engine)

    const cam = new FreeCamera('camera', new Vector3(0, 0, -10), this.scene)
    cam.target.set(0, 0, 0)

    const x = new SpriteManager('mgr1', './images/placeholder.png', 50, { width: 204, height: 192 }, this.scene)
    this.s1 = new Sprite('a', x)
  }

  enter() {
    this.s1.position.set(0, 0, 0)
  }

  exit() {}

  loop() {
    const delta = this.gi.engine.getDeltaTime()
    this.s1.position.addInPlaceFromFloats(0.0001 * delta, 0.0001 * delta, 0.0)

    this.scene.render()
  }

  dispose() {
    this.scene?.dispose()
    this.scene = null!
  }
}

const instance = new GameInstance()

instance.canvas.addEventListener('keydown', (e) => {
  if (e.key.toUpperCase() === 'R') {
    instance.changeScene(instance.activeGameScene)
  }
})

const scene = new MyScene(instance)
instance.changeScene(scene)
