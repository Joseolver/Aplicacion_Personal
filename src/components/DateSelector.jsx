
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function DateSelector({ currentDate, onDateChange }) {
    const today = new Date().toISOString().split('T')[0]

    const handlePrev = () => {
        const prev = new Date(currentDate)
        prev.setDate(prev.getDate() - 1)
        onDateChange(prev.toISOString().split('T')[0])
    }

    const handleNext = () => {
        const next = new Date(currentDate)
        next.setDate(next.getDate() + 1)
        onDateChange(next.toISOString().split('T')[0])
    }

    const formatDate = (dateStr) => {
        // Force UTC to prevent timezone shifts manually, or just use simple date parts if robust
        // Using "UTC" here to match what we likely store or just rely on local since the app is local-first visual
        const date = new Date(dateStr)
        return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    }

    const isToday = currentDate === today

    return (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-800 ring-1 ring-slate-50 dark:ring-slate-500/10 mb-8 max-w-md mx-auto transition-colors">
            <button
                onClick={handlePrev}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all active:scale-95"
                title="Día anterior"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex flex-col items-center px-4 cursor-default select-none">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Calendar size={16} className="text-indigo-500 opacity-80" />
                    <span className="font-bold text-base capitalize tracking-tight">
                        {formatDate(currentDate)}
                    </span>
                </div>
                {isToday && (
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">
                        Hoy
                    </span>
                )}
            </div>

            <button
                onClick={handleNext}
                disabled={currentDate >= today}
                className={`
                    p-3 rounded-xl transition-all active:scale-95
                    ${currentDate >= today
                        ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed'
                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}
                `}
                title="Día siguiente"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    )
}
