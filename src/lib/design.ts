/**
 * Design System - Single Source of Truth
 *
 * Inspired by Notion's design principles:
 * - Consistent spacing scale (4px base)
 * - Semantic tokens over raw values
 * - Composable patterns
 * - Minimal, intentional interactions
 */

// =============================================================================
// SPACING SCALE (4px base unit)
// =============================================================================

export const spacing = {
  // Flex/Grid gaps (2/4/6/8 scale)
  gap: {
    xs: 'gap-1', // 4px
    sm: 'gap-2', // 8px
    md: 'gap-4', // 16px
    lg: 'gap-6', // 24px
  },
  // Vertical stacks
  stack: {
    xs: 'space-y-1', // 4px
    sm: 'space-y-2', // 8px
    md: 'space-y-4', // 16px
    lg: 'space-y-6', // 24px
  },
  // Semantic section spacing
  section: {
    items: 'space-y-2', // Between list items
    fields: 'space-y-4', // Between form fields
    page: 'space-y-6', // Between page sections
  },
  // Padding
  padding: {
    page: 'px-4', // Page horizontal padding
    card: 'p-4', // Card padding
    section: 'py-4', // Section vertical padding
  },
} as const

// =============================================================================
// LAYOUT PATTERNS
// =============================================================================

export const layout = {
  // Card patterns
  card: {
    gap: 'gap-2', // 8px between avatar and content
    padding: 'py-2', // 8px vertical padding
  },
  // Page patterns
  page: {
    bottomPadding: 'pb-20',
    topPadding: 'pt-4',
  },
  // Header patterns (matches avatar height)
  header: {
    height: 'h-9', // 36px - matches md avatar
    gap: 'gap-2', // 8px
  },
  // Avatar + text patterns
  avatar: {
    textGap: 'gap-0.5', // 2px between name and subtext
  },
  // Timeline patterns
  timeline: {
    itemGap: 'gap-1', // 4px
    contentGap: 'mt-2', // 8px
  },
} as const

// =============================================================================
// CONTAINER WIDTHS
// =============================================================================

export const container = {
  maxWidth: {
    sm: 'max-w-sm', // 384px
    md: 'max-w-md', // 448px
    lg: 'max-w-lg', // 512px
    xl: 'max-w-xl', // 576px
  },
  height: {
    header: 'h-14',
    bottomBar: 'h-16',
  },
} as const

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const text = {
  // Headings
  pageTitle: 'text-xl font-semibold tracking-tight',
  sectionTitle: 'text-lg font-semibold tracking-tight',
  cardTitle: 'text-base font-semibold leading-normal',

  // Body text
  body: 'text-[15px] leading-relaxed',
  bodyMuted: 'text-[15px] text-muted-foreground leading-relaxed',

  // Small text
  sm: 'text-sm',
  smMuted: 'text-sm text-muted-foreground',
  smMedium: 'text-sm font-medium',

  // Extra small text
  xs: 'text-xs',
  xsMuted: 'text-xs text-muted-foreground',

  // Labels
  label: 'text-sm font-medium',

  // Truncation helpers
  truncate: 'truncate',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',
} as const

// =============================================================================
// ICON SIZES
// =============================================================================

export const icon = {
  xs: 'size-4', // 16px
  sm: 'size-5', // 20px
  md: 'size-6', // 24px
  lg: 'size-8', // 32px
} as const

// =============================================================================
// COMPONENT PATTERNS
// =============================================================================

export const component = {
  // Avatar sizes
  avatar: {
    xs: 'size-6', // 24px
    sm: 'size-8', // 32px
    md: 'size-9', // 36px
    lg: 'size-16', // 64px
    xl: 'size-20', // 80px
  },
  // Button patterns
  button: {
    icon: 'size-8',
    iconSm: 'size-7',
    iconLg: 'size-9',
  },
  // Input patterns
  input: {
    height: 'h-9',
    heightLg: 'h-10',
  },
} as const

// =============================================================================
// ELEMENT PATTERNS (Compound components)
// =============================================================================

export const element = {
  // Tab patterns
  tabList: 'w-full flex h-12 border-none px-0',
  tabTrigger:
    'flex-1 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none transition-colors',

  // Image card
  imageCard: 'rounded-lg border border-border/50 overflow-hidden',

  // Link item (for profile links, timeline links)
  linkItem:
    'group flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors cursor-pointer',
  linkIcon:
    'flex items-center justify-center size-5 rounded-md bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground transition-colors',

  // Divider
  divider: 'border-t border-border/50',
} as const

// =============================================================================
// TRANSITIONS & ANIMATIONS
// =============================================================================

export const transition = {
  colors: 'transition-colors duration-150',
  all: 'transition-all duration-150',
  transform: 'transition-transform duration-150',
  opacity: 'transition-opacity duration-150',
  fast: 'duration-100',
  normal: 'duration-150',
  slow: 'duration-200',
} as const

// =============================================================================
// INTERACTION STATES
// =============================================================================

export const interaction = {
  // Cursor states
  cursor: {
    pointer: 'cursor-pointer',
    default: 'cursor-default',
    notAllowed: 'cursor-not-allowed',
    wait: 'cursor-wait',
    text: 'cursor-text',
  },
  // Hover states
  hover: {
    opacity: 'hover:opacity-80',
    bg: 'hover:bg-accent',
    bgSubtle: 'hover:bg-muted/50',
    scale: 'hover:scale-[1.02]',
  },
  // Active states
  active: {
    scale: 'active:scale-[0.98]',
    opacity: 'active:opacity-90',
  },
  // Focus states
  focus: {
    ring: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    outline: 'focus-visible:outline-none',
  },
  // Disabled states
  disabled: {
    opacity: 'disabled:opacity-50',
    cursor: 'disabled:cursor-not-allowed',
    events: 'disabled:pointer-events-none',
  },
} as const

// =============================================================================
// Z-INDEX SCALE
// =============================================================================

export const zIndex = {
  base: 'z-0',
  dropdown: 'z-50',
  sticky: 'z-50',
  modal: 'z-60',
  popover: 'z-70',
  tooltip: 'z-80',
  toast: 'z-90',
} as const

// =============================================================================
// FORM VALIDATION LIMITS
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
// COMPOSED PATTERNS (Common combinations)
// =============================================================================

export const patterns = {
  // Page container
  pageContainer: 'w-full max-w-md mx-auto pb-20',

  // Card base
  card: 'rounded-lg border border-border bg-card',

  // Clickable card
  clickableCard:
    'rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer',

  // Form field wrapper
  fieldWrapper: 'w-full space-y-2',

  // Flex row with gap
  row: 'flex items-center gap-2',

  // Flex column with gap
  column: 'flex flex-col gap-2',

  // Center content
  center: 'flex items-center justify-center',

  // Truncate text
  truncate: 'min-w-0 truncate',

  // Screen reader only
  srOnly: 'sr-only',
} as const
