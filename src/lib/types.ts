/**
 * Shared Types
 *
 * Centralized type definitions for the application.
 */

// =============================================================================
// USER POST ROLES
// =============================================================================

/**
 * Role of the current user in relation to a post.
 * - 'owner': The user created the post
 * - 'collaborator': The user is a member/collaborator on the post
 * - 'viewer': The user has no special relationship with the post
 */
export type UserPostRole = 'owner' | 'collaborator' | 'viewer'

/**
 * Check if user can add timeline entries.
 * Owners and collaborators can add timeline entries.
 */
export function canManageTimeline(role: UserPostRole): boolean {
  return role === 'owner' || role === 'collaborator'
}

/**
 * Check if user can edit/delete a specific timeline entry.
 * - Owners can edit ANY entry
 * - Collaborators can only edit their OWN entries
 * - Viewers cannot edit anything
 */
export function canEditTimelineEntry(
  role: UserPostRole,
  isOwnEntry: boolean,
): boolean {
  if (role === 'owner') return true
  if (role === 'collaborator' && isOwnEntry) return true
  return false
}

// =============================================================================
// TIMELINE TYPES
// =============================================================================

/**
 * A timeline entry representing a milestone or update on a post.
 */
export interface TimelineEntry {
  id: string
  /** ID of the user who created this entry */
  actorId: string
  /** Information about the actor */
  actor: {
    name: string
    initials: string
    avatar?: string
  }
  /** Title/action of the entry (e.g., "released v1.0") */
  title: string
  /** Description of what happened */
  description: string
  /** Optional links for reference */
  links?: Array<{ url: string }>
  /** Display date string */
  date: string
}

/**
 * Form data for creating/editing a timeline entry.
 */
export interface TimelineEntryFormData {
  title: string
  description: string
  links: Array<{ url: string }>
}
