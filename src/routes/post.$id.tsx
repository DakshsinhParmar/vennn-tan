import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import {
  DotsThreeIcon,
  ShareNetworkIcon,
  TrashIcon,
  PencilSimpleIcon,
  ArrowsClockwiseIcon,
} from '@phosphor-icons/react'
import { PageHeader } from '@/components/layout/page-header'
import { PostCard } from '@/components/feed/post-card'
import { UserAvatar } from '@/components/shared'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui/menu'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPanel,
} from '@/components/ui/dialog'
import { RadioGroup, Radio } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { text, container, spacing, layout } from '@/lib/design'
import { toastManager } from '@/components/ui/toast'
import {
  Timeline,
  TimelineItem,
  TimelineHeader,
  TimelineTitle,
  TimelineContent,
  TimelineIndicator,
  TimelineSeparator,
} from '@/components/ui/timeline'
import { TimelineEntryDialog } from '@/components/timeline'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  type UserPostRole,
  type TimelineEntryFormData,
  canManageTimeline,
  canEditTimelineEntry,
} from '@/lib/types'

export const Route = createFileRoute('/post/$id')({
  component: PostPage,
})

// Current logged-in user ID (in real app, this would come from auth context)
// Change this to 'user-2' (Alex Morgan) to test collaborator permissions
// Change this to 'user-3' (David Park) to test viewer permissions
const CURRENT_USER_ID = 'current-user'

interface TimelineEvent {
  id: string
  actorId: string // ID of the user who created this event
  actor: {
    name: string
    initials: string
    avatar?: string
  }
  action: string
  date: string
  description: string
  links?: Array<{ url: string }> // Optional links for reference
}

