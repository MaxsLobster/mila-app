import { useMotionFlags } from '../../lib/motion'

const TONE_STYLES = {
  good: {
    bg: 'from-sage/15 via-sage-soft/40 to-cream',
    dot: 'bg-sage',
    glow: 'shadow-[0_8px_32px_-12px_rgba(163,177,138,0.4)]',
    border: 'border-sage/20',
  },
  info: {
    bg: 'from-terracotta/10 via-terracotta-soft/40 to-cream',
    dot: 'bg-terracotta',
    glow: 'shadow-[0_8px_32px_-12px_rgba(200,125,90,0.35)]',
    border: 'border-terracotta/20',
  },
  warning: {
    bg: 'from-amber-100 via-amber-50 to-cream',
    dot: 'bg-amber-600',
    glow: 'shadow-[0_8px_32px_-12px_rgba(217,119,6,0.3)]',
    border: 'border-amber-300/40',
  },
}

export default function BriefingCard({ briefing }) {
  const { fluidAnimated } = useMotionFlags()
  const style = TONE_STYLES[briefing.tone] ?? TONE_STYLES.info

  return (
    <article
      className={`relative bg-gradient-to-br ${style.bg} rounded-3xl p-6 border ${style.border} ${style.glow} overflow-hidden`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${style.dot} ${fluidAnimated ? 'animate-[breath_2.4s_ease-in-out_infinite]' : ''}`} aria-hidden />
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink/55 font-semibold">
          {briefing.prefix}
        </p>
      </div>

      <h2 className="text-[22px] md:text-2xl font-semibold leading-tight tracking-tight text-ink">
        {briefing.title}
      </h2>
      <p className="text-[15px] md:text-base text-ink/75 leading-relaxed mt-2">
        {briefing.body}
      </p>

      <style>{`
        @keyframes breath {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }
      `}</style>
    </article>
  )
}
