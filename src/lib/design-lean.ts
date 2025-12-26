/**
 * Lean Design System
 *
 * Centralized design tokens - only tokens actively used in the codebase.
 * Single source of truth for consistent styling across the app.
 */

// =============================================================================
// CONTAINER
// =============================================================================

export const container = {
  /** Max width for all page content (448px) */
  maxWidth: {
    md: 'max-w-md',
  },
} as const

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  /** Section spacing for grouped content */
  section: {
    items: 'space-y-3', // List items, cards
    fields: 'space-y-6', // Form fields
  },
} as const

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const text = {
  /** Feed card name - bold 15px */
  feedName: 'text-[15px] font-bold text-foreground leading-tight',
  /** Post title - bold 17px */
  postTitle: 'text-[17px] font-bold leading-snug text-foreground',
  /** Small muted text */
  smMuted: 'text-sm text-muted-foreground',
  /** Body muted text - 15px */
  bodyMuted: 'text-[15px] text-muted-foreground leading-normal',
} as const

// =============================================================================
// ICONS
// =============================================================================

export const icon = {
  sm: 'size-5',
  md: 'size-6',
} as const

// =============================================================================
// ELEMENT STYLES
// =============================================================================

/**
 * Pre-composed element styles for consistent UI patterns.
 * Consolidates duplicate inline classes from across the codebase.
 */
export const element = {
  /** Underline tab list container */
  tabList: 'w-full flex h-14 border-none px-0',
  /** Underline tab trigger */
  tabTrigger:
    'flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none',
  /** Image card container */
  imageCard: 'rounded-xl border border-border/60 bg-muted/20 overflow-hidden',
} as const

// =============================================================================
// FORM LIMITS
// =============================================================================

/**
 * Centralized validation constraints for all forms.
 * Used by Zod schemas for consistent validation.
 */
export const limits = {
  title: { min: 3, max: 100 },
  description: { max: 2000 },
  name: { min: 2, max: 50 },
  images: { max: 6 },
  tags: { min: 1, max: 10, maxLength: 20 },
  links: { max: 5 },
  roles: { max: 10, maxLength: 20 },
  search: { max: 100 },
} as const
