
import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Loader2, MessageSquare, StickyNote } from 'lucide-react'

export default function RecordCard({ aspect, record, date, userId, onUpdate }) {
    const [score, setScore] = useState(record?.score ?? '')
    const [note, setNote] = useState(record?.note ?? '')
    const [isSaving, setIsSaving] = useState(false)
    const [showNote, setShowNote] = useState(!!record?.note)
    const timeoutRef = useRef(null)

    // Debounced save
    const handleChange = (newScore, newNote) => {
        setScore(newScore)
        setNote(newNote)
        setIsSaving(true)

        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(async () => {
            await saveRecord(newScore, newNote)
        }, 800)
    }

    const saveRecord = async (s, n) => {
        if (s === '' && n === '') {
            // If empty, delete record
            if (record?.id) {
                await supabase.from('daily_records').delete().eq('id', record.id)
                onUpdate() // Refresh parent state
            }
            setIsSaving(false)
            return
        }

        const payload = {
            user_id: userId,
            aspect_id: aspect.id,
            date: date,
            score: s === '' ? null : parseFloat(s),
            note: n
        }

        try {
            if (record?.id) {
                await supabase.from('daily_records').update(payload).eq('id', record.id)
            } else {
                await supabase.from('daily_records').insert(payload)
                // We should ideally get the ID back and update parent, 
                // but onUpdate() refreshes everything for simplicity in MVP
            }
            onUpdate()
        } catch (err) {
            console.error('Error saving record:', err)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className={`
            relative p-5 rounded-2xl border transition-all duration-300 group
            ${score !== ''
                ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/30 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.1)] ring-1 ring-indigo-50 dark:ring-indigo-500/10 transform hover:-translate-y-0.5'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
            }
        `}>
            <div className="flex justify-between items-start mb-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight">
                    {aspect.name}
                </label>
                {isSaving && (
                    <div className="absolute top-4 right-4 animate-in fade-in duration-300">
                        <Loader2 className="animate-spin text-indigo-500" size={16} />
                    </div>
                )}
            </div>

            <div className="flex gap-3 items-stretch h-12">
                <div className="relative flex-1">
                    <input
                        type="number"
                        step="0.1"
                        placeholder="-"
                        value={score}
                        onChange={(e) => handleChange(e.target.value, note)}
                        className={`
                            w-full h-full text-center font-mono text-2xl font-semibold tracking-tight rounded-xl transition-all
                            border-0 focus:ring-2
                            ${score !== ''
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10 focus:ring-indigo-500/50'
                                : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-slate-300 dark:focus:ring-slate-700'
                            }
                            placeholder:text-slate-300 dark:placeholder:text-slate-700
                        `}
                    />
                </div>

                <button
                    onClick={() => setShowNote(!showNote)}
                    className={`
                        w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200
                        ${showNote || note
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-200 dark:ring-indigo-500/30'
                            : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300'
                        }
                    `}
                    title="Añadir nota"
                >
                    {showNote || note ? <StickyNote size={20} /> : <MessageSquare size={20} />}
                </button>
            </div>

            {(showNote || note) && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <textarea
                        value={note}
                        onChange={(e) => handleChange(score, e.target.value)}
                        placeholder="¿Algo destacable hoy?"
                        rows={2}
                        className="w-full text-sm rounded-xl border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-500 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none p-3 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-700 dark:text-slate-300 shadow-inner"
                    />
                </div>
            )}
        </div>
    )
}
