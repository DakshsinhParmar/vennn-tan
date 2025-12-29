import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { UserAvatar } from '@/components/shared'
import { text, container, layout } from '@/lib/design'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

interface Notification {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  postId: string
  postTitle: string
  role: string
  timestamp: string
}

const NOTIFICATIONS: Array<Notification> = [
  {
    id: '1',
    user: {
      id: 'user-1',
      name: 'Michael Scott',
      initials: 'MS',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-1',
    postTitle: 'Looking for a co-founder for a new AI startup',
    role: 'CTO',
    timestamp: '2h',
  },
  {
    id: '2',
    user: {
      id: 'user-2',
      name: 'Pam Beesly',
      initials: 'PB',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-2',
    postTitle: 'Need a designer for my portfolio',
    role: 'Designer',
    timestamp: '5h',
  },
  {
    id: '5',
    user: {
      id: 'user-5',
      name: 'Angela Martin',
      initials: 'AM',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-5',
    postTitle: 'Building an accounting automation tool',
    role: 'Backend Developer',
    timestamp: '1d',
  },
  {
    id: '6',
    user: {
      id: 'user-6',
      name: 'Kevin Malone',
      initials: 'KM',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-6',
    postTitle: 'Starting a food blog network',
    role: 'Content Creator',
    timestamp: '2d',
  },
]

function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" />
      <div className={`w-full ${container.maxWidth.md} mx-auto py-4`}>
        {NOTIFICATIONS.length > 0 ? (
          <div className="space-y-2">
            {NOTIFICATIONS.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="No notifications" />
        )}
      </div>
    </>
  )
}

function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <article className={`flex flex-col ${layout.card.padding}`}>
      {/* Header row: Avatar + Name + Time */}
      <div className="flex gap-2">
        <UserAvatar
          name={notification.user.name}
          avatar={notification.user.avatar}
          initials={notification.user.initials}
          size="md"
          profileLink="/profile"
          showName={false}
        />
        <div className="flex-1 min-w-0 flex items-center justify-between min-h-9">
          <div className="flex flex-col justify-center gap-0.5">
            <Link to="/profile" className="text-sm font-medium hover:underline">
              {notification.user.name}
            </Link>
            <span className="text-xs text-muted-foreground">
              wants to join as{' '}
              <span className="font-medium text-foreground">
                {notification.role}
              </span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground/60 shrink-0 ml-2">
            {notification.timestamp}
          </span>
        </div>
      </div>

      {/* Content: Post title + Actions - aligned with text */}
      <div className="pl-11 mt-1">
        <Link
          to="/post/$id"
          params={{ id: notification.postId }}
          className="text-sm text-foreground/80 hover:underline line-clamp-2"
        >
          {notification.postTitle}
        </Link>
        <div className="flex gap-2 mt-2">
          <Button size="sm">Accept</Button>
          <Button size="sm" variant="ghost">
            Decline
          </Button>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className={text.bodyMuted}>{message}</p>
    </div>
  )
}
