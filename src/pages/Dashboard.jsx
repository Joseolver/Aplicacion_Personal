
import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import AspectManager from '../components/AspectManager'
import DateSelector from '../components/DateSelector'
import RecordCard from '../components/RecordCard'
import DataExport from '../components/DataExport'
import { Loader2, LogOut } from 'lucide-react'

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const [aspects, setAspects] = useState([])
    const [records, setRecords] = useState([])
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [aspectsRes, recordsRes] = await Promise.all([
                supabase
                    .from('aspects')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('position', { ascending: true }),
                supabase
                    .from('daily_records')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('date', currentDate)
            ])

            if (aspectsRes.error) throw aspectsRes.error
            if (recordsRes.error) throw recordsRes.error

            setAspects(aspectsRes.data || [])
            setRecords(recordsRes.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const refreshAspects = async () => {
        const { data } = await supabase
            .from('aspects')
            .select('*')
            .eq('user_id', user.id)
            .order('position', { ascending: true })
        setAspects(data || [])
    }

    const recordsMap = useMemo(() => {
        const map = {}
        records.forEach(r => {
            map[r.aspect_id] = r
        })
        return map
    }, [records])

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user, currentDate])

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Professional Header */}
            <header className="glass sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src="/icono.svg" alt="Logo" className="w-9 h-9 shadow-sm rounded-full" />
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Permon</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <DataExport />
                        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-semibold text-slate-700">{user?.email?.split('@')[0]}</p>
                            </div>
                            <button
                                onClick={signOut}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                title="Cerrar sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <DateSelector currentDate={currentDate} onDateChange={setCurrentDate} />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin h-10 w-10 text-indigo-600 opacity-20" />
                    </div>
                ) : (
                    <>
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                                    Registro Diario
                                </h2>
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                    {new Date(currentDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}
                                </span>
                            </div>

                            {aspects.filter(a => a.is_active).length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">✨</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-800">Todo listo para empezar</h3>
                                    <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                                        Define las áreas de tu vida que quieres monitorear en la sección de abajo.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {aspects.filter(a => a.is_active).map(aspect => (
                                        <RecordCard
                                            key={aspect.id}
                                            aspect={aspect}
                                            date={currentDate}
                                            userId={user.id}
                                            record={recordsMap[aspect.id]}
                                            onUpdate={fetchData}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-200 pt-10">
                            <AspectManager aspects={aspects} onUpdate={refreshAspects} />
                        </div>
                    </>
                )}
            </main>

            <div className="mt-12 text-center pb-8 opacity-40 hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-slate-500 font-medium">Permon v1.0.1 • {new Date().getFullYear()}</p>
            </div>
        </div>
    )
}
