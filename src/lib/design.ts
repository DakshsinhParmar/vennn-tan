/**
 * Unified Design System
 *
 * Centralized design tokens for consistent styling across the app.
 * Change values here to update the entire app's appearance.
 *
 * Follows DRY principle - single source of truth for all design decisions.
 */

// =============================================================================
// SPACING & LAYOUT
// =============================================================================

export const spacing = {
  /** Gaps between inline elements */
  gap: {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
    xl: 'gap-6',
    '2xl': 'gap-8',
  },
  /** Vertical spacing for stacked elements */
  stack: {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4',
    xl: 'space-y-6',
    '2xl': 'space-y-8',
  },
  /** Padding presets */
  padding: {
    page: 'px-4',
    section: 'p-4',
    card: 'p-4',
    item: 'py-4',
    compact: 'py-3',
  },
  /** Section spacing presets (semantic aliases) */
  section: {
    items: 'space-y-3',
    fields: 'space-y-6',
    page: 'space-y-8',
  },
} as const

/**
 * Layout tokens - semantic spacing for consistent UI patterns
 * Use these instead of inline spacing values
 */
export const layout = {
  /** Card internal spacing */
  card: {
    gap: 'gap-3', // Between avatar and content
    contentGap: 'gap-1.5', // Between title/tags/image
    padding: 'py-3', // Vertical padding for list cards
  },
  /** List item spacing */
  list: {
    gap: 'space-y-3', // Between list items (notifications, feed)
    itemPadding: 'py-3', // Individual item padding
  },
  /** Page structure */
  page: {
    padding: 'px-4', // Horizontal page padding
    sectionGap: 'space-y-6', // Between major sections
    contentGap: 'space-y-4', // Between content blocks
    bottomPadding: 'pb-20', // Bottom padding for mobile nav
  },
  /** Header alignment */
  header: {
    height: 'h-9', // Standard header row height
    gap: 'gap-2', // Between header elements
  },
  /** Avatar layouts */
  avatar: {
    gap: 'gap-3', // Avatar to content gap
    textGap: 'gap-0.5', // Name to meta gap
  },
  /** Form layouts */
  form: {
    fieldGap: 'space-y-6', // Between form fields
    inputGap: 'gap-2', // Between input elements
    sectionGap: 'gap-4', // Between form sections/cards
  },
  /** Tags/badges */
  tags: {
    gap: 'gap-1.5', // Between tag badges
    wrapGap: 'gap-2', // When tags wrap to new line
  },
} as const

export const container = {
  /** Max width constraints */
  maxWidth: {
    xs: 'max-w-xs', // 320px
    sm: 'max-w-sm', // 384px
    md: 'max-w-md', // 448px - Default for feed/forms
    lg: 'max-w-lg', // 512px
    xl: 'max-w-xl', // 576px
    '2xl': 'max-w-2xl', // 672px
    '7xl': 'max-w-7xl', // 1280px - Post detail
  },
  /** Fixed heights */
  height: {
    header: 'h-14',
    bottomBar: 'h-14',
  },
  /** Sidebar widths */
  sidebar: {
    collapsed: 'w-16',
    expanded: 'w-56',
  },
} as const

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const text = {
  /** Page-level headings */
  pageTitle: 'text-2xl font-bold tracking-tight',
  /** Section headings */
  sectionTitle: 'text-[17px] font-bold leading-snug tracking-tight',
  /** Header/navigation titles */
  headerTitle: 'text-base font-bold tracking-tight',
  /** Card/component titles */
  cardTitle: 'font-bold text-base leading-tight',
  /** Dialog titles */
  dialogTitle: 'font-heading text-lg leading-none',
  /** Feed-specific */
  feedName: 'text-[15px] font-bold text-foreground leading-tight',
  feedMeta: 'text-[15px] text-muted-foreground',
  postTitle: 'text-[17px] font-bold leading-snug text-foreground',
  /** Body text */
  body: 'text-[15px] text-foreground leading-normal',
  bodyMuted: 'text-[15px] text-muted-foreground leading-normal',
  /** Small text */
  sm: 'text-sm',
  smMuted: 'text-sm text-muted-foreground',
  /** Extra small (caption) */
  xs: 'text-xs',
  xsMuted: 'text-xs text-muted-foreground',
  /** Labels */
  label: 'text-sm font-medium',
  /** Brand */
  brand: 'font-bold text-lg tracking-tight',
  // Semantic aliases for backward compatibility
  small: 'text-sm',
  smallMuted: 'text-sm text-muted-foreground',
  caption: 'text-xs',
  captionMuted: 'text-xs text-muted-foreground',
} as const

// =============================================================================
// ICONS
// =============================================================================

export const icon = {
  xs: 'size-4',
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-8',
  xl: 'size-10',
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
// COMPONENTS
// =============================================================================

export const component = {
  /** Interactive element sizes */
  button: {
    touch: 'min-h-11 min-w-11', // Touch-friendly minimum
  },
  /** Avatar sizes */
  avatar: {
    xs: 'size-6',
    sm: 'size-8',
    md: 'size-9',
    lg: 'size-20',
  },
  /** Form field heights */
  input: {
    sm: 'h-8',
    md: 'h-9',
    lg: 'h-10',
  },
} as const

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transition = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300',
  colors: 'transition-colors duration-200',
  opacity: 'transition-opacity duration-200',
  transform: 'transition-transform duration-200',
} as const

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================

export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  overlay: 'z-30',
  modal: 'z-40',
  popover: 'z-50',
  toast: 'z-[100]',
} as const

// =============================================================================
// FORM LIMITS (centralized validation constraints)
// =============================================================================

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

// =============================================================================
// UNIFIED EXPORT (for backward compatibility and convenience)
// =============================================================================

export const design = {
  spacing,
  layout,
  container,
  text,
  icon,
  component,
  transition,
  zIndex,
  limits,
} as const

// Type exports
export type SpacingKey = keyof typeof spacing
export type ContainerKey = keyof typeof container
export type TextKey = keyof typeof text
export type IconKey = keyof typeof icon
