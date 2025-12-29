import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { text, component } from '@/lib/design'

export const avatarSizes = component.avatar
export type AvatarSize = keyof typeof avatarSizes

interface UserAvatarProps {
  name: string
  avatar?: string
  initials?: string
  size?: AvatarSize
  profileLink?: string
  showName?: boolean
  className?: string
  avatarClassName?: string
}

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
  const nameClass = size === 'lg' ? text.pageTitle : 'text-sm font-medium'

  const content = (
    <>
      <Avatar className={cn(sizeClass, avatarClassName)}>
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{displayInitials}</AvatarFallback>
      </Avatar>
      {showName && <span className={nameClass}>{name}</span>}
    </>
  )

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
