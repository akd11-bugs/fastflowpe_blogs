'use client'

import type { Form as FormType } from '@/payload-types'

import React, { useCallback, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import RichText from '@/components/RichText'
import { getClientSideURL } from '@/utilities/getURL'

/**
 * A compact newsletter signup — reuses the same @payloadcms/plugin-form-builder
 * submission mechanism as src/blocks/Form/Component.tsx (POST to
 * /api/form-submissions), but with bespoke pill-input UI instead of the
 * generic per-field-type form layout, since a footer signup only ever has
 * one field. Renders nothing if no form (or an empty/message-only form) is
 * configured.
 */
export const FooterNewsletter: React.FC<{
  heading?: string | null
  description?: string | null
  form?: FormType | number | null
}> = ({ heading, description, form }) => {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rawField = typeof form === 'object' && form ? form.fields?.[0] : undefined
  const field = rawField && rawField.blockType !== 'message' ? rawField : undefined

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (typeof form !== 'object' || !form || !field) return

      setError(null)
      setIsLoading(true)

      try {
        const res = await fetch(`${getClientSideURL()}/api/form-submissions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            form: form.id,
            submissionData: [{ field: field.name, value }],
          }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => null)
          setError(body?.errors?.[0]?.message || 'Something went wrong.')
          setIsLoading(false)
          return
        }

        setHasSubmitted(true)
        setIsLoading(false)
      } catch {
        setError('Something went wrong.')
        setIsLoading(false)
      }
    },
    [form, field, value],
  )

  if (typeof form !== 'object' || !form || !field) return null

  return (
    <div>
      {heading && <h3 className="text-2xl font-bold mb-2">{heading}</h3>}
      {description && !hasSubmitted && (
        <p className="text-sm text-white/60 mb-4 max-w-xs">{description}</p>
      )}

      {hasSubmitted ? (
        form.confirmationType === 'message' && form.confirmationMessage ? (
          <RichText className="text-white" data={form.confirmationMessage} enableGutter={false} />
        ) : (
          <p className="text-white">Thanks. You&apos;re on the list.</p>
        )
      ) : (
        <form onSubmit={onSubmit} className="flex max-w-xs">
          <div className="flex items-center w-full rounded-full bg-white pl-4 pr-1 py-1">
            <input
              type={field.blockType === 'email' ? 'email' : 'text'}
              required={Boolean(field.required)}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={field.label || 'Enter your email'}
              className="flex-1 bg-transparent text-sm text-black placeholder:text-black/40 outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={isLoading}
              aria-label="Subscribe"
              className="flex items-center justify-center h-8 w-8 shrink-0 rounded-full bg-black text-white disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  )
}
