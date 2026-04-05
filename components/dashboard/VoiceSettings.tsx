'use client'

import { useState } from 'react'

interface VoiceProfile {
  tone?: string
  sentence_style?: string
  vocabulary?: string
  personality?: string
  structural_patterns?: string[]
  avoid?: string[]
  signature_phrases?: string[]
  energy_level?: string
}

export default function VoiceSettings({ initialProfile }: { initialProfile: VoiceProfile | null }) {
  const [samples, setSamples] = useState('')
  const [profile, setProfile] = useState<VoiceProfile | null>(initialProfile)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [editing, setEditing] = useState(!initialProfile)

  async function analyzeVoice() {
    if (samples.trim().length < 100) {
      setError('Please paste at least 100 characters of your writing.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples }),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Analysis failed. Please try again.')
        return
      }

      const data = await res.json()
      setProfile(data.profile)
      setSuccess(true)
      setEditing(false)
      setSamples('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {profile && !editing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              <span className="text-xs font-medium text-green-700">Voice profile active — all your outputs will sound like you</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-[#6B7280] hover:text-[#1B2A4A] underline transition-colors"
            >
              Update samples
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {profile.tone && (
              <ProfileTrait label="Tone" value={profile.tone} />
            )}
            {profile.sentence_style && (
              <ProfileTrait label="Sentence Style" value={profile.sentence_style} />
            )}
            {profile.vocabulary && (
              <ProfileTrait label="Vocabulary" value={profile.vocabulary} />
            )}
            {profile.personality && (
              <ProfileTrait label="Personality" value={profile.personality} />
            )}
            {profile.energy_level && (
              <ProfileTrait label="Energy" value={profile.energy_level} />
            )}
          </div>

          {profile.signature_phrases && profile.signature_phrases.length > 0 && (
            <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1B2A4A] uppercase tracking-wide mb-2">Signature Phrases</p>
              <div className="flex flex-wrap gap-2">
                {profile.signature_phrases.map((phrase, i) => (
                  <span key={i} className="text-xs bg-white border border-[#e8eaed] text-[#6B7280] px-2.5 py-1 rounded-full italic">
                    &ldquo;{phrase}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.avoid && profile.avoid.length > 0 && (
            <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#1B2A4A] uppercase tracking-wide mb-2">What PillarBloom Avoids in Your Outputs</p>
              <ul className="space-y-1">
                {profile.avoid.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280]">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {profile && (
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-[#6B7280] hover:text-[#1B2A4A] underline transition-colors"
            >
              ← Back to current profile
            </button>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">
              Paste 3–5 samples of your writing
            </label>
            <p className="text-xs text-[#6B7280] mb-3 leading-relaxed">
              Include blog posts, emails, LinkedIn posts, or any content you&apos;ve written. The more variety, the better the profile.
              Separate samples with a blank line or &ldquo;---&rdquo;.
            </p>
            <textarea
              value={samples}
              onChange={(e) => setSamples(e.target.value)}
              rows={12}
              placeholder={`Sample 1 — paste a LinkedIn post, email, or blog section here...

---

Sample 2 — paste another piece of your writing here...

---

Sample 3 — one more example...`}
              className="w-full bg-white border border-[#e8eaed] rounded-xl px-4 py-3 text-sm text-[#1B2A4A] focus:outline-none focus:ring-2 focus:ring-[#C6A04E] focus:border-transparent resize-none leading-relaxed"
            />
            <p className="text-xs text-[#9CA3AF] mt-1.5">{samples.length} characters</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{error}</p>
          )}

          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
              Voice profile created! All future outputs will match your writing style.
            </p>
          )}

          <button
            onClick={analyzeVoice}
            disabled={loading || samples.trim().length < 100}
            className="bg-[#1B2A4A] hover:bg-[#2D4270] disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing your voice…' : 'Analyze my writing voice →'}
          </button>
        </div>
      )}
    </div>
  )
}

function ProfileTrait({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#fafafa] border border-[#e8eaed] rounded-xl p-4">
      <p className="text-xs font-semibold text-[#1B2A4A] uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xs text-[#6B7280] leading-relaxed">{value}</p>
    </div>
  )
}
