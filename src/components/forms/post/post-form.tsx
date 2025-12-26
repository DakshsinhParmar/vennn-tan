/**
 * PostForm - Unified form for creating and editing posts
 *
 * Consolidates CreatePostForm and EditPostForm following DRY principles.
 * Use `mode` prop to control behavior:
 * - 'create': Shows post type selector, uses default values
 * - 'edit': Hides post type selector, requires initialValues
 */
import { useRef, useState, useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { revalidateLogic } from '@tanstack/react-form'
import {
  CoffeeIcon,
  GlobeHemisphereWestIcon,
  SparkleIcon,
  TargetIcon,
} from '@phosphor-icons/react'
import {
  useAppForm,
  limits,
  titleSchema,
  descriptionSchema,
  tagsSchema,
  linksSchema,
  rolesSchema,
  getErrorMessage,
  createValidator,
  postDefaultValues,
  POST_TAGS_SUGGESTIONS,
  type PostFormData,
} from '@/lib/form'
import {
  LinksField,
  MultiImageUpload,
  RolesField,
  TagsField,
} from '@/components/forms'
import { cn } from '@/lib/utils'
import { layout } from '@/lib/design'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SelectionCard } from '@/components/ui/selection-card'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface PostFormProps {
  /** 'create' shows post type selector, 'edit' hides it */
  mode: 'create' | 'edit'
  /** Initial values - required for edit mode, uses defaults for create mode */
  initialValues?: PostFormData
  onSubmit?: (data: PostFormData) => void | Promise<void>
  onCancel?: () => void
  className?: string
  formRef?: React.RefObject<HTMLFormElement | null>
  isSubmitting?: boolean
  onDirtyChange?: (isDirty: boolean) => void
}

