import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const fieldBase =
  'w-full rounded-lg border border-[var(--border)] bg-white/[0.04] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors focus-ring focus:border-[var(--accent)]/50'

interface FieldWrapperProps {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

function FieldWrapper({ label, required, children, className }: FieldWrapperProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-1.5">
        {label}
        {required && <span className="text-[var(--accent)] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const Input = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, required, className, ...props }, ref) => (
    <FieldWrapper label={label} required={required}>
      <input ref={ref} required={required} className={cn(fieldBase, className)} {...props} />
    </FieldWrapper>
  )
)
Input.displayName = 'Input'

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, required, className, rows = 4, ...props }, ref) => (
    <FieldWrapper label={label} required={required}>
      <textarea
        ref={ref}
        required={required}
        rows={rows}
        className={cn(fieldBase, 'resize-y min-h-[100px]', className)}
        {...props}
      />
    </FieldWrapper>
  )
)
Textarea.displayName = 'Textarea'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: string[]
}

export const Select = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, required, options, className, ...props }, ref) => (
    <FieldWrapper label={label} required={required}>
      <select ref={ref} required={required} className={cn(fieldBase, 'cursor-pointer', className)} {...props}>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[var(--surface)]">
            {o}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
)
Select.displayName = 'Select'