// Mock post data - in real app this would come from API
// For demo: Post with id "1" is the current user's post
const getMockPost = (id: string) => {
  // Own post
  if (id === '1' || id === 'own') {
    return {
      id: '1',
      title: 'Looking for a co-founder for a new AI startup',
      description:
        'I have a solid idea for an AI-powered platform that will revolutionize how small businesses handle customer service. Looking for a technical co-founder who shares my vision and has experience with machine learning and scalable systems.',
      role: ['Co-founder', 'CTO'],
      availability: 'specific' as const,
      links: [
        { url: 'https://github.com' },
        { url: 'https://linkedin.com' },
        { url: 'https://docs.google.com' },
      ],
      tags: ['AI', 'Startup', 'Machine Learning', 'SaaS'],
      collaborators: [
        { id: 'user-2', name: 'Sarah Chen', initials: 'SC' },
        {
          id: 'user-3',
          name: 'Alex Morgan',
          initials: 'AM',
          avatar:
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60',
        },
      ],
      user: {
        id: CURRENT_USER_ID,
        name: 'Sarah Chen',
        initials: 'SC',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
      },
      image:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop&q=60',
      createdAt: '2 months ago',
      timeline: [
        {
          id: 't1',
          actorId: CURRENT_USER_ID,
          actor: {
            name: 'Sarah Chen',
            initials: 'SC',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
          },
          action: 'created the project',
          date: 'Nov 1, 2024',
          description: 'Initial brainstorming and market research completed.',
        },
        {
          id: 't2',
          actorId: CURRENT_USER_ID,
          actor: {
            name: 'Sarah Chen',
            initials: 'SC',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
          },
          action: 'started development',
          date: '3 weeks ago',
          description: 'Building the MVP with basic features.',
        },
        {
          id: 't3',
          actorId: 'user-3',
          actor: {
            name: 'Alex Morgan',
            initials: 'AM',
            avatar:
              'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60',
          },
          action: 'joined as collaborator',
          date: '2 days ago',
          description: 'Helping with backend architecture.',
        },
        {
          id: 't4',
          actorId: CURRENT_USER_ID,
          actor: {
            name: 'Sarah Chen',
            initials: 'SC',
            avatar:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&auto=format&fit=crop&q=60',
          },
          action: 'updated the roadmap',
          date: '5 mins ago',
          description: 'Added new milestones for Q1 2025.',
        },
      ] as TimelineEvent[],
    }
  }

  // COLLABORATOR EXAMPLE: Post where current user is a collaborator (not owner)
  // The current user CAN:
  // - Add new timeline entries
  // - Edit/delete their OWN timeline entries
  // The current user CANNOT:
  // - Delete the post
  // - Edit/delete the owner's timeline entries
  // - Edit/delete other collaborators' timeline entries
  if (id === '4' || id === 'collab') {
    return {
      id: '4',
      title: 'Building a climate tech platform - need frontend help',
      description:
        'We are creating an innovative platform to track and reduce carbon footprints for small businesses. Looking for passionate frontend developers who care about sustainability and have experience with data visualization.',
      role: ['Frontend', 'React'],
      availability: 'specific' as const,
      links: [
        { url: 'https://github.com/climatetech' },
        { url: 'https://climatetech.io' },
      ],
      tags: ['Climate', 'React', 'Data Viz', 'Sustainability'],
      collaborators: [
        {
          id: CURRENT_USER_ID, // Current user is a collaborator
          name: 'You',
          initials: 'YO',
          avatar:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
        },
        {
          id: 'user-collab-2',
          name: 'Emma Wilson',
          initials: 'EW',
          avatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
        },
      ],
      user: {
        id: 'user-owner',
        name: 'Jordan Lee',
        initials: 'JL',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
      },
      image:
        'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop&q=60',
      createdAt: '3 weeks ago',
      timeline: [
        {
          id: 't-collab-1',
          actorId: 'user-owner',
          actor: {
            name: 'Jordan Lee',
            initials: 'JL',
            avatar:
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60',
          },
          action: 'created the project',
          date: 'Dec 1, 2024',
          description: 'Initial concept and team formation.',
        },
        {
          id: 't-collab-2',
          actorId: CURRENT_USER_ID, // This is YOUR entry - you can edit this one
          actor: {
            name: 'You',
            initials: 'YO',
            avatar:
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          },
          action: 'joined as frontend developer',
          date: 'Dec 10, 2024',
          description:
            'Set up the React project with Vite and configured the design system.',
          links: [{ url: 'https://github.com/climatetech/frontend' }],
        },
        {
          id: 't-collab-3',
          actorId: 'user-collab-2',
          actor: {
            name: 'Emma Wilson',
            initials: 'EW',
            avatar:
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
          },
          action: 'added data visualization components',
          date: 'Dec 15, 2024',
          description:
            'Implemented charts for carbon footprint tracking using D3.js.',
        },
        {
          id: 't-collab-4',
          actorId: CURRENT_USER_ID, // Another one of YOUR entries - you can edit this too
          actor: {
            name: 'You',
            initials: 'YO',
            avatar:
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60',
          },
          action: 'completed dashboard UI',
          date: 'Dec 20, 2024',
          description:
            'Finished the main dashboard layout with responsive design.',
        },
      ] as TimelineEvent[],
    }
  }

  // Other user's post (viewer only - cannot add or edit anything)
  return {
    id,
    title: 'Need a React Native developer for a 3-month contract',
    description:
      'We are building a mobile app for our e-commerce platform and need an experienced React Native developer to help us deliver the project on time. Must have experience with TypeScript and Redux.',
    role: ['Developer'],
    availability: 'specific' as const,
    links: [
      { url: 'https://github.com/company' },
      { url: 'https://company.com' },
    ],
    tags: ['React Native', 'Mobile', 'TypeScript', 'Contract'],
    collaborators: [] as {
      id: string
      name: string
      initials: string
      avatar?: string
    }[],
    user: {
      id: 'user-other',
      name: 'David Park',
      initials: 'DP',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
    },
    image:
      'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=60',
    createdAt: '1 week ago',
    timeline: [
      {
        id: 't-other-1',
        actorId: 'user-other',
        actor: {
          name: 'David Park',
          initials: 'DP',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60',
        },
        action: 'posted the job',
        date: '1 week ago',
        description: 'Requirements gathering and team assembly.',
      },
    ] as TimelineEvent[],
  }

  // --- Test Cases ---

  // No Image Post
  if (id === '6' || id === 'no-image') {
    return {
      id: '6',
      title: 'Discussion: Future of No-Code Tools',
      description:
        'I believe no-code tools are becoming increasingly sophisticated. What are your thoughts on their impact on traditional development roles?',
      role: ['Product', 'Discussion'],
      availability: 'open' as const,
      links: [],
      tags: ['No-Code', 'Product'],
      collaborators: [],
      user: {
        id: 'user-2',
        name: 'Alex Rivera',
        initials: 'AR',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
      },
      image: '',
      createdAt: '1 day ago',
      timeline: [],
    }
  }

  // No Description Post
  if (id === '7' || id === 'no-desc') {
    return {
      id: '7',
      title: 'Just updated my portfolio with new case studies!',
      description: '',
      role: ['Design'],
      availability: 'open' as const,
      links: [{ url: 'https://portfolio.com' }],
      tags: ['Design', 'Portfolio'],
      collaborators: [],
      user: {
        id: 'user-3',
        name: 'Maria Garcia',
        initials: 'MG',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=60',
      },
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
      createdAt: '2 days ago',
      timeline: [],
    }
  }

  // Minimal Post (No Image, No Description)
  if (id === '8' || id === 'minimal') {
    return {
      id: '8',
      title: 'Quick question: Best React state management library in 2024?',
      description: '',
      role: ['React', 'Question'],
      availability: 'open' as const,
      links: [],
      tags: ['React', 'State Management'],
      collaborators: [],
      user: {
        id: 'user-5',
        name: 'Taylor Kim',
        initials: 'TK',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
      },
      image: '',
      createdAt: '3 days ago',
      timeline: [],
    }
  }

  // Fallback for any other ID
  return {
    id,
    title: 'Post not found',
    description: '',
    role: [],
    availability: 'open' as const,
    links: [],
    tags: [],
    collaborators: [],
    user: {
      id: 'unknown',
      name: 'Unknown User',
      initials: 'UU',
    },
    image: '',
    createdAt: 'now',
    timeline: [],
  }
}

