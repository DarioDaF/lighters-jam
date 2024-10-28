import type { TPoly } from '@/clipper'

function convertPoly(s: string, scale: number) {
  return [
    s.split(' ').map((t) => {
      const ns = t.split(',').map(parseFloat) as [number, number]
      return { X: ns[0] * scale, Y: ns[1] * scale }
    }),
  ]
}

// @TODO: SVG is not a good base as editor is not clean output, needs conversion to points

export const p1: TPoly = convertPoly(
  '-9.4634456,-12.8772 5.660782,14.8649565 2.117392,3.197693 3.7158203e-7,5.3305885 1.8581194,5.1854495 1.944543,-2.808785 4.882965,-15.2538705 -1.555634,-1.55564 -3.413755,-0.734594 -3.11126903,-0.561766 -2.59272497,9e-6 -3.845876,0.734605 -2.203816,0.561757',
  8,
)
export const p2: TPoly = convertPoly(
  '4.1396724,7.5599935 -0.354793,0.20484 -2.149066,0.893597 -2.549793,0.978774 -0.400727,0.08518 -2.32002003,0.185763 -2.727456,0.14294 -0.407435,-0.042824 -2.263873,-0.540255 -2.638134,-0.706886 -0.374261,-0.166632 -1.986125,-1.213389 -2.290576,-1.487518 -0.304452,-0.274129 -1.513959,-1.767746 -1.718799,-2.122539 -0.20484,-0.354793 -0.893596,-2.149067 -0.978774,-2.549794 -0.08518,-0.400727 -0.185763,-2.32001901 -0.142939,-2.72745501 0.04282,-0.40743499 0.540254,-2.26387399 0.706886,-2.63813499 0.166632,-0.374261 1.213388,-1.986124 1.487517,-2.290575 0.274129,-0.304451 1.767747,-1.513959 2.12254,-1.718799 0.354793,-0.2048399 2.149065,-0.8935966 2.549793,-0.9787737 0.400727,-0.085177 2.32001997,-0.1857631 2.72745497,-0.1429399 0.40743603,0.042823 2.26387403,0.5402543 2.63813503,0.706886 0.374261,0.1666318 1.986124,1.2133886 2.290576,1.4875176 0.304451,0.274129 1.513958,1.767746 1.718798,2.122539 0.20484,0.354793 0.893597,2.149067 0.978774,2.549794 0.08518,0.400727 0.185763,2.32001899 0.14294,2.72745499 -0.04282,0.40743501 -0.540255,2.26387401 -0.706886,2.63813501 -0.166632,0.374261 -1.213388,1.986124 -1.487517,2.290575 -0.27413,0.304451 -1.767747,1.513959 -2.12254,1.718799',
  8,
)
export const p3: TPoly = convertPoly(
  '-5.6639816,-26.265094 -0.616618,28.6417585 3.619881,12.3770925 -5.21403,0.869748 -5.418756,-0.08192 -5.706755,-0.577195 4.628198,-12.9118165',
  8,
)

console.log(p1, p2, p3)