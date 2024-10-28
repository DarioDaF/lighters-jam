/* eslint-disable */

// @ts-expect-error Library does not have types
import ClipperLib from 'clipper-lib'

// https://github.com/Doodle3D/clipper-js // @TODO: Seems simpler, try later

import earcut from 'earcut'
import { PolygonMeshBuilder } from '@babylonjs/core/Meshes/polygonMesh'
import { Vector2 } from './babylon_common'

export type TPoint = {
  X: number
  Y: number
}
export type TCountour = TPoint[]
export type TPoly = TCountour[]

export function* PolyToVertexDatas(poly: TPoly) {
  function toVectors(val: TCountour) {
    return val.map(p => new Vector2(p.X, p.Y))
  }

  let lastMesher: PolygonMeshBuilder | null = null
  for (const countour of poly) {
    if (CountourArea(countour) > 0) {
      // Outer
      if (lastMesher !== null) {
        // Build
        yield lastMesher.buildVertexData()
      }
      lastMesher = new PolygonMeshBuilder('_polyMesher', toVectors(countour), undefined, earcut)
    } else {
      // Hole
      lastMesher?.addHole(toVectors(countour))
    }
  }
  if (lastMesher !== null) {
    // Build
    yield lastMesher.buildVertexData()
  }
}

const clipper = new ClipperLib.Clipper()
//clipper.StrictlySimple = true

export const p1: TPoly = [
  [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
  [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]
]
export var p2: TPoly = [
  [{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150}],
  [{X:60,Y:60},{X:60,Y:140},{X:140,Y:140},{X:140,Y:60}]
]

export function CountourArea(p: TCountour) {
  let area = 0
  for (let i = 0; i < p.length; ++i) {
    let j = (i + 1) % p.length

    area += p[i].X * p[j].Y
    area -= p[j].X * p[i].Y
  }

  return area
}

const _BoolOps = {
  union: ClipperLib.ClipType.ctUnion,
  difference: ClipperLib.ClipType.ctDifference,
  xor: ClipperLib.ClipType.ctXor,
  intersection: ClipperLib.ClipType.ctIntersection
} as const

export function PolyBool(p1: TPoly, p2: TPoly, op: keyof typeof _BoolOps) {
  clipper.AddPaths(p1, ClipperLib.PolyType.ptSubject, true) // true means closed path
  clipper.AddPaths(p2, ClipperLib.PolyType.ptClip, true)

  let solution: TPoly | null = new ClipperLib.Paths()
  if (!clipper.Execute(
    _BoolOps[op], solution,
    ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero
  )) {
    solution = null
  }
  clipper.Clear()
  return solution
}
