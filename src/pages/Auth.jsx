import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Loader2, ArrowRight } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            if (isLogin) {
                const { error } = await signIn({ email, password })
                if (error) throw error
                navigate('/')
            } else {
                const { error } = await signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                })
                if (error) throw error
                navigate('/')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative">
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Visual Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90"></div>
                <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
                    <div>
                        <div className="w-12 h-12 mb-6">
                            <img src="/icono.svg" alt="Logo" className="w-full h-full object-contain drop-shadow-md brightness-0 invert" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Mide, analiza y<br />mejora tu vida.</h1>
                        <p className="text-slate-400 text-lg max-w-sm">Registra lo que importa, mantén la consistencia y deja que los datos cuenten tu historia.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="w-8 h-px bg-slate-700"></div>
                            <span className="text-sm tracking-widest uppercase">Permon</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="lg:hidden w-50 h-50 mx-auto mb-8">
                        <img src="/icono.svg" alt="Logo" className="w-full h-full object-contain" />
                    </div>

                    <div className="text-left mb-10">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            {isLogin ? 'Bienvenido de nuevo' : 'Comienza tu viaje'}
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            {isLogin ? 'Introduce tus datos para acceder.' : 'Crea una cuenta para empezar a registrar.'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                className="block w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                required
                                className="block w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : (
                                <>
                                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            <button
                                type="button"
                                className="ml-2 font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setError('')
                                }}
                            >
                                {isLogin ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
