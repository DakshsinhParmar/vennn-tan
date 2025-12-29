/**
 * Unified Form Field Components
 *
 * DRY implementation - shared logic for Input and Textarea fields.
 * Uses a single base pattern with polymorphic control type.
 */
import { useFieldContext } from '../form-context'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface BaseFieldProps {
  label: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  className?: string
}

interface InputFieldProps extends BaseFieldProps {
  type?: string
}

interface TextareaFieldProps extends BaseFieldProps {
  rows?: number
}

/** Extract error message from field state */
function getFieldError(errors: unknown[]): string {
  return errors
    .map((e) =>
      typeof e === 'string'
        ? e
        : (e as { message?: string })?.message || String(e),
    )
    .join(', ')
}

/** Shared field wrapper with label and error */
function FieldWrapper({
  label,
  hasError,
  errorId,
  errorMessage,
  className,
  children,
}: {
  label: string
  hasError: boolean
  errorId: string
  errorMessage: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('w-full space-y-2', className)}>
      <Label className={cn(hasError && 'text-destructive')}>{label}</Label>
      {children}
      {hasError && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export function InputField({
  label,
  placeholder,
  disabled,
  maxLength,
  className,
  type = 'text',
}: InputFieldProps) {
  const field = useFieldContext<string>()
  const hasError = field.state.meta.errors.length > 0
  const errorMessage = getFieldError(field.state.meta.errors)
  const charCount = field.state.value?.length || 0

  return (
    <FieldWrapper
      label={label}
      hasError={hasError}
      errorId={`${field.name}-error`}
      errorMessage={errorMessage}
      className={className}
    >
      <Input
        type={type}
        value={field.state.value}
        onChange={(e) => {
          if (!maxLength || e.target.value.length <= maxLength) {
            field.handleChange(e.target.value)
          }
        }}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        variant={hasError ? 'destructive' : 'default'}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
        maxLength={maxLength}
        charCount={maxLength ? charCount : undefined}
      />
    </FieldWrapper>
  )
}

export function TextareaField({
  label,
  placeholder,
  disabled,
  maxLength,
  className,
  rows,
}: TextareaFieldProps) {
  const field = useFieldContext<string>()
  const hasError = field.state.meta.errors.length > 0
  const errorMessage = getFieldError(field.state.meta.errors)
  const charCount = field.state.value?.length || 0

  return (
    <FieldWrapper
      label={label}
      hasError={hasError}
      errorId={`${field.name}-error`}
      errorMessage={errorMessage}
      className={className}
    >
      <Textarea
        value={field.state.value}
        onChange={(e) => {
          if (!maxLength || e.target.value.length <= maxLength) {
            field.handleChange(e.target.value)
          }
        }}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        variant={hasError ? 'destructive' : 'default'}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${field.name}-error` : undefined}
        maxLength={maxLength}
        charCount={maxLength ? charCount : undefined}
        rows={rows}
      />
    </FieldWrapper>
  )
}
