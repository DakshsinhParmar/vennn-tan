import { useRef, useCallback, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { revalidateLogic } from '@tanstack/react-form'
import { CoffeeIcon, SparkleIcon } from '@phosphor-icons/react'
import {
  useAppForm,
  limits,
  nameSchema,
  linksSchema,
  intentArraySchema,
  getErrorMessage,
  createValidator,
  profileDefaultValues,
  type ProfileFormData,
  type IntentType,
} from '@/lib/form'
import { LinksField, ProfileImageUpload } from '@/components/forms'
import { SelectionCard } from '@/components/ui/selection-card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { spacing } from '@/lib/design'

interface EditProfileFormProps {
  onSubmit?: (data: ProfileFormData) => void
  initialValues?: Partial<ProfileFormData>
  className?: string
  isSubmitting?: boolean
  formRef?: React.RefObject<HTMLFormElement | null>
  onDirtyChange?: (isDirty: boolean) => void
}

export function EditProfileForm({
  onSubmit,
  initialValues,
  className,
  isSubmitting = false,
  formRef: externalFormRef,
  onDirtyChange,
}: EditProfileFormProps) {
  const internalFormRef = useRef<HTMLFormElement>(null)
  const formRef = externalFormRef || internalFormRef

  const form = useAppForm({
    defaultValues: { ...profileDefaultValues, ...initialValues },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    onSubmit: async ({ value }) => onSubmit?.(value),
    onSubmitInvalid: () => {
      const invalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement
      invalidInput?.focus()
    },
  })

  const submissionAttempts = useStore(form.store, (s) => s.submissionAttempts)
  const isDirty = useStore(form.store, (s) => s.isDirty)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const toggleIntent = useCallback(
    (intent: IntentType, current: IntentType[]) => {
      if (current.includes(intent)) {
        return current.length > 1
          ? current.filter((i) => i !== intent)
          : current
      }
      return [...current, intent]
    },
    [],
  )

  return (
    <form
      ref={formRef}
      id="edit-profile-form"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className={cn(spacing.section.fields, className)}
      noValidate
    >
      {/* Profile Image */}
      <form.Field name="profileImage">
        {(field) => (
          <ProfileImageUpload
            label="Profile Photo"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
          />
        )}
      </form.Field>

      {/* Name Field */}
      <form.AppField
        name="name"
        validators={{ onDynamic: createValidator(nameSchema) }}
        children={(field) => (
          <field.InputField
            label="Name"
            placeholder="Your name"
            disabled={isSubmitting}
            maxLength={limits.name.max}
          />
        )}
      />

      <form.Field
        name="intent"
        validators={{ onDynamic: createValidator(intentArraySchema) }}
      >
        {(field) => {
          const hasError = field.state.meta.errors.length > 0
          return (
            <div className="space-y-2">
              <Label className={cn(hasError && 'text-destructive')}>
                What are you here for?
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <SelectionCard
                  selected={field.state.value.includes('build')}
                  onClick={() =>
                    !isSubmitting &&
                    field.handleChange(toggleIntent('build', field.state.value))
                  }
                  icon={<SparkleIcon className="size-5" weight="fill" />}
                  title="Build"
                  description="Create & collaborate"
                  disabled={isSubmitting}
                />
                <SelectionCard
                  selected={field.state.value.includes('socialize')}
                  onClick={() =>
                    !isSubmitting &&
                    field.handleChange(
                      toggleIntent('socialize', field.state.value),
                    )
                  }
                  icon={<CoffeeIcon className="size-5" weight="fill" />}
                  title="Socialize"
                  description="Connect & network"
                  disabled={isSubmitting}
                />
              </div>
              {hasError && (
                <p className="text-sm text-destructive" role="alert">
                  {getErrorMessage(field.state.meta.errors)}
                </p>
              )}
            </div>
          )
        }}
      </form.Field>

      {/* Links Field */}
      <form.Field
        name="links"
        validators={{
          onDynamic: ({ value }) => {
            if (Array.isArray(value) && value.length === 0) return undefined
            const result = linksSchema.safeParse(value)
            return result.success
              ? undefined
              : result.error.issues[0]?.message || 'Invalid links'
          },
        }}
      >
        {(field) => {
          const hasError = field.state.meta.errors.length > 0
          return (
            <LinksField
              label="Links"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              maxLinks={limits.links.max}
              error={
                hasError ? getErrorMessage(field.state.meta.errors) : undefined
              }
              showValidation={submissionAttempts > 0}
            />
          )
        }}
      </form.Field>
    </form>
  )
}
