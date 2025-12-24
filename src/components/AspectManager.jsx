
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Loader2, Plus, X, Archive, ArrowUp } from 'lucide-react'

export default function AspectManager({ aspects, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('aspects')
                .insert([
                    { user_id: user.id, name, description, position: aspects.length }
                ])

            if (error) throw error

            setName('')
            setDescription('')
            setIsOpen(false)
            onUpdate()
        } catch (error) {
            console.error('Error adding aspect:', error)
            alert('Error creating aspect')
        } finally {
            setLoading(false)
        }
    }

    const handleArchive = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('aspects')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            onUpdate()
        } catch (error) {
            console.error('Error updating aspect:', error)
        }
    }

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Aspectos Personalizados</h2>
                    <p className="text-sm text-slate-500">Gestiona las métricas que quieres seguir</p>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm ${isOpen
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                        }`}
                >
                    {isOpen ? <X size={16} /> : <Plus size={16} />}
                    {isOpen ? 'Cancelar' : 'Nuevo Aspecto'}
                </button>
            </div>

            {isOpen && (
                <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-in fade-in slide-in-from-top-4 ring-1 ring-indigo-50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Nombre del aspecto</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Calidad del Sueño"
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Descripción (Contexto para IA)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Ej: 1-10, qué tan descansado me siento..."
                                    className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Guardar Aspecto'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {aspects.map((aspect) => (
                    <div
                        key={aspect.id}
                        className={`group relative p-5 rounded-xl border transition-all duration-300 ${aspect.is_active
                                ? 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'
                                : 'bg-slate-50 border-slate-200 opacity-60'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-bold ${aspect.is_active ? 'text-slate-800' : 'text-slate-500'}`}>
                                {aspect.name}
                            </h3>
                            <button
                                onClick={() => handleArchive(aspect.id, aspect.is_active)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
                                title={aspect.is_active ? 'Archivar' : 'Reactivar'}
                            >
                                {aspect.is_active ? <Archive size={16} /> : <ArrowUp size={16} />}
                            </button>
                        </div>
                        {aspect.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{aspect.description}</p>
                        )}
                        {!aspect.is_active && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                                    Archivado
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
