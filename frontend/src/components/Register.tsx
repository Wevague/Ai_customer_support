
import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useRegister } from '../hooks/useRegister'

type RegisterProps = {
  onRegistered: () => void
}

export default function Register({ onRegistered }: RegisterProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [contactError, setContactError] = useState('')

  const { register, loading, error, success } = useRegister()

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()

    // Validate the full name.
    if (!trimmedName) {
      return
    }

    // Require either an email address or a phone number.
    if (!trimmedEmail && !trimmedPhone) {
      setContactError(
        'Please enter either your email address or phone number.',
      )
      return
    }

    setContactError('')

    try {
      await register({
        fullName: trimmedName,
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
        password,
      })

      setFullName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setShowPassword(false)
    } catch {
      // The useRegister hook handles the error message.
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b18] px-4 py-8 text-white sm:px-6 sm:py-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-violet-600/20 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Brand */}
        <header className="mb-8 flex justify-center">
          <a href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <Bot size={25} />
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Support<span className="text-blue-400">Flow</span>
            </span>
          </a>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <section className="hidden lg:block">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles size={16} />
              Your smarter support journey starts here
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
              Build better
              <br />
              customer
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                experiences.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Create your workspace and bring AI-assisted conversations,
              customer messages, and business knowledge together.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <Bot size={21} />
                </span>

                <div>
                  <h3 className="font-medium text-slate-100">
                    AI-powered assistance
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Help your team respond to customer questions more
                    efficiently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
                  <ShieldCheck size={21} />
                </span>

                <div>
                  <h3 className="font-medium text-slate-100">
                    Your own workspace
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Organize your support operations in one place.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Registration form */}
          <section className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
              <div className="mb-7">
                <p className="mb-2 text-sm font-medium tracking-widest text-blue-300">
                  GET STARTED
                </p>

                <h2 className="text-3xl font-semibold tracking-tight">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Join SupportFlow and set up your AI support workspace.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1020] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setContactError('')
                      }}
                      placeholder="you@example.com"
                      aria-describedby="contact-help"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1020] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      minLength={10}
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        setContactError('')
                      }}
                      placeholder="Enter your phone number"
                      aria-describedby="contact-help"
                      className="w-full rounded-xl border border-white/10 bg-[#0b1020] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                <p
                  id="contact-help"
                  className="text-xs leading-5 text-slate-500"
                >
                  Enter your email address or phone number. You can provide
                  both if you prefer.
                </p>

                {/* Contact validation error */}
                {contactError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {contactError}
                  </div>
                )}

                {/* Password */}
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
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
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

                  <p className="mt-2 text-xs text-slate-500">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Backend error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* Success message */}
                {success && (
                  <div
                    role="status"
                    className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                  >
                    {success}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition duration-200 hover:from-blue-500 hover:to-violet-500 hover:shadow-blue-500/20 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating account...' : 'Create account'}

                  {!loading && (
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-white/10 pt-5 text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onRegistered}
                    className="font-semibold text-blue-400 transition hover:text-blue-300 hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
              <ShieldCheck size={15} />
              Secure account creation · SupportFlow
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
