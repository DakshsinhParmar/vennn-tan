/**
 * RolesField - Composable roles/collaborators field
 *
 * A reusable component for managing arrays of roles.
 * Only allows adding roles when the previous one is complete.
 */
import { useCallback, useState } from 'react'
import { TrashIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { RoleItem } from '@/lib/form'

interface RolesFieldProps {
  label: string
  value: Array<RoleItem>
  onChange: (roles: Array<RoleItem>) => void
  onBlur?: () => void
  onRolesEmpty?: () => void
  className?: string
  maxRoles?: number
  maxRoleLength?: number
  rolePlaceholder?: string
  error?: string
  /** When true, shows validation errors on empty inputs */
  showValidation?: boolean
}

export function RolesField({
  label,
  value = [],
  onChange,
  onBlur,
  onRolesEmpty,
  className,
  maxRoles = 10,
  maxRoleLength = 20,
  rolePlaceholder = 'Role (e.g., Designer)',
  error,
  showValidation = false,
}: RolesFieldProps) {
  const hasError = !!error
  // Count how many empty roles exist
  const hasEmptyRoles = showValidation && value.some((r) => !r.role.trim())

  // Check if the last role is complete
  const lastRole = value[value.length - 1]
  const canAddMore =
    value.length < maxRoles && (value.length === 0 || lastRole?.role.trim())

  // Track if we should focus the new input (only after user adds a role)
  const [shouldFocus, setShouldFocus] = useState(false)

  // Focus the new input after adding - using callback ref pattern
  const focusNewInput = useCallback(
    (el: HTMLInputElement | null) => {
      if (shouldFocus && el) {
        el.focus()
        setShouldFocus(false)
      }
    },
    [shouldFocus],
  )

  const addRole = () => {
    if (!canAddMore) return
    setShouldFocus(true)
    onChange([...value, { role: '' }])
  }

  const removeRole = (index: number) => {
    const newRoles = value.filter((_, i) => i !== index)
    onChange(newRoles)
    if (newRoles.length === 0) {
      onRolesEmpty?.()
    }
  }

  const updateRole = (index: number, newValue: string) => {
    // Enforce max length
    if (newValue.length > maxRoleLength) return

    // Allow empty string for editing, but validate non-empty values
    // Use Unicode regex for i18n support + tech symbols
    if (newValue && !/^[\p{L}\p{N}\s+#.]*$/u.test(newValue)) {
      // Don't update if invalid characters are entered
      return
    }

    // Check if this role already exists in another role (case-insensitive)
    const normalizedNewValue = newValue.trim().toLowerCase()
    const isDuplicate =
      normalizedNewValue &&
      value.some(
        (role, i) =>
          i !== index && role.role.trim().toLowerCase() === normalizedNewValue,
      )

    // Don't update if it would create a duplicate
    if (isDuplicate) return

    const updated = value.map((role, i) =>
      i === index ? { ...role, role: newValue } : role,
    )
    onChange(updated)
  }

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Label className={cn((hasError || hasEmptyRoles) && 'text-destructive')}>
        {label}
      </Label>

      <div className="space-y-3 w-full">
        {value.map((roleItem, index) => {
          const isEmpty = !roleItem.role.trim()
          const isLast = index === value.length - 1

          // Check if this role is a duplicate (case-insensitive)
          const normalizedRole = roleItem.role.trim().toLowerCase()
          const isDuplicate =
            normalizedRole &&
            value.findIndex(
              (r) => r.role.trim().toLowerCase() === normalizedRole,
            ) < index // Only show error on duplicates, not the first occurrence

          const showInputError = (isEmpty && showValidation) || isDuplicate
          const inputErrorMessage = isDuplicate
            ? 'Role already added'
            : 'Role cannot be empty'

          return (
            <div key={index} className="space-y-1">
              <div className="flex w-full items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={isLast ? focusNewInput : undefined}
                    value={roleItem.role}
                    onChange={(e) => updateRole(index, e.target.value)}
                    onBlur={onBlur}
                    placeholder={rolePlaceholder}
                    className="w-full pe-14"
                    size="lg"
                    variant={showInputError ? 'destructive' : 'default'}
                    aria-invalid={showInputError ? true : undefined}
                    maxLength={maxRoleLength}
                  />
                  <div
                    aria-live="polite"
                    className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground text-xs tabular-nums"
                    role="status"
                  >
                    {roleItem.role.length}/{maxRoleLength}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  onClick={() => removeRole(index)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <TrashIcon className="size-5" />
                </Button>
              </div>
              {showInputError && (
                <p className="text-sm text-destructive" role="alert">
                  {inputErrorMessage}
                </p>
              )}
            </div>
          )
        })}

        {value.length < maxRoles && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={addRole}
            disabled={!canAddMore}
            className={cn('w-full', !canAddMore && 'cursor-not-allowed')}
          >
            Add Role
          </Button>
        )}
      </div>
    </div>
  )
}
