import {
  DotsThreeIcon,
  PencilSimpleIcon,
  ShareNetworkIcon,
  TrashIcon,
  ArrowsClockwiseIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/shared'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui/menu'
import { cn } from '@/lib/utils'
import { element, layout } from '@/lib/design'
import type { UserPostRole } from '@/lib/types'

export type PostCardVariant = 'feed' | 'profile' | 'detail'

export interface PostCardProps {
  id?: string | number
  title: string
  description?: string
  role?: Array<string> | string
  image?: string
  user: {
    id?: string
    name: string
    avatar?: string
    initials?: string
  }
  /** Date string to display (e.g. "2 hours ago", "Dec 12") */
  date?: string
  /** Label for the date (e.g. "Posted", "Updated"). Defaults to "Posted" */
  dateLabel?: string
  className?: string
  /** Card variant: 'feed' for feed page, 'profile' for profile page, 'detail' for post detail page */
  variant?: PostCardVariant
  /** User's role in relation to this post: 'owner', 'collaborator', or 'viewer' */
  userRole?: UserPostRole
  /** Callback when edit is clicked (for own posts) */
  onEdit?: () => void
  /** Callback when delete is clicked (for own posts) */
  onDelete?: () => void
  /** @deprecated Use variant='detail' instead */
  isDetailView?: boolean
}

export function PostCard({
  id,
  title,
  description,
  role: _role,
  image,
  user,
  date = '2 hours ago',
  dateLabel = 'Posted',
  className,
  variant = 'feed',
  userRole = 'viewer',
  onEdit,
  onDelete,
  isDetailView = false,
}: PostCardProps) {
  const navigate = useNavigate()

  // Handle legacy isDetailView prop
  const effectiveVariant = isDetailView ? 'detail' : variant
  const isDetail = effectiveVariant === 'detail'

  // Image Content - full width with constrained height (Twitter-like)
  // We use natural aspect ratio but cap it at max-height to prevent layout-breaking tall images.
  // object-cover handles the crop gracefully if it hits the max-height.
  const imageContent = image && (
    <div className={cn(element.imageCard, 'mt-1.5')}>
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-auto object-cover max-h-[500px]"
      />
    </div>
  )

  // Owner menu (edit/delete) for own posts
  const ownerMenu = (
    <Menu>
      <MenuTrigger
        render={(props) => {
          const { onClick, ...rest } = props
          return (
            <Button
              variant="ghost"
              size="icon"
              {...rest}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.(e)
              }}
            >
              <DotsThreeIcon weight="bold" />
              <span className="sr-only">More options</span>
            </Button>
          )
        }}
      />
      <MenuPopup align="end">
        <MenuItem
          onClick={(e) => {
            e.stopPropagation()
            if (onEdit) {
              onEdit()
            } else if (id) {
              navigate({ to: '/post/$id/edit', params: { id: String(id) } })
            }
          }}
        >
          <PencilSimpleIcon className="size-4" />
          Edit
        </MenuItem>
        <MenuItem
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete && onDelete()
          }}
        >
          <TrashIcon className="size-4" />
          Delete
        </MenuItem>
      </MenuPopup>
    </Menu>
  )

  // Non-owner menu (share/report) for other people's posts
  const guestMenu = (
    <Menu>
      <MenuTrigger
        render={(props) => {
          const { onClick, ...rest } = props
          return (
            <Button
              variant="ghost"
              size="icon"
              {...rest}
              onClick={(e) => {
                e.stopPropagation()
                onClick?.(e)
              }}
            >
              <DotsThreeIcon weight="bold" />
              <span className="sr-only">More options</span>
            </Button>
          )
        }}
      />
      <MenuPopup align="end">
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <ArrowsClockwiseIcon className="size-4" />
          Repost
        </MenuItem>
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <ShareNetworkIcon className="size-4" />
          Share
        </MenuItem>
      </MenuPopup>
    </Menu>
  )

  // Derived permissions
  const isOwner = userRole === 'owner'
  const isCollaborator = userRole === 'collaborator'

  const menu = isOwner ? ownerMenu : guestMenu

  // Render Logic

  if (isDetail) {
    return (
      <article
        className={cn(
          `w-full flex flex-col gap-3 py-1 transition-colors`, // Reduced py
          className,
        )}
      >
        {/* Content Body - Full Width */}
        <div className={`flex flex-col ${layout.card.contentGap} pl-0`}>
          <p className="whitespace-pre-wrap text-base font-semibold leading-normal text-foreground/90">
            {title}
          </p>

          {imageContent}

          {description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground mt-2">
              <p>{description}</p>
            </div>
          )}
        </div>
      </article>
    )
  }

  // Feed / Profile Layout (Twitter-like: Avatar Left, Content Right)
  // Using Link wrapper for content body enables cmd/ctrl+click and better accessibility
  const postLink = id ? `/post/${String(id)}` : undefined

  return (
    <article
      className={cn(
        // Basic card structure
        `w-full flex ${layout.card.gap} ${layout.card.padding} transition-colors`,
        className,
      )}
    >
      {/* Left Column: Avatar - separate from post link */}
      <div className="shrink-0">
        <UserAvatar
          name={user.name}
          avatar={user.avatar}
          initials={user.initials}
          size="md"
          profileLink="/profile"
          showName={false}
        />
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header Row: Name + Time + Menu */}
        {/* h-9 matches md avatar height for perfect symmetry */}
        <div
          className={`flex items-start justify-between ${layout.header.gap} ${layout.header.height}`}
        >
          <div
            className={`flex flex-col justify-center h-full leading-none ${layout.avatar.textGap}`}
          >
            <div className={`flex items-center ${layout.header.gap}`}>
              <Link
                to="/profile"
                className="font-medium text-sm truncate leading-none"
              >
                {user.name}
              </Link>
              {isCollaborator && (
                <Badge variant="outline" size="sm" className="gap-1">
                  <UsersIcon className="size-3" weight="bold" />
                  Member
                </Badge>
              )}
            </div>
            <span className="text-muted-foreground text-xs font-normal leading-none block">
              {dateLabel} {date}
            </span>
          </div>

          {/* Menu - separate from post link */}
          <div className="flex h-full items-center">{menu}</div>
        </div>

        {/* Content Body - wrapped in Link for accessibility (supports cmd/ctrl+click) */}
        {postLink ? (
          <Link
            to="/post/$id"
            params={{ id: String(id) }}
            className={`group/content flex flex-col ${layout.card.contentGap} mt-2 cursor-pointer`}
          >
            <p className="whitespace-pre-wrap text-base font-semibold leading-normal text-foreground/90">
              {title}
            </p>

            {imageContent}
          </Link>
        ) : (
          <div
            className={`group/content flex flex-col ${layout.card.contentGap} mt-2`}
          >
            <p className="whitespace-pre-wrap text-base font-semibold leading-normal text-foreground/90">
              {title}
            </p>

            {imageContent}
          </div>
        )}
      </div>
    </article>
  )
}
