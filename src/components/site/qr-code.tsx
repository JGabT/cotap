import { cn } from "@/lib/utils"

const SIZE = 21
const FINDERS: Array<[number, number]> = [
  [0, 0],
  [SIZE - 7, 0],
  [0, SIZE - 7],
]

function finderValue(x: number, y: number): boolean | null {
  for (const [ox, oy] of FINDERS) {
    const dx = x - ox
    const dy = y - oy
    if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
      if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false
      const border = dx === 0 || dx === 6 || dy === 0 || dy === 6
      const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
      return border || core
    }
  }
  return null
}

function buildPath() {
  let seed = 0x1f2e3d4c
  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 0x100000000
    return seed / 0x100000000
  }

  let path = ""
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const finder = finderValue(x, y)
      let dark = false

      if (finder !== null) {
        dark = finder
      } else if (
        (x === 6 && y > 7 && y < 13) ||
        (y === 6 && x > 7 && x < 13)
      ) {
        dark = (x + y) % 2 === 0
      } else if (x >= 16 && x <= 20 && y >= 16 && y <= 20) {
        const dx = x - 16
        const dy = y - 16
        dark = dx === 0 || dx === 4 || dy === 0 || dy === 4 || (dx === 2 && dy === 2)
      } else {
        dark = random() > 0.53
      }

      if (dark) path += `M${x} ${y}h1v1h-1z`
    }
  }
  return path
}

const QR_PATH = buildPath()

export function QrCode({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn("block", className)}
    >
      <path d={QR_PATH} fill="currentColor" />
    </svg>
  )
}

export function NfcGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6 9a9 9 0 0 1 0 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.5 7.2a9 9 0 0 1 0 9.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M13 5.4a9 9 0 0 1 0 13.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
