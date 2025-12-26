import { Link, createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { UserAvatar } from '@/components/shared'
import { text, container, spacing, element, layout } from '@/lib/design'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

// Mock Data
type NotificationType = 'received' | 'sent'

interface Notification {
  id: string
  type: NotificationType
  user: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  postId: string
  postTitle: string
  postImage?: string
  role?: string
  timestamp: string
}

const RECEIVED_NOTIFICATIONS: Array<Notification> = [
  {
    id: '1',
    type: 'received',
    user: {
      id: 'user-1',
      name: 'Michael Scott',
      initials: 'MS',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-1',
    postTitle: 'Looking for a co-founder for a new AI startup',
    postImage:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60',
    role: 'CTO',
    timestamp: '2h',
  },
  {
    id: '2',
    type: 'received',
    user: {
      id: 'user-2',
      name: 'Pam Beesly',
      initials: 'PB',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-2',
    postTitle: 'Need a designer for my portfolio',
    postImage:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60',
    role: 'Designer',
    timestamp: '5h',
  },
  {
    id: '5',
    type: 'received',
    user: {
      id: 'user-5',
      name: 'Angela Martin',
      initials: 'AM',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-5',
    postTitle: 'Building an accounting automation tool',
    postImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    role: 'Backend Developer',
    timestamp: '1d',
  },
  {
    id: '6',
    type: 'received',
    user: {
      id: 'user-6',
      name: 'Kevin Malone',
      initials: 'KM',
      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-6',
    postTitle: 'Starting a food blog network',
    postImage:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60',
    role: 'Content Creator',
    timestamp: '2d',
  },
]

const SENT_NOTIFICATIONS: Array<Notification> = [
  {
    id: '3',
    type: 'sent',
    user: {
      id: 'user-3',
      name: 'Dwight Schrute',
      initials: 'DS',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-3',
    postTitle: 'Beet Farming Assistant Needed',
    postImage:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=60',
    role: 'Assistant',
    timestamp: '1d',
  },
  {
    id: '4',
    type: 'sent',
    user: {
      id: 'user-4',
      name: 'Jim Halpert',
      initials: 'JH',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-4',
    postTitle: 'Looking for a marketing lead',
    postImage:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    role: 'Marketing Lead',
    timestamp: '3d',
  },
  {
    id: '7',
    type: 'sent',
    user: {
      id: 'user-7',
      name: 'Stanley Hudson',
      initials: 'SH',
      avatar:
        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-7',
    postTitle: 'Puzzle Game Development Team',
    postImage:
      'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&auto=format&fit=crop&q=60',
    role: 'Game Designer',
    timestamp: '5d',
  },
  {
    id: '8',
    type: 'sent',
    user: {
      id: 'user-8',
      name: 'Oscar Martinez',
      initials: 'OM',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60',
    },
    postId: 'post-8',
    postTitle: 'Financial analytics platform startup',
    postImage:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    role: 'Data Analyst',
    timestamp: '1w',
  },
]

// ... (imports remain the same, but removing extra wrapper divs if needed)

function NotificationsPage() {
  return (
    <Tabs defaultValue="received" className="w-full">
      <PageHeader
        bottom={
          <TabsList variant="underline" className={element.tabList}>
            <TabsTrigger value="received" className={element.tabTrigger}>
              Received
            </TabsTrigger>
            <TabsTrigger value="sent" className={element.tabTrigger}>
              Sent
            </TabsTrigger>
          </TabsList>
        }
      />

      <div className={`w-full ${container.maxWidth.md} mx-auto pt-4`}>
        <div className={spacing.section.items}>
          <TabsContent value="received" className="mt-0">
            {RECEIVED_NOTIFICATIONS.length > 0 ? (
              <div className={spacing.section.items}>
                {RECEIVED_NOTIFICATIONS.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="No new notifications" />
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-0">
            {SENT_NOTIFICATIONS.length > 0 ? (
              <div className={spacing.section.items}>
                {SENT_NOTIFICATIONS.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="You haven't sent any requests yet" />
            )}
          </TabsContent>
        </div>
      </div>
    </Tabs>
  )
}

function NotificationCard({ notification }: { notification: Notification }) {
  const isReceived = notification.type === 'received'

  return (
    <article
      className={`w-full flex ${layout.card.gap} ${layout.card.padding}`}
    >
      {/* Left Column: Avatar */}
      <div className="shrink-0">
        <UserAvatar
          name={notification.user.name}
          avatar={notification.user.avatar}
          initials={notification.user.initials}
          size="md"
          profileLink="/profile"
          showName={false}
        />
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header Row: Name + Time */}
        {/* h-9 matches md avatar height for perfect symmetry */}
        <div
          className={`flex items-start justify-between ${layout.header.gap} ${layout.header.height}`}
        >
          <div
            className={`flex flex-col justify-center h-full leading-none ${layout.avatar.textGap}`}
          >
            <Link
              to="/profile"
              className="font-medium text-sm truncate leading-none text-foreground cursor-pointer"
            >
              {notification.user.name}
            </Link>
            <span className="text-muted-foreground text-xs font-normal leading-none block">
              {notification.timestamp}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className={`flex flex-col ${layout.card.contentGap} mt-1`}>
          {/* Action text */}
          <p className="text-sm text-muted-foreground leading-normal">
            {isReceived
              ? 'wants to join your post as'
              : 'You requested to join as'}{' '}
            <span className="font-medium text-foreground">
              {notification.role}
            </span>
          </p>

          {/* Post title */}
          <Link
            to="/post/$id"
            params={{ id: notification.postId }}
            className="text-base font-semibold leading-snug text-foreground/90 cursor-pointer wrap-break-word"
          >
            {notification.postTitle}
          </Link>

          {/* Action buttons - Only for received */}
          {isReceived && (
            <div className={`flex ${layout.header.gap} mt-1.5`}>
              <Button size="sm">Accept</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className={text.bodyMuted}>{message}</p>
    </div>
  )
}