export function PostForm({
  mode,
  initialValues,
  onSubmit,
  className,
  formRef: externalFormRef,
  isSubmitting = false,
  onDirtyChange,
}: PostFormProps) {
  const internalFormRef = useRef<HTMLFormElement>(null)
  const formRef = externalFormRef || internalFormRef

  const form = useAppForm({
    defaultValues: initialValues ?? postDefaultValues,
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    onSubmit: async ({ value }) => {
      await onSubmit?.(value)
    },
    onSubmitInvalid: () => {
      // Focus the first invalid field using browser API
      const invalidInput = document.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLInputElement
      invalidInput?.focus()
    },
  })

  const availability = useStore(form.store, (s) => s.values.availability)
  const postType = useStore(form.store, (s) => s.values.postType)
  const isDirty = useStore(form.store, (s) => s.isDirty)
  const [showClearRolesDialog, setShowClearRolesDialog] = useState(false)

  useEffect(() => {
    onDirtyChange?.(isDirty)
  }, [isDirty, onDirtyChange])

  const handleSwitchToOpen = () => {
    const currentRoles = form.getFieldValue('roles')
    const hasFilledRoles = currentRoles.some((r) => r.role.trim().length > 0)

    if (hasFilledRoles) {
      setShowClearRolesDialog(true)
    } else {
      form.setFieldValue('availability', 'open')
      form.setFieldValue('roles', [])
    }
  }

  const confirmClearRoles = () => {
    form.setFieldValue('availability', 'open')
    form.setFieldValue('roles', [])
    setShowClearRolesDialog(false)
  }

  return (
    <form
      ref={formRef}
      id={`${mode}-post-form`}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className={cn(layout.form.fieldGap, 'w-full px-1', className)}
      noValidate
    >
      {/* Post Type Selector - Only shown in create mode */}
      {mode === 'create' && (
        <form.Field name="postType">
          {(field) => (
            <div className="space-y-2" data-field="postType">
              <Label>Post Type</Label>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${layout.form.sectionGap} pt-1`}
              >
                <SelectionCard
                  selected={field.state.value === 'build'}
                  onClick={() => !isSubmitting && field.handleChange('build')}
                  icon={<SparkleIcon className="size-5" weight="fill" />}
                  title="Build"
                  description="Share a project"
                  disabled={isSubmitting}
                />
                <SelectionCard
                  selected={field.state.value === 'social'}
                  onClick={() => !isSubmitting && field.handleChange('social')}
                  icon={<CoffeeIcon className="size-5" weight="fill" />}
                  title="Social"
                  description="Share thoughts"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}
        </form.Field>
      )}

      <form.AppField
        name="title"
        validators={{ onDynamic: createValidator(titleSchema) }}
        children={(field) => (
          <field.TextareaField
            label="Title"
            placeholder="Give your post a descriptive title..."
            disabled={isSubmitting}
            maxLength={limits.title.max}
            className="pb-0"
          />
        )}
      />

      <form.Field name="images">
        {(field) => (
          <MultiImageUpload
            label="Images"
            value={field.state.value}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            maxImages={limits.images.max}
          />
        )}
      </form.Field>

      <form.Field name="tags" validators={{ onDynamic: tagsSchema }}>
        {(field) => {
          const hasError = field.state.meta.errors.length > 0
          const errorMessage = getErrorMessage(field.state.meta.errors)
          return (
            <TagsField
              key={`tags-${postType}`}
              label="Tags"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              placeholder="Add tags (press Enter)"
              maxTags={limits.tags.max}
              maxTagLength={limits.tags.maxLength}
              suggestions={[...POST_TAGS_SUGGESTIONS]}
              error={hasError ? errorMessage : undefined}
            />
          )
        }}
      </form.Field>

      <form.Field name="availability">
        {(field) => (
          <div className="space-y-2" data-field="availability">
            <Label>Who are you looking for?</Label>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${layout.form.sectionGap} pt-1`}
            >
              <SelectionCard
                selected={field.state.value === 'open'}
                onClick={() => {
                  if (isSubmitting) return
                  handleSwitchToOpen()
                }}
                icon={
                  <GlobeHemisphereWestIcon className="size-5" weight="fill" />
                }
                title="Open to everyone"
                description="Anyone can apply"
                disabled={isSubmitting}
              />
              <SelectionCard
                selected={
                  field.state.value === 'specific' ||
                  field.state.value === 'hybrid'
                }
                onClick={() => {
                  if (isSubmitting) return
                  field.handleChange('specific')
                  // Auto-add first empty role when switching to specific
                  const currentRoles = form.getFieldValue('roles')
                  if (currentRoles.length === 0) {
                    form.setFieldValue('roles', [{ role: '' }])
                  }
                }}
                icon={<TargetIcon className="size-5" weight="fill" />}
                title="Specific Roles"
                description="Need specific skills"
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}
      </form.Field>

      {(availability === 'specific' || availability === 'hybrid') && (
        <div data-field="roles" className="space-y-4">
          <form.Field
            name="roles"
            validators={{
              onDynamic: ({ value, fieldApi }) => {
                const avail = fieldApi.form.getFieldValue('availability')
                if (avail !== 'specific' && avail !== 'hybrid') {
                  return undefined
                }
                const result = rolesSchema.safeParse(value)
                if (!result.success) {
                  return result.error.issues[0]?.message || 'Invalid roles'
                }
                if (result.data.length === 0) {
                  return 'Add at least one role'
                }
                return undefined
              },
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0
              const errorMessage = getErrorMessage(field.state.meta.errors)
              // Show validation after first submission attempt
              const showValidation = field.form.state.submissionAttempts > 0
              return (
                <RolesField
                  label="Open Roles"
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  onRolesEmpty={() => {
                    form.setFieldValue('availability', 'open')
                    form.setFieldValue('roles', [])
                  }}
                  maxRoles={limits.roles.max}
                  maxRoleLength={limits.roles.maxLength}
                  error={hasError ? errorMessage : undefined}
                  showValidation={showValidation}
                />
              )
            }}
          </form.Field>

          <form.Field name="availability">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Switch
                  id="hybrid-check"
                  checked={field.state.value === 'hybrid'}
                  onCheckedChange={(checked) => {
                    if (!isSubmitting) {
                      field.handleChange(checked ? 'hybrid' : 'specific')
                    }
                  }}
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="hybrid-check"
                  className="text-sm font-medium leading-none"
                >
                  Also open to everyone
                </Label>
              </div>
            )}
          </form.Field>
        </div>
      )}

      <form.Field
        name="links"
        validators={{
          onDynamic: ({ value }) => {
            if (Array.isArray(value) && value.length === 0) return undefined
            const result = linksSchema.safeParse(value)
            if (!result.success) {
              return result.error.issues[0]?.message || 'Invalid links'
            }
            return undefined
          },
        }}
      >
        {(field) => {
          const hasError = field.state.meta.errors.length > 0
          const errorMessage = getErrorMessage(field.state.meta.errors)
          const showValidation = field.form.state.submissionAttempts > 0
          return (
            <LinksField
              label="Links"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              maxLinks={limits.links.max}
              error={hasError ? errorMessage : undefined}
              showValidation={showValidation}
            />
          )
        }}
      </form.Field>

      <form.AppField
        name="description"
        validators={{ onDynamic: createValidator(descriptionSchema) }}
        children={(field) => (
          <field.TextareaField
            label="Description"
            placeholder="Tell us more about your post..."
            disabled={isSubmitting}
            maxLength={limits.description.max}
          />
        )}
      />

      {/* Confirmation Dialog for clearing roles */}
      <Dialog
        open={showClearRolesDialog}
        onOpenChange={setShowClearRolesDialog}
      >
        <DialogPopup showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Clear all roles?</DialogTitle>
            <DialogDescription>
              Switching to "Open to everyone" will remove all the roles you've
              added. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter variant="bare">
            <Button
              variant="outline"
              onClick={() => setShowClearRolesDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmClearRoles}>
              Clear roles
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </form>
  )
}
