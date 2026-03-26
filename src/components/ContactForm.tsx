'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
  source: string
}

interface FormErrors {
  name?: string
  email?: string
  company?: string
  message?: string
}

const initialData: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  source: '',
}

const sourceOptions = [
  'Search Engine',
  'LinkedIn',
  'Referral',
  'Industry Event',
  'Other',
]

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required.'
  if (!data.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!data.company.trim()) errors.company = 'Company is required.'
  if (!data.message.trim()) errors.message = 'Message is required.'
  return errors
}

export default function ContactForm() {
  const [data, setData] = useState<FormData>(initialData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validate(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setShakeKey((k) => k + 1)
      return
    }
    setSubmitted(true)
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto bg-brand-500/10 rounded-full flex items-center justify-center mb-8"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-600"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h3 className="text-display-sm text-neutral-900">
            Thank you for reaching out.
          </h3>
          <p className="text-body-lg mt-4">
            We&apos;ll respond within one business day.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key={`form-${shakeKey}`}
          onSubmit={handleSubmit}
          initial={shakeKey > 0 ? { x: -8 } : { opacity: 0, y: 20 }}
          animate={
            shakeKey > 0
              ? {
                  x: [-8, 8, -6, 6, -3, 3, 0],
                  opacity: 1,
                  y: 0,
                }
              : { opacity: 1, y: 0 }
          }
          transition={
            shakeKey > 0
              ? { duration: 0.5, ease: 'easeOut' }
              : { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
          }
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field
              label="Name"
              name="name"
              value={data.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={handleChange}
            />
            <Field
              label="Company"
              name="company"
              value={data.company}
              onChange={handleChange}
              error={errors.company}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              How did you hear about us?
            </label>
            <select
              name="source"
              value={data.source}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none"
            >
              <option value="">Select an option</option>
              {sourceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Message <span className="text-neutral-400">*</span>
            </label>
            <textarea
              name="message"
              rows={5}
              value={data.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none ${
                errors.message ? 'border-red-400' : 'border-neutral-200'
              }`}
              placeholder="Tell us about your mandate or hiring needs."
            />
            {errors.message && (
              <p className="text-xs text-red-500 mt-1.5">{errors.message}</p>
            )}
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="btn-primary w-full sm:w-auto"
            >
              Send Message
            </motion.button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

interface FieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
}: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label} {required && <span className="text-neutral-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
          error ? 'border-red-400' : 'border-neutral-200'
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  )
}
