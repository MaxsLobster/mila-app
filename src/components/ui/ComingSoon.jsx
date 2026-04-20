export default function ComingSoon({ title, icon: Icon, milestone, description }) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] text-ink/50 uppercase tracking-[0.15em] font-semibold">{milestone}</p>
        <h1 className="text-[32px] md:text-4xl font-semibold tracking-tight mt-1 leading-none">{title}</h1>
      </header>

      <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center mx-auto mb-4">
          {Icon && <Icon size={26} strokeWidth={1.8} />}
        </div>
        <p className="font-medium">Kommt in {milestone}</p>
        <p className="text-sm text-ink/55 mt-1.5 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
