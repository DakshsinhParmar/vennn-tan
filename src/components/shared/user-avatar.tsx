/**
 * UserAvatar - Consistent user avatar display across the app
 *
 * Provides standardized sizing (sm, md, lg) and consistent styling
 * for user avatars in posts, notifications, profiles, etc.
 */
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { text, component } from '@/lib/design'

/** Avatar sizes from design system */
export const avatarSizes = component.avatar

export type AvatarSize = keyof typeof avatarSizes

interface UserAvatarProps {
  /** User's display name */
  name: string
  /** Optional avatar image URL */
  avatar?: string
  /** Optional initials (defaults to first letter of name) */
  initials?: string
  /** Avatar size preset */
  size?: AvatarSize
  /** Link to user profile (optional) */
  profileLink?: string
  /** Show name next to avatar */
  showName?: boolean
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the avatar */
  avatarClassName?: string
}

/**
 * Consistent user avatar with optional name display
 */
export function UserAvatar({
  name,
  avatar,
  initials,
  size = 'md',
  profileLink,
  showName = false,
  className,
  avatarClassName,
}: UserAvatarProps) {
  const displayInitials = initials ?? name.charAt(0).toUpperCase()
  const sizeClass = avatarSizes[size]

  // Typography for name based on size
  const nameClass = size === 'lg' ? text.pageTitle : `${text.small} font-medium`

  const content = (
    <>
      <Avatar className={cn(sizeClass, avatarClassName)}>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{displayInitials}</AvatarFallback>
      </Avatar>
      {showName && <span className={nameClass}>{name}</span>}
    </>
  )

  // Container classes based on layout
  const containerClass = cn(
    showName && 'flex items-center gap-2',
    profileLink && 'hover:opacity-80 transition-opacity',
    className,
  )

  if (profileLink) {
    return (
      <Link to={profileLink} className={containerClass}>
        {content}
      </Link>
    )
  }

  if (showName) {
    return <div className={containerClass}>{content}</div>
  }

  return (
    <Avatar className={cn(sizeClass, avatarClassName, className)}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{displayInitials}</AvatarFallback>
    </Avatar>
  )
}
