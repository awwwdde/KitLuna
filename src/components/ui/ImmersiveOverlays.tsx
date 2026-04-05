import { memo } from 'react'

const grainSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E"

/** Тонкая плёнка: зерно + виньетка + лёгкий «блик» — не перехватывает события. */
export const ImmersiveOverlays = memo(function ImmersiveOverlays() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[12] opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("${grainSvg}")`,
          backgroundRepeat: 'repeat',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[12] bg-[radial-gradient(ellipse_75%_60%_at_50%_42%,transparent_0%,rgba(0,0,0,0.32)_70%,rgba(0,0,0,0.68)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[12] opacity-[0.06] mix-blend-soft-light"
        style={{
          background:
            'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.04) 48%, transparent 56%)',
        }}
        aria-hidden
      />
    </>
  )
})
