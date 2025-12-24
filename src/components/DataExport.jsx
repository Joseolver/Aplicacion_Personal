
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Download, Loader2 } from 'lucide-react'

export default function DataExport() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        setLoading(true)
        try {
            // Fetch all aspects
            const { data: aspects } = await supabase
                .from('aspects')
                .select('id, name, description, is_active, created_at')
                .eq('user_id', user.id)

            // Fetch all records
            const { data: records } = await supabase
                .from('daily_records')
                .select('aspect_id, date, score, note')
                .eq('user_id', user.id)
                .order('date', { ascending: true })

            // Structure data as planned
            // Group records by date for cleaner JSON
            const historyMap = {}
            records.forEach(r => {
                if (!historyMap[r.date]) {
                    historyMap[r.date] = []
                }
                // Find aspect name for readability in JSON
                const aspectName = aspects.find(a => a.id === r.aspect_id)?.name || 'Unknown'

                historyMap[r.date].push({
                    aspect: aspectName,
                    score: r.score,
                    note: r.note
                })
            })

            const history = Object.entries(historyMap).map(([date, dayRecords]) => ({
                date,
                records: dayRecords
            }))

            const exportData = {
                user_id: user.id,
                generated_at: new Date().toISOString(),
                aspects_metadata: aspects,
                history: history
            }

            // Create downloadable file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `personal-tracking-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

        } catch (error) {
            console.error('Export error:', error)
            alert('Error exporting data')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            title="Exportar datos para IA"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            <span className="hidden sm:inline">Exportar JSON</span>
        </button>
    )
}
