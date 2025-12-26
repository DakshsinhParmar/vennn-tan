/**
 * Unified Form Schemas
 *
 * Single source of truth for all form validation.
 * All forms should import schemas from here.
 */
import { z } from 'zod'
import { limits } from '../design'

// =============================================================================
// SANITIZATION
// =============================================================================

/** Strip zero-width characters that could bypass length checks */
const stripZeroWidth = (input: string): string =>
  input.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')

/** Sanitize input by stripping HTML tags and zero-width chars */
export const sanitizeInput = (input: string): string =>
  stripZeroWidth(input.replace(/<[^>]*>/g, ''))

// =============================================================================
// REGEX PATTERNS
// =============================================================================

/** Tags: alphanumeric + tech symbols only */
export const TAG_REGEX = /^[a-zA-Z0-9\s+#.]+$/

/** Roles: Unicode letters, numbers, spaces, and tech symbols for i18n */
export const ROLE_REGEX = /^[\p{L}\p{N}\s+#.]+$/u

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const MSG = {
  required: 'This field is required',

  title: {
    required: 'Please add a title',
    min: `At least ${limits.title.min} characters`,
    max: `Keep it under ${limits.title.max} characters`,
  },

  description: {
    max: `Keep it under ${limits.description.max} characters`,
  },

  name: {
    required: 'Name is required',
    min: `At least ${limits.name.min} characters`,
    max: `Max ${limits.name.max} characters`,
  },

  images: {
    max: `Up to ${limits.images.max} images only`,
  },

  tags: {
    min: 'Add at least one tag',
    max: `Up to ${limits.tags.max} tags only`,
    invalid: 'Letters, numbers, and symbols (+, #, .) only',
    maxLength: `Max ${limits.tags.maxLength} characters per tag`,
  },

  links: {
    max: `Up to ${limits.links.max} links only`,
    invalid: 'Enter a valid URL (https only)',
    empty: 'URL cannot be empty',
  },

  roles: {
    max: `Up to ${limits.roles.max} roles only`,
    required: 'Add at least one role',
    invalid: 'Letters and spaces only',
    empty: 'Role cannot be empty',
    maxLength: `Max ${limits.roles.maxLength} characters per role`,
  },

  intent: {
    required: 'Select at least one option',
  },
} as const

// =============================================================================
// BASE SCHEMAS
// =============================================================================

/** HTTP/HTTPS URLs only - blocks dangerous protocols */
export const urlSchema = z.url({
  protocol: /^https?$/,
  message: MSG.links.invalid,
})

/** Link item with URL validation */
export const linkItemSchema = z.object({
  url: urlSchema,
})

export type LinkItem = z.infer<typeof linkItemSchema>

/** Role item with name validation */
export const roleItemSchema = z.object({
  role: z
    .string()
    .trim()
    .min(1, MSG.required)
    .max(limits.roles.maxLength, MSG.roles.maxLength)
    .regex(ROLE_REGEX, MSG.roles.invalid),
})

export type RoleItem = z.infer<typeof roleItemSchema>

// =============================================================================
// FIELD SCHEMAS (reusable across forms)
// =============================================================================

/** Title field - used in posts */
export const titleSchema = z
  .string()
  .transform(sanitizeInput)
  .pipe(
    z
      .string()
      .trim()
      .min(1, MSG.title.required)
      .min(limits.title.min, MSG.title.min)
      .max(limits.title.max, MSG.title.max),
  )

/** Description field - optional long text */
export const descriptionSchema = z
  .string()
  .transform(sanitizeInput)
  .pipe(z.string().max(limits.description.max, MSG.description.max))

/** Name field - used in profiles */
export const nameSchema = z
  .string()
  .transform(sanitizeInput)
  .pipe(
    z
      .string()
      .trim()
      .min(1, MSG.name.required)
      .min(limits.name.min, MSG.name.min)
      .max(limits.name.max, MSG.name.max),
  )

/** Images array */
export const imagesSchema = z
  .array(z.string())
  .max(limits.images.max, MSG.images.max)

/** Single tag validation */
const tagSchema = z
  .string()
  .trim()
  .min(1, MSG.required)
  .max(limits.tags.maxLength, MSG.tags.maxLength)
  .regex(TAG_REGEX, MSG.tags.invalid)

/** Tags array */
export const tagsSchema = z
  .array(tagSchema)
  .min(limits.tags.min, MSG.tags.min)
  .max(limits.tags.max, MSG.tags.max)

/** Links array */
export const linksSchema = z
  .array(linkItemSchema)
  .max(limits.links.max, MSG.links.max)
  .refine(
    (links) => links.every((link) => link.url.trim().length > 0),
    MSG.links.empty,
  )

/** Roles array */
export const rolesSchema = z
  .array(roleItemSchema)
  .max(limits.roles.max, MSG.roles.max)
  .refine(
    (roles) => roles.every((r) => r.role.trim().length > 0),
    MSG.roles.empty,
  )

// =============================================================================
// ENUM SCHEMAS
// =============================================================================

export const postTypeSchema = z.enum(['build', 'social'])
export type PostType = z.infer<typeof postTypeSchema>

export const availabilitySchema = z.enum(['open', 'specific', 'hybrid'])
export type AvailabilityType = z.infer<typeof availabilitySchema>

export const intentSchema = z.enum(['build', 'socialize'])
export type IntentType = z.infer<typeof intentSchema>

/** Intent array for profile (min 1 required) */
export const intentArraySchema = z
  .array(intentSchema)
  .min(1, MSG.intent.required)

// =============================================================================
// FORM SCHEMAS
// =============================================================================

/** Create/Edit Post Schema */
export const postSchema = z
  .object({
    postType: postTypeSchema,
    availability: availabilitySchema,
    title: titleSchema,
    description: descriptionSchema,
    images: imagesSchema,
    tags: tagsSchema,
    links: linksSchema,
    roles: rolesSchema,
  })
  .refine((data) => data.availability === 'open' || data.roles.length > 0, {
    message: MSG.roles.required,
    path: ['roles'],
  })

export type PostFormData = z.infer<typeof postSchema>
export type PostFormInput = z.input<typeof postSchema>

/** Edit Profile Schema */
export const profileSchema = z.object({
  name: nameSchema,
  profileImage: z.string().nullable(),
  intent: z.array(intentSchema).min(1, MSG.intent.required),
  links: linksSchema,
})

export type ProfileFormData = z.infer<typeof profileSchema>

// =============================================================================
// CONSTANTS
// =============================================================================

export const POST_TAGS_SUGGESTIONS = [
  'AI',
  'Art',
  'Books',
  'Career',
  'Coding',
  'Collab',
  'Community',
  'Course',
  'Design',
  'DIY',
  'Fashion',
  'Film',
  'Finance',
  'Fitness',
  'Food',
  'Freelance',
  'Gaming',
  'Learning',
  'Marketing',
  'Meetup',
  'Mentorship',
  'Music',
  'Networking',
  'Photography',
  'Podcast',
  'Sports',
  'Startup',
  'Tech',
  'Travel',
  'Volunteer',
  'Wellness',
  'Workshop',
  'Writing',
] as const

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const postDefaultValues: PostFormInput = {
  postType: 'build',
  availability: 'open',
  title: '',
  description: '',
  images: [],
  tags: [],
  links: [],
  roles: [],
}

export const profileDefaultValues: ProfileFormData = {
  name: '',
  profileImage: null,
  intent: ['build'],
  links: [],
}

// =============================================================================
// HELPERS
// =============================================================================

/** Extract error message from TanStack Form errors */
export function getErrorMessage(errors: unknown[]): string {
  return errors
    .map((e) =>
      typeof e === 'string'
        ? e
        : (e as { message?: string })?.message || String(e),
    )
    .join(', ')
}

/** Create a validator function for a Zod schema */
export function createValidator<T>(schema: z.ZodType<T>) {
  return ({ value }: { value: T }) => {
    const result = schema.safeParse(value)
    if (!result.success) {
      return result.error.issues[0]?.message || 'Invalid value'
    }
    return undefined
  }
}

// Re-export limits for convenience
export { limits }
