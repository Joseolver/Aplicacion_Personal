
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '', simple = false }) {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    if (simple) {
        return (
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
                title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg grid place-items-center transition-all hover:scale-105 active:scale-95 border border-slate-200 dark:border-slate-700 ${className}`}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun
                    className={`absolute text-amber-500 transition-all duration-500 ${isDark ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}
                    size={20}
                    strokeWidth={1.5}
                />
                <Moon
                    className={`absolute text-indigo-400 transition-all duration-500 ${isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}
                    size={20}
                    strokeWidth={1.5}
                />
            </div>
        </button>
    )
}
