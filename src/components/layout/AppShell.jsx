import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

export default function AppShell({ children }) {
  return (
    <div className="min-h-[100dvh]">
      <Sidebar />
      <main className="pb-24 md:pb-10 md:pl-64">
        <div className="max-w-3xl mx-auto px-5 pt-6 md:pt-10">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
