import './style.css'

import './clipper'

import { FreeCamera, Scene, Sprite, SpriteManager, Vector3, Color3, Vector2, Matrix } from '@/babylon_common'
import { GameInstance, IGameScene } from './game'
import { PolyBool, PolyToVertexDatas, TPoly } from './clipper'

import '@babylonjs/core/Materials/standardMaterial' // Standard material side effects

import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData'
import { DeviceSourceManager, DeviceType } from '@babylonjs/core/DeviceInput'

class MyMeshPool {
  pool: Mesh[] = []
  count: number = 0
  scene: Scene

  constructor(scene: Scene) {
    this.scene = scene
  }

  begin() {
    this.count = 0
  }

  set(data: VertexData, color: Color3) {
    while (this.count >= this.pool.length) {
      const newMesh = new Mesh('', this.scene)
      newMesh.material = new StandardMaterial('', this.scene)
      this.pool.push(newMesh)
    }
    const mesh = this.pool[this.count]
    mesh.resetLocalMatrix()
    data.applyToMesh(mesh)
    mesh.isVisible = true
    ;(mesh.material as StandardMaterial).ambientColor = color
    this.count += 1
    return mesh
  }

  end() {
    for (let i = this.count; i < this.pool.length; ++i) {
      this.pool[i].isVisible = false
    }
  }
}

function mapClampUnit(v: number, _min: number, _max: number) {
  return Math.min(Math.max((v - _min) / (_max - _min), 0), 1)
}

class MyScene implements IGameScene {
  gi: GameInstance
  scene: Scene
  cam: FreeCamera

  vdir: Vector2 = new Vector2()

  s1: Sprite
  pool: MyMeshPool
  poly0: TPoly
  dsm: DeviceSourceManager

  constructor(gi: GameInstance) {
    this.gi = gi

    this.scene = new Scene(this.gi.engine)
    this.scene.ambientColor.set(1, 1, 1)

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const $phoneInput = document.getElementById('gamePhoneInput')!
    if (isMobile) {
      for (const $el of $phoneInput.querySelectorAll<HTMLTableCellElement>('[data-dir]')) {
        $el.addEventListener('touchstart', () => {
          const dir = JSON.parse($el.dataset.dir!) as [number, number]
          this.vdir.set(...dir)
        })
        $el.addEventListener('touchend', () => {
          const dir = JSON.parse($el.dataset.dir!) as [number, number]
          if ((dir[0] === this.vdir.x) && (dir[1] === this.vdir.y))
            this.vdir.set(0, 0)
        })
      }
    } else {
      $phoneInput.style.display = 'none'
    }

    this.dsm = new DeviceSourceManager(this.gi.engine)

    this.cam = new FreeCamera('camera', new Vector3(0, 0, -10), this.scene)
    this.cam.target.set(0, 0, 0)

    const x = new SpriteManager('mgr1', './images/placeholder.png', 50, { width: 204, height: 192 }, this.scene)
    this.s1 = new Sprite('a', x)

    this.pool = new MyMeshPool(this.scene)

    this.poly0 = [
      [ { X: -500, Y: -500 }, { X: 500, Y: -500 }, { X: 500, Y: 500 }, { X: -500, Y: 500 } ],
      [ { X: -100, Y: -100 }, { X: -100, Y: 100 }, { X: 100, Y: 100 }, { X: 100, Y: -100 } ],
    ]
  }

  _kbdDir() {
    const kbd = this.dsm.getDeviceSource(DeviceType.Keyboard)
    if (kbd) {
      return new Vector2(kbd.getInput(39) - kbd.getInput(37), kbd.getInput(38) - kbd.getInput(40))
    } else {
      return new Vector2()
    }
  }

  enter() {
    this.s1.position.set(0, 0, 0)
  }

  exit() {}

  loop() {
    const delta = this.gi.engine.getDeltaTime()

    const kbdDir = this._kbdDir()
    kbdDir.addInPlace(this.vdir)
    this.s1.angle -= 0.0015 * delta * kbdDir.x
    const s1Transform = Matrix.RotationZ(this.s1.angle)

    this.s1.position.addInPlace(Vector3.TransformNormal(new Vector3(0, 0.003 * delta * kbdDir.y, 0), s1Transform))

    s1Transform.setTranslation(this.s1.position)

    //
    const polyCone: TPoly = [
      [ { X: 0, Y: 0 }, { X: 150, Y: 200 }, { X: 0, Y: 250 }, { X: -150, Y: 200 } ],
    ]

    const vSrc = new Vector2()
    const vTgt = new Vector2()
    for (const countour of polyCone) {
      for (const p of countour) {
        vSrc.set(p.X / 100, p.Y / 100)
        Vector2.TransformToRef(vSrc, s1Transform, vTgt)
        p.X = vTgt.x * 100
        p.Y = vTgt.y * 100
      }
    }

    // Contract poly0
    const prevPoint = new Vector2()
    const currPoint = new Vector2()
    const nextPoint = new Vector2()
    for (const countour of this.poly0) {
      //const isOuter = CountourArea(countour) > 0
      let _p = countour[countour.length - 1]
      currPoint.set(_p.X, _p.Y)
      _p = countour[0]
      nextPoint.set(_p.X, _p.Y)
      for (let i = 0; i < countour.length; ++i) {
        prevPoint.set(currPoint.x, currPoint.y)
        currPoint.set(nextPoint.x, nextPoint.y)
        _p = countour[(i + 1) % countour.length]
        nextPoint.set(_p.X, _p.Y)
        /*
        const normal = (
          (currPoint.subtract(prevPoint).normalize())
            .subtract(nextPoint.subtract(currPoint).normalize())
            .normalize()
        )
        if (!isOuter) {
          normal.negateInPlace()
        }
        */
        const tangent = (
          (currPoint.subtract(prevPoint).normalize())
            .add(nextPoint.subtract(currPoint).normalize())
            .normalize()
        )
        _p = countour[i]

        const dFactor = mapClampUnit(currPoint.subtract(this.s1.position.scale(100)).length(), 10, 1000)
        _p.X += tangent.y * (0.002 + dFactor * 0.1) * delta
        _p.Y += -tangent.x * (0.002 + dFactor * 0.1) * delta
        // Bound limits
        _p.X = Math.min(Math.max(_p.X, -500), 500)
        _p.Y = Math.min(Math.max(_p.Y, -500), 500)
      }
    }

    const result = PolyBool(this.poly0, polyCone, 'difference')
    if (result !== null) {
      this.poly0 = result
    }
    console.log(`Blocks: ${this.poly0.length} | MaxVerts: ${Math.max(...this.poly0.map(c => c.length))}`)

    this.pool.begin()
    let hue: number = 0
    for (const blockData of PolyToVertexDatas(this.poly0)) {
      const mesh = this.pool.set(blockData, Color3.FromHSV(hue, 1, 1))
      hue += 10
      mesh.scaling.set(0.01, 0.01, 0.01)
      mesh.rotation.addInPlace(new Vector3(-Math.PI / 2, 0, 0))
    }
    this.pool.end()
    //

    this.cam.position.set(this.s1.position.x, this.s1.position.y, this.cam.position.z)

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