type JoinState = 'join' | 'joined' | 'requested'
type Availability = 'open' | 'specific' | 'hybrid'

// Derive roles from post data
const getRoles = (post: ReturnType<typeof getMockPost>): string[] => {
  if (!post.role) return []
  return Array.isArray(post.role) ? post.role : [post.role]
}

// Check if role selection is needed
const needsRoleSelection = (
  availability: Availability,
  roles: string[],
): boolean => {
  return (
    (availability === 'specific' || availability === 'hybrid') &&
    roles.length > 0
  )
}

function PostPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [joinState, setJoinState] = useState<JoinState>('join')

  // Role Selection State
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [roleError, setRoleError] = useState<string>('')

  // Timeline Edit State
  const [showTimelineDialog, setShowTimelineDialog] = useState(false)
  const [editingTimelineItem, setEditingTimelineItem] =
    useState<TimelineEvent | null>(null)

  // Delete Confirmation State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<TimelineEvent | null>(null)

  // Get post data based on ID
  // In a real app, this should be a state/effect to allow updates
  const post = getMockPost(id)

  // Derive user role from post data
  const userRole: UserPostRole = (() => {
    if (post.user.id === CURRENT_USER_ID) return 'owner'
    if (post.collaborators.some((c) => c.id === CURRENT_USER_ID))
      return 'collaborator'
    return 'viewer'
  })()

  const isOwner = userRole === 'owner'

  // --- Handlers ---

  const roles = getRoles(post)
  const hasRoleSelection = needsRoleSelection(post.availability, roles)

  const handleJoinClick = useCallback(() => {
    if (joinState === 'join') {
      if (hasRoleSelection) {
        setShowRoleDialog(true)
        setSelectedRole('')
        setRoleError('')
      } else {
        setJoinState('requested')
      }
    } else if (joinState === 'requested') {
      setJoinState('join')
    } else {
      setJoinState('join')
    }
  }, [joinState, hasRoleSelection])

  const handleRoleSubmit = useCallback(() => {
    if (!selectedRole) {
      setRoleError('Please select a role to apply for')
      return
    }
    setRoleError('')
    setShowRoleDialog(false)
    setJoinState('requested')
    // In real app: submit application with selectedRole
  }, [selectedRole])

  const handleDialogClose = useCallback(() => {
    setShowRoleDialog(false)
    setSelectedRole('')
    setRoleError('')
  }, [])

  const handleEditClick = useCallback(() => {
    navigate({ to: '/post/$id/edit', params: { id } })
  }, [navigate, id])

  const handleDeletePost = useCallback(() => {
    // In real app, this would call an API to delete the post
    toastManager.add({
      type: 'success',
      title: 'Post deleted',
      description: 'Your post has been deleted.',
    })
    navigate({ to: '/' })
  }, [navigate])

  // --- Timeline Handlers ---

  const handleAddTimelineClick = useCallback(() => {
    setEditingTimelineItem(null)
    setShowTimelineDialog(true)
  }, [])

  const handleEditTimelineItemClick = useCallback((item: TimelineEvent) => {
    setEditingTimelineItem(item)
    setShowTimelineDialog(true)
  }, [])

  const handleDeleteTimelineItemClick = useCallback((item: TimelineEvent) => {
    setDeleteTarget(item)
    setShowDeleteDialog(true)
  }, [])

  const confirmDeleteTimelineItem = useCallback(() => {
    if (!deleteTarget) return
    // In real app: API call
    toastManager.add({
      type: 'success',
      title: 'Update deleted',
      description: 'The timeline update has been removed.',
    })
    setShowDeleteDialog(false)
    setDeleteTarget(null)
    // Update local state...
  }, [deleteTarget])

  const handleTimelineSubmit = useCallback(
    (data: TimelineEntryFormData) => {
      // In real app: API call
      const message = editingTimelineItem ? 'Timeline updated' : 'Update added'
      toastManager.add({
        type: 'success',
        title: message,
        description: 'Your timeline has been updated.',
      })

      setShowTimelineDialog(false)
      console.log('Timeline entry submitted:', data)
    },
    [editingTimelineItem],
  )

  const getJoinButtonProps = () => {
    switch (joinState) {
      case 'join':
        return {
          children: 'Join',
          variant: 'default' as const,
          onClick: handleJoinClick,
        }
      case 'joined':
        return {
          children: 'Joined',
          variant: 'secondary' as const,
          onClick: handleJoinClick,
        }
      case 'requested':
        return {
          children: 'Requested',
          variant: 'outline' as const,
          onClick: handleJoinClick,
        }
    }
  }

  const joinButtonProps = getJoinButtonProps()

  // Menu for PageHeader
  const headerMenu = (
    <Menu>
      <MenuTrigger
        render={(props) => <Button variant="ghost" size="icon" {...props} />}
      >
        <DotsThreeIcon weight="bold" />
        <span className="sr-only">More options</span>
      </MenuTrigger>
      <MenuPopup align="end">
        {isOwner ? (
          <MenuItem variant="destructive" onClick={handleDeletePost}>
            <TrashIcon className="size-4" />
            Delete
          </MenuItem>
        ) : (
          <>
            <MenuItem onClick={() => {}}>
              <ArrowsClockwiseIcon className="size-4" />
              Repost
            </MenuItem>
            <MenuItem onClick={() => {}}>
              <ShareNetworkIcon className="size-4" />
              Share
            </MenuItem>
          </>
        )}
      </MenuPopup>
    </Menu>
  )

  // Get update date from last timeline event or createdAt
  const lastEvent =
    post.timeline && post.timeline.length > 0
      ? post.timeline[post.timeline.length - 1]
      : null
  const displayDate = lastEvent ? lastEvent.date : post.createdAt
  const dateLabel = lastEvent ? 'Updated' : 'Posted'

  return (
    <div className="w-full flex justify-center">
      <div className={`w-full ${container.maxWidth.md} min-w-0 pb-12 mx-auto`}>
        <PageHeader
          title="Post"
          showBackButton
          className="mb-4"
          primaryAction={
            <Button
              variant={isOwner ? 'default' : joinButtonProps.variant}
              onClick={isOwner ? handleEditClick : joinButtonProps.onClick}
            >
              {isOwner ? 'Edit' : joinButtonProps.children}
            </Button>
          }
          secondaryAction={headerMenu}
        />

        {/* Main Card */}
        <div className="mb-8">
          <PostCard
            id={post.id}
            title={post.title}
            role={post.role}
            image={post.image}
            user={post.user}
            className="border-none shadow-none p-0"
            variant="detail"
            userRole={userRole}
            onEdit={handleEditClick}
            onDelete={handleDeletePost}
            date={displayDate}
            dateLabel={dateLabel}
            description={post.description}
          />
        </div>

        {/* Details Section */}
        <div className={`${spacing.stack.xl}`}>
          {/* Description & Tags */}
          <div className={spacing.stack.md}></div>

          {/* Links */}
          {post.links.length > 0 && (
            <div className={spacing.stack.sm}>
              <h3 className={text.label}>Links</h3>
              <div className="flex flex-col gap-1">
                {post.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium hover:underline underline-offset-4 transition-colors"
                  >
                    {link.url
                      .replace(/^https?:\/\/(www\.)?/, '')
                      .replace(/\/$/, '')}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {post.timeline && post.timeline.length > 0 && (
            <div className={spacing.stack.sm}>
              <div className="flex items-center justify-between">
                <h3 className={text.label}>Timeline</h3>
                {canManageTimeline(userRole) && (
                  <Button variant="outline" onClick={handleAddTimelineClick}>
                    Update
                  </Button>
                )}
              </div>
              <div className="pt-2">
                <Timeline>
                  {post.timeline.map((event, index) => {
                    const isOwnEntry = event.actorId === CURRENT_USER_ID
                    const canEdit = canEditTimelineEntry(userRole, isOwnEntry)
                    return (
                      <TimelineItem key={index} step={index + 1}>
                        <TimelineHeader className="flex justify-between items-center min-h-9">
                          <TimelineSeparator />
                          <div className="flex flex-col flex-1 min-w-0">
                            <TimelineTitle className="leading-none">
                              <div
                                className={`flex flex-col justify-center leading-none ${layout.avatar.textGap}`}
                              >
                                <span className="font-medium text-sm truncate leading-none text-foreground">
                                  {event.actor.name}
                                </span>
                                <span className="text-muted-foreground text-xs font-normal leading-none block">
                                  {event.action.charAt(0).toUpperCase() +
                                    event.action.slice(1)}{' '}
                                  • {event.date}
                                </span>
                              </div>
                            </TimelineTitle>
                          </div>

                          {/* Edit/Delete Menu for Timeline Item */}
                          {canEdit && (
                            <Menu>
                              <MenuTrigger
                                render={(props) => (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    {...props}
                                    className="h-8 w-8"
                                  />
                                )}
                              >
                                <DotsThreeIcon weight="bold" />
                                <span className="sr-only">Event options</span>
                              </MenuTrigger>
                              <MenuPopup align="end">
                                <MenuItem
                                  onClick={() =>
                                    handleEditTimelineItemClick(event)
                                  }
                                >
                                  <PencilSimpleIcon className="size-4" />
                                  Edit update
                                </MenuItem>
                                <MenuItem
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteTimelineItemClick(event)
                                  }
                                >
                                  <TrashIcon className="size-4" />
                                  Delete update
                                </MenuItem>
                              </MenuPopup>
                            </Menu>
                          )}

                          <TimelineIndicator className="border-none bg-background">
                            <UserAvatar
                              name={event.actor.name}
                              avatar={event.actor.avatar}
                              initials={event.actor.initials}
                              size="md"
                            />
                          </TimelineIndicator>
                        </TimelineHeader>
                        <TimelineContent className="mt-2 rounded-lg border px-4 py-3 text-foreground bg-muted/20">
                          {event.description}
                          {event.links && event.links.length > 0 && (
                            <div className={`flex flex-col gap-1 mt-2`}>
                              {event.links.map((link, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium hover:underline underline-offset-4 transition-colors"
                                >
                                  {link.url
                                    .replace(/^https?:\/\/(www\.)?/, '')
                                    .replace(/\/$/, '')}
                                </a>
                              ))}
                            </div>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    )
                  })}
                </Timeline>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Selection Dialog - only show for non-owners */}
      {!isOwner && (
        <Dialog open={showRoleDialog} onOpenChange={handleDialogClose}>
          <DialogPopup>
            <DialogHeader>
              <DialogTitle>Select a role</DialogTitle>
              <DialogDescription>
                Choose which role you'd like to apply for on this project.
              </DialogDescription>
            </DialogHeader>
            <DialogPanel>
              <Field invalid={!!roleError}>
                <FieldLabel>Available roles</FieldLabel>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => {
                    setSelectedRole(value as string)
                    setRoleError('')
                  }}
                  className="gap-2"
                >
                  {roles.map((role) => (
                    <label
                      key={role}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-muted/50 has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <Radio value={role} />
                      <span className="text-sm font-medium">{role}</span>
                    </label>
                  ))}
                </RadioGroup>
                {roleError && <FieldError>{roleError}</FieldError>}
              </Field>
            </DialogPanel>
            <DialogFooter variant="bare" className="sm:justify-stretch">
              <Button
                onClick={handleRoleSubmit}
                className="w-full sm:w-auto sm:flex-1"
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogPopup>
        </Dialog>
      )}

      {/* Timeline Add/Edit Dialog */}
      <TimelineEntryDialog
        open={showTimelineDialog}
        onOpenChange={setShowTimelineDialog}
        mode={editingTimelineItem ? 'edit' : 'add'}
        initialValues={
          editingTimelineItem
            ? {
                title: editingTimelineItem.action,
                description: editingTimelineItem.description,
                links: editingTimelineItem.links ?? [],
              }
            : undefined
        }
        onSubmit={handleTimelineSubmit}
      />

      {/* Delete Timeline Update Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete update?"
        description="This will permanently remove this timeline update. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteTimelineItem}
      />
    </div>
  )
}
