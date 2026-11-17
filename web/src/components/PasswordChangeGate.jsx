import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthProvider'
import { supabase } from '../lib/supabase'
import { errMessage } from '../lib/errors'
import { passwordError } from '../lib/password'
import { CURRENT_TERMS_VERSION } from '../lib/termsConfig'
import Logo from './Logo'
import Spinner from './Spinner'

// Blocks the whole app until a user created with a temporary password (must_change_password)
// picks their own. The temp password is single-use in practice: nothing else renders until
// this is done. Sits outside OnboardingGate so the password change happens first.
export default function PasswordChangeGate({ children }) {
  const { profile, profileLoaded, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // If user must change password, ensure terms are accepted first
  const termsAccepted = Boolean(
    profile?.terms_step1_accepted &&
    profile?.terms_step2_accepted &&
    profile?.terms_step3_accepted &&
    profile?.terms_version === CURRENT_TERMS_VERSION
  )

  useEffect(() => {
    if (profileLoaded && profile?.must_change_password && !termsAccepted) {
      navigate('/terms', { replace: true })
    }
  }, [profileLoaded, profile, termsAccepted, navigate])

  // spin only while the fetch is in flight, never on a genuinely missing row.
  if (!profileLoaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-page">
        <div className="flex flex-col items-center gap-4"><Logo className="h-12 w-auto" /><Spinner size={24} /></div>
      </div>
    )
  }

  // no profile row yet: nothing to force here — let OnboardingGate send them to /onboarding.
  if (!profile) return children

  if (profile.must_change_password && !termsAccepted) {
    // Render nothing while navigation occurs
    return null
  }
  if (!profile.must_change_password) return children

  async function submit(e) {
    e.preventDefault()
    setError('')
    const pwErr = passwordError(pw)
    if (pwErr) return setError(pwErr)
    if (pw !== confirm) return setError('Passwords do not match.')
    setBusy(true)
    const { error: upErr } = await supabase.auth.updateUser({ password: pw })
    if (upErr) { setBusy(false); return setError(errMessage(upErr, 'Could not update your password. Try again.')) }
    const { error: flagErr } = await supabase.rpc('set_password_changed')
    if (flagErr) { setBusy(false); return setError(errMessage(flagErr, 'Password changed, but something went wrong. Refresh and try again.')) }
    await refreshProfile() // must_change_password is now false -> the gate falls through to children
    setBusy(false)
  }

  return (
    <main className="grid min-h-screen place-items-center bg-page px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center"><Logo className="h-12 w-auto" /></div>
        <div className="card p-6">
          <h1 className="text-lg font-bold">Set a new password</h1>
          <p className="mt-1 text-sm text-muted">You signed in with a temporary password. Choose your own to continue.</p>
          <form onSubmit={submit} className="mt-4 space-y-3">
            {error && <div role="alert" className="rounded-lg border border-down/30 bg-down/10 px-3 py-2 text-sm text-down">{error}</div>}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">New password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  tabIndex={0}
                  title="Hold to reveal password"
                  aria-label="Hold to reveal password"
                  onMouseDown={(e) => { e.preventDefault(); setShowPw(true) }}
                  onMouseUp={() => setShowPw(false)}
                  onMouseLeave={() => setShowPw(false)}
                  onTouchStart={() => setShowPw(true)}
                  onTouchEnd={() => setShowPw(false)}
                  onTouchCancel={() => setShowPw(false)}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowPw(true) } }}
                  onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { setShowPw(false) } }}
                  onBlur={() => setShowPw(false)}
                  className="group absolute inset-y-0 right-0 flex items-center pr-3 select-none cursor-pointer focus:outline-none"
                >
                  {showPw ? (
                    <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-muted group-hover:text-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Confirm password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  tabIndex={0}
                  title="Hold to reveal password"
                  aria-label="Hold to reveal password"
                  onMouseDown={(e) => { e.preventDefault(); setShowConfirm(true) }}
                  onMouseUp={() => setShowConfirm(false)}
                  onMouseLeave={() => setShowConfirm(false)}
                  onTouchStart={() => setShowConfirm(true)}
                  onTouchEnd={() => setShowConfirm(false)}
                  onTouchCancel={() => setShowConfirm(false)}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setShowConfirm(true) } }}
                  onKeyUp={(e) => { if (e.key === ' ' || e.key === 'Enter') { setShowConfirm(false) } }}
                  onBlur={() => setShowConfirm(false)}
                  className="group absolute inset-y-0 right-0 flex items-center pr-3 select-none cursor-pointer focus:outline-none"
                >
                  {showConfirm ? (
                    <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-muted group-hover:text-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" disabled={busy || !pw || !confirm} className="btn-primary w-full">{busy ? 'Saving...' : 'Set password & continue'}</button>
          </form>
        </div>
      </div>
    </main>
  )
}
