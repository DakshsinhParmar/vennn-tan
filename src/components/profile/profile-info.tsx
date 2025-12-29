import { Badge } from '@/components/ui/badge'
import { UserAvatar } from '@/components/shared'
import { cn } from '@/lib/utils'
import { LinkSimple } from '@phosphor-icons/react'
import { spacing, text, element } from '@/lib/design'

interface UserLink {
  url: string
}

interface User {
  id: string
  name: string
  initials: string
  avatar?: string
  intent: string[]
  links: UserLink[]
}

interface ProfileInfoProps {
  user: User
  className?: string
}

export function ProfileInfo({ user, className }: ProfileInfoProps) {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <div className={cn('flex flex-col', spacing.gap.md, className)}>
      <div className={cn('flex items-center', spacing.gap.lg)}>
        <UserAvatar
          name={user.name}
          avatar={user.avatar}
          initials={user.initials}
          size="xl"
        />
        <div className={cn('flex flex-col justify-center', spacing.gap.xs)}>
          <h2 className={text.pageTitle}>{user.name}</h2>
          <div className={cn('flex', spacing.gap.sm)}>
            {user.intent.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-md px-2 py-0.5 font-medium"
              >
                {capitalize(tag)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {user.links.length > 0 && (
        <div className={cn('flex flex-col gap-1.5', spacing.padding.section)}>
          {user.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={element.linkItem}
            >
              <div className={element.linkIcon}>
                <LinkSimple weight="bold" className="size-3.5" />
              </div>
              <span className={text.smMedium}>
                {new URL(link.url).hostname}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
