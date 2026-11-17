import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthProvider'
import { CURRENT_TERMS_VERSION, TERMS_STEPS } from '../lib/termsConfig'
import Logo from '../components/Logo'
import Spinner from '../components/Spinner'

export default function Terms() {
  const navigate = useNavigate()
  const { profile, profileLoaded, refreshProfile } = useAuth()

  const [step, setStep] = useState(1)
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const scrollBoxRef = useRef(null)

  // Reset scroll position and acceptance checkbox when step changes
  useEffect(() => {
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = 0
    }
  }, [step])

  // Determine the current incomplete step from profile
  useEffect(() => {
    if (!profileLoaded) return
    if (!profile) {
      navigate('/', { replace: true })
      return
    }
    // If all steps accepted and version matches, go to dashboard (will hit password change gate)
    if (
      profile.terms_step1_accepted &&
      profile.terms_step2_accepted &&
      profile.terms_step3_accepted &&
      profile.terms_version === CURRENT_TERMS_VERSION
    ) {
      navigate('/', { replace: true })
      return
    }
    // Find first missing step
    if (!profile.terms_step1_accepted) setStep(1)
    else if (!profile.terms_step2_accepted) setStep(2)
    else if (!profile.terms_step3_accepted) setStep(3)
    else setStep(1)
  }, [profile, profileLoaded, navigate])

  async function handleAccept() {
    if (!accepted) {
      setError('You must check the box to agree to the Terms & Conditions before continuing.')
      return
    }
    setBusy(true)
    setError('')

    const updates = {
      [`terms_step${step}_accepted`]: true,
      [`terms_step${step}_accepted_at`]: new Date().toISOString(),
      terms_version: CURRENT_TERMS_VERSION,
    }

    const { error: updErr } = await supabase.from('profiles').update(updates).eq('id', profile.id)
    if (updErr) {
      setBusy(false)
      setError('Could not record acceptance. Please try again.')
      return
    }

    await refreshProfile()
    setBusy(false)

    // Move to next step or dashboard
    if (step < 3) {
      setStep(step + 1)
      setAccepted(false)
    } else {
      navigate('/', { replace: true })
    }
  }

  // Show loading while profile not ready
  if (!profileLoaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-page">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-auto" />
          <Spinner size={24} />
        </div>
      </div>
    )
  }

  if (!profile) {
    return null // will be redirected by effect
  }

  // If already fully accepted, redirect (handled by effect)
  if (
    profile.terms_step1_accepted &&
    profile.terms_step2_accepted &&
    profile.terms_step3_accepted &&
    profile.terms_version === CURRENT_TERMS_VERSION
  ) {
    return null
  }

  const currentStep = TERMS_STEPS[step] || TERMS_STEPS[1]

  return (
    <main className="grid min-h-screen place-items-center bg-page px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex justify-center">
          <Logo className="h-12 w-auto" />
        </div>

        <div className="card p-6 sm:p-8">
          {/* Visual Step Stepper */}
          <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-hover">
                Verification Requirement
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-ink">Terms & Conditions</h1>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    s === step
                      ? 'bg-accent text-white shadow-sm ring-2 ring-accent/30'
                      : s < step
                      ? 'bg-success text-white'
                      : 'bg-page text-muted border border-line dark:bg-card'
                  }`}
                  title={`Step ${s}`}
                >
                  {s < step ? '✓' : s}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Overview */}
          <div className="mb-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-hover">
              {currentStep.category}
            </div>
            <h2 className="mt-0.5 text-base font-bold text-ink sm:text-lg">
              {currentStep.title}
            </h2>
            {currentStep.subtitle && (
              <p className="mt-0.5 text-xs italic text-muted">
                {currentStep.subtitle}
              </p>
            )}
          </div>

          {/* Scrollable Terms Box Header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink">
              <svg
                className="h-3.5 w-3.5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Read Terms & Conditions</span>
            </div>
            <span className="text-[11px] text-muted">Scroll inside box to read fully ↓</span>
          </div>

          {/* Scrollable Terms & Conditions Box */}
          <div
            ref={scrollBoxRef}
            tabIndex={0}
            role="region"
            aria-label={`Terms and Conditions Document - Step ${step}`}
            className="mb-5 max-h-64 overflow-y-auto rounded-xl border border-line bg-page/60 p-4 sm:p-5 text-xs leading-relaxed text-ink shadow-inner focus:outline-none focus:ring-1 focus:ring-accent dark:bg-card/50"
          >
            <div className="space-y-4">
              {currentStep.sections.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="font-bold text-ink text-xs sm:text-sm">
                    {sec.heading}
                  </h3>
                  <p className="text-muted leading-relaxed text-xs sm:text-sm">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Terms Acceptance Checkbox */}
          <div className="mb-5 rounded-lg border border-line bg-page/30 p-3.5 dark:bg-card/30 transition-colors hover:border-accent/40">
            <label htmlFor={`accept-step-${step}`} className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id={`accept-step-${step}`}
                checked={accepted}
                onChange={(e) => {
                  setAccepted(e.target.checked)
                  if (error) setError('')
                }}
                className="mt-0.5 h-4 w-4 rounded border-line accent-accent cursor-pointer flex-shrink-0"
                disabled={busy}
              />
              <span className="text-xs sm:text-sm text-ink font-medium leading-relaxed">
                {currentStep.checkboxText || 'I have read, understood, and agree to the Terms & Conditions above.'}
              </span>
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div role="alert" className="mb-4 rounded-lg border border-down/30 bg-down/10 px-3 py-2 text-xs sm:text-sm text-down">
              {error}
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleAccept}
            disabled={busy || !accepted}
            className="btn-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            {busy ? (
              <>
                <Spinner size={16} />
                <span>Recording acceptance...</span>
              </>
            ) : step < 3 ? (
              `Accept & Continue to Step ${step + 1} of 3 →`
            ) : (
              'Accept & Proceed to Password Setup →'
            )}
          </button>
        </div>
      </div>
    </main>
  )
}