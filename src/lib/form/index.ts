/**
 * Form System - TanStack Form with pre-bound components
 */
import { createFormHook } from '@tanstack/react-form'
import {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} from './form-context'
import { TextareaField, InputField } from './components/field'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextareaField,
    InputField,
  },
  formComponents: {},
})

// Context exports
export { fieldContext, formContext, useFieldContext, useFormContext }

// Unified schemas - single source of truth
export {
  // Sanitization
  sanitizeInput,

  // Regex patterns
  TAG_REGEX,
  ROLE_REGEX,

  // Error messages
  MSG,

  // Field schemas
  urlSchema,
  linkItemSchema,
  roleItemSchema,
  titleSchema,
  descriptionSchema,
  nameSchema,
  imagesSchema,
  tagsSchema,
  linksSchema,
  rolesSchema,

  // Enum schemas
  postTypeSchema,
  availabilitySchema,
  intentSchema,
  intentArraySchema,

  // Form schemas
  postSchema,
  profileSchema,

  // Constants
  POST_TAGS_SUGGESTIONS,

  // Default values
  postDefaultValues,
  profileDefaultValues,

  // Helpers
  getErrorMessage,
  createValidator,

  // Design limits
  limits,

  // Types
  type LinkItem,
  type RoleItem,
  type PostType,
  type AvailabilityType,
  type IntentType,
  type PostFormData,
  type PostFormInput,
  type ProfileFormData,
} from './schemas'

// Types
export type { FieldApi } from '@tanstack/react-form'
