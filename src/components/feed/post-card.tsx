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
import { UserAvatar, ItemRow } from '@/components/shared'
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

  const effectiveVariant = isDetailView ? 'detail' : variant
  const isDetail = effectiveVariant === 'detail'

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

  const isOwner = userRole === 'owner'
  const isCollaborator = userRole === 'collaborator'

  const menu = isOwner ? ownerMenu : guestMenu

  if (isDetail) {
    return (
      <article
        className={cn(
          `w-full flex flex-col gap-2 py-1 transition-colors`,
          className,
        )}
      >
        <div className="flex flex-col gap-1">
          <p className="whitespace-pre-wrap text-base font-semibold leading-normal text-foreground/90">
            {title}
          </p>
          {imageContent}
          {description && (
            <p className="text-[15px] leading-relaxed text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </article>
    )
  }

  const postLink = id ? `/post/${String(id)}` : undefined

  return (
    <article
      className={cn(
        `w-full flex flex-col ${layout.card.padding} transition-colors`,
        className,
      )}
    >
      <ItemRow
        left={
          <UserAvatar
            name={user.name}
            avatar={user.avatar}
            initials={user.initials}
            size="md"
            profileLink="/profile"
            showName={false}
          />
        }
        primary={
          <div className="flex items-center gap-2">
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
        }
        secondary={`${dateLabel} ${date}`}
        action={menu}
      />

      {/* Content indented to align with text (avatar 36px + gap-2 8px = 44px ≈ pl-11) */}
      <div className="pl-11">
        {postLink ? (
          <Link
            to="/post/$id"
            params={{ id: String(id) }}
            className="flex flex-col gap-1 cursor-pointer"
          >
            <p className="whitespace-pre-wrap text-base font-semibold leading-normal text-foreground/90">
              {title}
            </p>
            {imageContent}
          </Link>
        ) : (
          <div className="flex flex-col gap-1">
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
