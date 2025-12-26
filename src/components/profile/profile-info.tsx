import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">{user.name}</h2>
          <div className="flex gap-2">
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
        <div className="flex flex-col gap-1 mt-1">
          {user.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline underline-offset-4 transition-colors"
            >
              {new URL(link.url).hostname}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
