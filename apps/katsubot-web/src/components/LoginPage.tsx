import { Loader2, LogIn } from 'lucide-react'
import { useRef, useState } from 'react'
import { HYOBEE_LABELS } from '../hyobee/strings'
import { getSsoLoginUrl, setAuthToken, setUserProfile, syncUserProfileFromToken } from '../lib/auth'
import { formatLegacyLoginError, loginWithLegacyPassword } from '../lib/legacy-login'

const KATSULABS_LOGO_SRC = '/katsulabs-logo.png'
const KATSULABS_LOGO_CLASS = 'rounded-[19%] ring-1 ring-border'

type LoginPageProps = {
  onSuccess: () => void
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const ssoFormRef = useRef<HTMLFormElement>(null)
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const showDevLogin = import.meta.env.DEV

  const handleSsoLogin = () => {
    setError(null)
    ssoFormRef.current?.requestSubmit()
  }

  const handlePasswordLogin = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const result = await loginWithLegacyPassword({ userId, password })
      setAuthToken(result.token)
      setUserProfile({
        userName: result.userName || userId,
        teamName: result.teamName,
      })
      onSuccess()
    } catch (err) {
      setError(formatLegacyLoginError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleTokenLogin = (token: string) => {
    const trimmed = token.trim()
    if (!trimmed) {
      setError('토큰을 입력해 주세요.')
      return
    }
    setError(null)
    setSubmitting(true)
    setAuthToken(trimmed)
    syncUserProfileFromToken(trimmed)
    onSuccess()
  }

  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-auto bg-background px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-0 size-[28rem] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute -right-16 bottom-0 size-[24rem] rounded-full bg-sky-200/50 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src={KATSULABS_LOGO_SRC}
              alt=""
              width={72}
              height={72}
              className={`mb-4 size-[72px] object-cover ${KATSULABS_LOGO_CLASS}`}
            />
            <h1 className="font-brand text-2xl font-bold tracking-tight text-foreground">
              {HYOBEE_LABELS.brand}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {HYOBEE_LABELS.loginSubtitle}
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              void handlePasswordLogin()
            }}
          >
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="login-user-id">
                {HYOBEE_LABELS.userIdLabel}
              </label>
              <input
                id="login-user-id"
                type="text"
                autoComplete="username"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                placeholder={HYOBEE_LABELS.userIdPlaceholder}
                className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground" htmlFor="login-password">
                {HYOBEE_LABELS.passwordLabel}
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={HYOBEE_LABELS.passwordPlaceholder}
                className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {HYOBEE_LABELS.passwordLogin}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{HYOBEE_LABELS.loginOrDivider}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleSsoLogin}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
          >
            <LogIn className="size-4" aria-hidden />
            {HYOBEE_LABELS.ssoLogin}
          </button>

          <form
            ref={ssoFormRef}
            method="POST"
            action={getSsoLoginUrl()}
            className="hidden"
            aria-hidden
          />

          {showDevLogin ? (
            <div className="mt-8 border-t border-border pt-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {HYOBEE_LABELS.devLoginTitle}
              </p>
              <label className="block text-sm font-medium text-foreground" htmlFor="dev-token">
                {HYOBEE_LABELS.devTokenLabel}
              </label>
              <input
                id="dev-token"
                type="password"
                autoComplete="off"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleTokenLogin(tokenInput)
                  }
                }}
                placeholder={HYOBEE_LABELS.devTokenPlaceholder}
                className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none ring-ring focus:ring-2"
              />
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleTokenLogin(tokenInput)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {HYOBEE_LABELS.devTokenSubmit}
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleTokenLogin('dev-token')}
                  className="rounded-xl border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
                >
                  dev-token
                </button>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {HYOBEE_LABELS.loginFooter}
        </p>
      </div>
    </div>
  )
}
