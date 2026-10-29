import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useLogin } from '../hooks/useLogin'

type LoginProps = {
  onLogin: () => void
  onRegister: () => void
}

export default function Login({ onLogin, onRegister }: LoginProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { login, loading, error } = useLogin()

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await login(identifier, password)
      onLogin()
    } catch {
      // The useLogin hook handles the error.
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b18] text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
        {/* Brand and showcase */}
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <Bot size={27} />
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Support<span className="text-blue-400">Flow</span>
            </span>
          </div>

          <div className="mt-20 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles size={16} />
              Intelligent support, made simple
            </div>

            <h1 className="text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
              Support your
              <br />
              customers with
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                a smarter AI.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Bring customer conversations, helpful AI responses, and your
              business knowledge together in one powerful workspace.
            </p>
          </div>

          <div className="mt-12 max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <Bot size={20} />
              </span>

              <div>
                <p className="font-medium">AI Support Assistant</p>
                <p className="mt-1 text-xs text-slate-400">
                  Your workspace, at a glance
                </p>
              </div>

              <span className="ml-auto flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Ready
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="ml-8 rounded-2xl rounded-tr-sm bg-white/[0.07] px-4 py-3 text-sm leading-6 text-slate-300">
                Where can I find my order delivery information?
              </div>

              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
                  <Bot size={17} />
                </span>

                <div className="rounded-2xl rounded-tl-sm border border-blue-400/15 bg-blue-500/[0.08] px-4 py-3 text-sm leading-6 text-slate-300">
                  I can help with that! Let's check your order details and
                  find the latest delivery update.
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-300">
                    <Sparkles size={12} />
                    AI-assisted response preview
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={16} />
            A focused workspace for better customer experiences
          </div>
        </section>

        {/* Login card */}
        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600">
                <Bot size={25} />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                Support<span className="text-blue-400">Flow</span>
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                <LockKeyhole size={23} />
              </div>

              <p className="mb-2 text-sm font-medium text-blue-300">
                WELCOME BACK
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter your details to access your support dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email or phone
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    autoComplete="username"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition duration-200 hover:from-blue-500 hover:to-violet-500 hover:shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Registration link */}
            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onRegister}
                  className="font-semibold text-blue-400 transition hover:text-blue-300 hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} />
              Your account is protected by secure authentication.
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}